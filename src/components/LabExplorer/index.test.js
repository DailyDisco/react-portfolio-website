import { render, screen, within } from '@testing-library/react'
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
  expect(screen.getByText('TabbyAPI', { selector: 'dd' })).toBeVisible()
  expect(screen.getByText('ExLlamaV3', { selector: 'dd' })).toBeVisible()
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
