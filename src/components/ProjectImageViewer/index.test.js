import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectImageViewer from './index'

const image = {
  src: '/work/emmut-maintenance-desktop.png',
  alt: 'Actual Emmut desktop component with synthetic demo workers.',
  title: 'Emmut desktop screenshot',
  caption: 'Actual application component rendered with synthetic demo data.',
  width: 2560,
  height: 1600,
}
const originalShowModal = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  'showModal'
)
const originalClose = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  'close'
)

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: jest.fn(function () {
      this.setAttribute('open', '')
    }),
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: jest.fn(function () {
      this.removeAttribute('open')
    }),
  })
})
afterEach(() => {
  for (const [name, descriptor] of [
    ['showModal', originalShowModal],
    ['close', originalClose],
  ]) {
    if (descriptor)
      Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
    else delete HTMLDialogElement.prototype[name]
  }
  document.body.style.overflow = ''
})

test('native dialog keeps caption, traps keyboard focus, and returns focus after Escape', async () => {
  const user = userEvent.setup()
  render(<ProjectImageViewer {...image} />)
  const opener = screen.getByRole('button', {
    name: 'Enlarge Emmut desktop screenshot',
  })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await user.click(opener)
  const modal = screen.getByRole('dialog', { name: image.title })
  expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1)
  expect(within(modal).getByText(image.caption)).toBeVisible()
  const close = within(modal).getByRole('button', {
    name: 'Close image viewer',
  })
  expect(close).toHaveFocus()
  await user.tab({ shift: true })
  const surface = within(modal).getByRole('region', { name: /enlarged image/ })
  expect(surface).toHaveFocus()
  await user.tab()
  expect(close).toHaveFocus()
  await user.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(opener).toHaveFocus()
  expect(document.body.style.overflow).toBe('')
})

test('actual size, zoom, keyboard panning and fit reset work without changing the original image', async () => {
  const user = userEvent.setup()
  render(<ProjectImageViewer {...image} />)
  await user.click(screen.getByRole('button', { name: /Enlarge/ }))
  const modal = screen.getByRole('dialog')
  const surface = within(modal).getByRole('region', { name: /enlarged image/ })
  Object.defineProperties(surface, {
    clientWidth: { configurable: true, value: 640 },
    clientHeight: { configurable: true, value: 480 },
  })
  fireEvent(window, new Event('resize'))
  await user.click(within(modal).getByRole('button', { name: 'Actual size' }))
  const enlarged = within(surface).getByRole('img')
  expect(enlarged).toHaveStyle({ width: '2560px', height: '1600px' })
  expect(within(modal).getByLabelText('Image zoom')).toHaveTextContent('100%')
  surface.focus()
  surface.scrollLeft = 0
  surface.scrollTop = 0
  await user.keyboard('{ArrowRight}{ArrowDown}')
  expect(surface.scrollLeft).toBe(100)
  expect(surface.scrollTop).toBe(100)
  await user.keyboard('+')
  expect(enlarged).toHaveStyle({ width: '3840px', height: '2400px' })
  await user.keyboard('0')
  expect(within(modal).getByLabelText('Image zoom')).toHaveTextContent('Fit')
  expect(surface.scrollLeft).toBe(0)
  expect(surface.scrollTop).toBe(0)
  expect(enlarged).toHaveAttribute('src', image.src)
})

test('fallback hides background, closes on backdrop and restores existing state on close or unmount', async () => {
  delete HTMLDialogElement.prototype.showModal
  document.body.style.overflow = 'scroll'
  const user = userEvent.setup()
  const { container, unmount } = render(<ProjectImageViewer {...image} />)
  // The fallback restores attributes on the React host boundary, outside the component.
  // eslint-disable-next-line testing-library/no-container
  container.setAttribute('aria-hidden', 'false')
  const opener = screen.getByRole('button', { name: /Enlarge/ })
  await user.click(opener)
  expect(container).toHaveAttribute('inert')
  expect(container).toHaveAttribute('aria-hidden', 'true')
  const modal = screen.getByRole('dialog')
  // The noninteractive backdrop is the dialog's boundary, without its own role.
  // eslint-disable-next-line testing-library/no-node-access
  const backdrop = modal.parentElement
  fireEvent.pointerDown(backdrop)
  fireEvent.click(backdrop)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(container).not.toHaveAttribute('inert')
  expect(container).toHaveAttribute('aria-hidden', 'false')
  expect(document.body.style.overflow).toBe('scroll')
  expect(opener).toHaveFocus()
  await user.click(opener)
  act(() => unmount())
  expect(document.body.style.overflow).toBe('scroll')
  expect(container).not.toHaveAttribute('inert')
})
