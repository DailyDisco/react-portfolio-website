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

test('the homepage keeps hiring evidence, deeper work, and contact actions immediately available', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const portfolio = screen.getByRole('region', {
    name: 'Digital Diego portfolio',
  })
  expect(
    within(portfolio).getByText('Full-stack engineer & technical lead.')
  ).toBeVisible()
  expect(
    within(portfolio).getByText(/Open to senior & lead roles/)
  ).toBeVisible()
  expect(
    within(portfolio).getByText(/four-developer team.*1,000\+ units/)
  ).toBeVisible()
  expect(
    within(portfolio).getByText('Daily admin work per employee. Measured.')
  ).toBeVisible()
  expect(
    within(portfolio).getByRole('link', { name: /All projects/ })
  ).toHaveAttribute('href', '/portfolio')
  expect(
    within(portfolio).getByRole('link', { name: /Seven GPUs/ })
  ).toHaveAttribute('href', '/infrastructure')
  expect(
    within(portfolio).getByRole('link', { name: /Download resume/ })
  ).toHaveAttribute('href', '/resume/Diego_Espino_Resume.pdf')
  const contact = within(screen.getByRole('contentinfo'))
  expect(contact.getByRole('link', { name: 'Email' })).toHaveAttribute(
    'href',
    'mailto:diegoespinowork@gmail.com'
  )
  expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/DailyDisco'
  )
  expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/developerdiego/'
  )
  expect(contact.getByRole('link', { name: /About me/ })).toHaveAttribute(
    'href',
    '/about'
  )
})

test('visitors can pause the mascot and still navigate all project evidence', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  const pause = screen.getByRole('button', { name: /Pause animation/ })
  await user.click(pause)
  expect(pause).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: /Resume animation/ })).toHaveFocus()
  await user.click(screen.getByRole('button', { name: /Systems/ }))
  expect(
    screen.getByRole('link', { name: 'Open Local inference case study' })
  ).toHaveAttribute('href', '/work/local-inference')
  expect(
    screen.getByRole('link', { name: /Saved per employee/ })
  ).toHaveAttribute('href', '/work/property-platform')
  expect(
    screen.getByRole('link', { name: /Production workflows migrated/ })
  ).toHaveAttribute('href', '/work/workflow-migration')
  expect(
    screen.getByRole('link', { name: /Fixes merged upstream/ })
  ).toHaveAttribute('href', '/work/local-inference')
  await user.click(screen.getByRole('button', { name: /Resume animation/ }))
  expect(
    screen.getByRole('button', { name: /Pause animation/ })
  ).toHaveAttribute('aria-pressed', 'false')
})
