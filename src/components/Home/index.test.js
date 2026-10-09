import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Home from './index'

test('project controls update the evidence and destination while retaining keyboard focus', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  const selectors = within(
    screen.getByRole('group', { name: 'Choose a project' })
  )
  const product = selectors.getByRole('button', { name: /Product/ })
  expect(product).toHaveAttribute('aria-pressed', 'true')
  expect(
    screen.getByRole('link', { name: 'Open Emmut case study' })
  ).toHaveAttribute('href', '/work/property-platform')

  product.focus()
  await user.tab()
  await user.keyboard('{Enter}')
  const cloud = selectors.getByRole('button', { name: /Cloud/ })
  expect(cloud).toHaveFocus()
  expect(cloud).toHaveAttribute('aria-pressed', 'true')
  expect(product).toHaveAttribute('aria-pressed', 'false')
  expect(
    screen.getByText('Production workflows. Cut over September 2026.')
  ).toBeVisible()
  expect(
    screen.getByRole('link', { name: 'Open AWS → Railway case study' })
  ).toHaveAttribute('href', '/work/workflow-migration')

  await user.tab()
  await user.keyboard(' ')
  expect(selectors.getByRole('button', { name: /Systems/ })).toHaveFocus()
  expect(cloud).toHaveAttribute('aria-pressed', 'false')
  expect(
    screen.getByText('Faster cold prompt processing. Measured on six GPUs.')
  ).toBeVisible()
  expect(
    screen.getByRole('link', { name: 'Open Local inference case study' })
  ).toHaveAttribute('href', '/work/local-inference')
})
