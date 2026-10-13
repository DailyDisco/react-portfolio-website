import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ServerExplorer from './index'
import { createServerScene } from './scene'

jest.mock('./scene', () => ({ createServerScene: jest.fn() }))

const original = {
  matchMedia: window.matchMedia,
  IntersectionObserver: window.IntersectionObserver,
  ResizeObserver: window.ResizeObserver,
}
let scene
let callbacks
let preference
let preferenceListener
let disconnects

beforeEach(() => {
  jest.clearAllMocks()
  disconnects = []
  preference = {
    matches: false,
    addEventListener: jest.fn((name, listener) => {
      preferenceListener = listener
    }),
    removeEventListener: jest.fn(),
  }
  window.matchMedia = jest.fn(() => preference)
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback
      this.disconnect = jest.fn()
      disconnects.push(this.disconnect)
    }
    observe() {
      this.callback([{ isIntersecting: true }])
    }
  }
  window.ResizeObserver = class {
    constructor() {
      this.disconnect = jest.fn()
      disconnects.push(this.disconnect)
    }
    observe() {}
  }
  scene = Object.fromEntries(
    [
      'resize',
      'setRotation',
      'setExploded',
      'setHighlight',
      'setActive',
      'setReducedMotion',
      'dispose',
    ].map((name) => [name, jest.fn()])
  )
  createServerScene.mockImplementation((canvas, options) => {
    callbacks = options
    options.onReady()
    return scene
  })
})

afterEach(() => {
  Object.assign(window, original)
})

function mount() {
  return render(
    <ServerExplorer
      fallback={<svg role="img" aria-label="Seven-GPU static schematic" />}
    />
  )
}
async function activate(user) {
  await user.click(screen.getByRole('button', { name: 'Explore 3D' }))
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Rotate left' })).toBeEnabled()
  )
}

test('3D is opt-in and native controls expose rotation, chassis and hardware explanations', async () => {
  const user = userEvent.setup()
  mount()
  expect(
    screen.getByRole('img', { name: 'Seven-GPU static schematic' })
  ).toBeVisible()
  expect(
    screen.queryByRole('img', { name: /Interactive schematic/, hidden: true })
  ).not.toBeInTheDocument()
  expect(createServerScene).not.toHaveBeenCalled()
  await activate(user)
  await user.click(screen.getByRole('button', { name: 'Rotate right' }))
  expect(scene.setRotation).toHaveBeenLastCalledWith(30)
  await user.click(screen.getByRole('button', { name: 'Open chassis' }))
  expect(screen.getByRole('button', { name: 'Close chassis' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  expect(scene.setExploded).toHaveBeenLastCalledWith(true)
  await user.click(screen.getByRole('button', { name: 'Memory' }))
  expect(screen.getByText('168 GiB combined.')).toBeVisible()
  expect(scene.setHighlight).toHaveBeenLastCalledWith('memory')
  await user.click(screen.getByRole('button', { name: 'Airflow' }))
  expect(
    screen.getByText(/airflow arrangement here is conceptual/)
  ).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Reset view' }))
  expect(scene.setRotation).toHaveBeenLastCalledWith(0)
  expect(screen.getByRole('button', { name: 'Open chassis' })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
  await user.click(
    screen.getByRole('button', { name: 'Return to illustration' })
  )
  expect(scene.dispose).toHaveBeenCalledTimes(1)
  expect(
    screen.queryByRole('img', { name: /Interactive schematic/, hidden: true })
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('img', { name: 'Seven-GPU static schematic' })
  ).toBeVisible()
})

test('unsupported browser APIs retain the static schematic and readable hardware notes', async () => {
  window.IntersectionObserver = undefined
  const user = userEvent.setup()
  mount()
  await user.click(screen.getByRole('button', { name: 'Explore 3D' }))
  expect(createServerScene).not.toHaveBeenCalled()
  expect(screen.getByRole('status')).toHaveTextContent('3D is unavailable here')
  expect(
    screen.getByRole('img', { name: 'Seven-GPU static schematic' })
  ).toBeVisible()
  expect(screen.getByRole('button', { name: 'Rotate left' })).toBeDisabled()
  await user.click(screen.getByRole('button', { name: 'Memory' }))
  expect(screen.getByText('168 GiB combined.')).toBeVisible()
})

test('a WebGL initialization failure leaves a usable static fallback', async () => {
  createServerScene.mockImplementation(() => {
    throw new Error('No WebGL context')
  })
  const user = userEvent.setup()
  mount()
  await user.click(screen.getByRole('button', { name: 'Explore 3D' }))
  await waitFor(() =>
    expect(screen.getByRole('status')).toHaveTextContent(
      '3D is unavailable here'
    )
  )
  expect(
    screen.getByRole('img', { name: 'Seven-GPU static schematic' })
  ).toBeVisible()
  await user.click(
    screen.getByRole('button', { name: 'Return to illustration' })
  )
  expect(screen.getByRole('button', { name: 'Explore 3D' })).toHaveAttribute(
    'aria-expanded',
    'false'
  )
})

test('context recovery restores controls and live reduced motion reaches the scene', async () => {
  const user = userEvent.setup()
  mount()
  await activate(user)
  act(() => callbacks.onUnavailable())
  expect(
    screen.getByRole('img', { name: 'Seven-GPU static schematic' })
  ).toBeVisible()
  expect(screen.getByRole('button', { name: 'Rotate right' })).toBeDisabled()
  act(() => callbacks.onReady())
  expect(screen.getByRole('button', { name: 'Rotate right' })).toBeEnabled()
  act(() => {
    preference.matches = true
    preferenceListener()
  })
  expect(scene.setReducedMotion).toHaveBeenLastCalledWith(true)
})

test('unmounting the explorer releases its scene, observers and preference listener', async () => {
  const user = userEvent.setup()
  const view = mount()
  await activate(user)
  view.unmount()
  expect(scene.dispose).toHaveBeenCalledTimes(1)
  for (const disconnect of disconnects)
    expect(disconnect).toHaveBeenCalledTimes(1)
  expect(preference.removeEventListener).toHaveBeenCalledWith(
    'change',
    preferenceListener
  )
})
