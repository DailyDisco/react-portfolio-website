import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LabExplorer from './index'

test('starts with the seven-GPU machine and its supported memory figures', () => {
  render(<LabExplorer />)
  expect(screen.getByRole('button', { name: 'The machine' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  expect(screen.getByRole('button', { name: 'The software' })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
  expect(screen.getByRole('button', { name: 'The homelab' })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
  expect(screen.getByText('7 × NVIDIA RTX 3090')).toBeVisible()
  expect(screen.getByText('24 GiB each · 168 GiB combined')).toBeVisible()
  expect(
    screen.getByRole('img', { name: /seven RTX 3090 GPUs/ })
  ).toBeInTheDocument()
})

test('switching views changes both the schematic and engineering details', async () => {
  const user = userEvent.setup()
  render(<LabExplorer />)
  await user.click(screen.getByRole('button', { name: 'The software' }))

  expect(screen.getByRole('button', { name: 'The software' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  expect(screen.getByRole('button', { name: 'The machine' })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
  expect(
    screen.getByText('OpenAI-compatible gateway', { selector: 'dd' })
  ).toBeVisible()
  expect(screen.getByText('Maya', { selector: 'dd' })).toBeVisible()
  expect(
    screen.getByText('TabbyAPI + ExLlamaV3', { selector: 'dd' })
  ).toBeVisible()
  expect(
    screen.getByRole('img', { name: /Conceptual request path/ })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('img', { name: /seven RTX 3090 GPUs/ })
  ).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'The homelab' }))
  const compute = screen.getByRole('list', {
    name: 'Compute & delivery technologies',
  })
  for (const technology of ['Proxmox', 'Linux', 'Docker Compose']) {
    expect(within(compute).getByText(technology)).toBeVisible()
  }
  const networking = screen.getByRole('list', {
    name: 'Networking technologies',
  })
  for (const technology of ['Tailscale', 'Caddy']) {
    expect(within(networking).getByText(technology)).toBeVisible()
  }
  expect(
    screen.getByText('Metrics, logs, backup and restore validation')
  ).toBeVisible()
  expect(
    screen.getByRole('img', { name: /Capabilities map/ })
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'The software' })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
})

test('keyboard users can select every view without focus being moved into the drawing', async () => {
  const user = userEvent.setup()
  render(<LabExplorer compact />)
  await user.tab()
  expect(screen.getByRole('button', { name: 'The machine' })).toHaveFocus()
  await user.tab()
  await user.keyboard(' ')
  expect(screen.getByRole('button', { name: 'The software' })).toHaveFocus()
  expect(screen.getByRole('button', { name: 'The software' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await user.tab()
  await user.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: 'The homelab' })).toHaveFocus()
  expect(screen.getByRole('button', { name: 'The homelab' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await user.tab({ shift: true })
  await user.tab({ shift: true })
  await user.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: 'The machine' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  expect(
    screen.getByRole('img', { name: /seven RTX 3090 GPUs/ })
  ).toBeInTheDocument()
})

test('the request trace starts on demand, can replay, and resets when changing views', async () => {
  const user = userEvent.setup()
  render(<LabExplorer />)
  expect(
    screen.queryByRole('button', { name: 'Trace a request' })
  ).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'The software' }))
  expect(screen.getByRole('status')).toHaveTextContent(
    'Coding agent → gateway → model server → local GPUs.'
  )
  expect(screen.getByRole('status')).not.toHaveTextContent('Tracing')

  await user.click(screen.getByRole('button', { name: 'Trace a request' }))
  expect(screen.getByRole('status')).toHaveTextContent(
    'Tracing the conceptual request path.'
  )
  await user.click(screen.getByRole('button', { name: 'Replay request trace' }))
  expect(screen.getByRole('status')).toHaveTextContent('Tracing')

  await user.click(screen.getByRole('button', { name: 'The machine' }))
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'The software' }))
  expect(screen.getByRole('button', { name: 'Trace a request' })).toBeVisible()
  expect(screen.getByRole('status')).not.toHaveTextContent('Tracing')
  expect(screen.getByRole('status')).not.toHaveTextContent('Trace complete')
})

test('reduced-motion visitors get the complete request explanation immediately', async () => {
  const originalMatchMedia = window.matchMedia
  window.matchMedia = jest.fn(() => ({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }))
  try {
    const user = userEvent.setup()
    render(<LabExplorer />)
    await user.click(screen.getByRole('button', { name: 'The software' }))
    await user.click(screen.getByRole('button', { name: 'Trace a request' }))

    expect(screen.getByRole('status')).toHaveTextContent('Trace complete.')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Coding agent → gateway → model server → local GPUs.'
    )
    expect(
      screen.getByRole('img', { name: /Maya is the default backend/ })
    ).toBeVisible()
    await user.click(
      screen.getByRole('button', { name: 'Replay request trace' })
    )
    expect(screen.getByRole('status')).toHaveTextContent('Trace complete.')
  } finally {
    window.matchMedia = originalMatchMedia
  }
})

test('enabling reduced motion during a trace completes it without waiting for an animation', async () => {
  const originalMatchMedia = window.matchMedia
  let preferenceListener
  const preference = {
    matches: false,
    addEventListener: jest.fn((event, listener) => {
      preferenceListener = listener
    }),
    removeEventListener: jest.fn(),
  }
  window.matchMedia = jest.fn(() => preference)
  try {
    const user = userEvent.setup()
    render(<LabExplorer />)
    await user.click(screen.getByRole('button', { name: 'The software' }))
    await user.click(screen.getByRole('button', { name: 'Trace a request' }))
    expect(screen.getByRole('status')).toHaveTextContent('Tracing')

    act(() => {
      preference.matches = true
      preferenceListener()
    })
    expect(screen.getByRole('status')).toHaveTextContent('Trace complete.')
  } finally {
    window.matchMedia = originalMatchMedia
  }
})
