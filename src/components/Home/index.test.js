import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Home from './index'

test('project controls update the nearby cover and destination while keeping all work visible', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  const selectors = within(
    screen.getByRole('group', { name: 'Choose a project' })
  )
  const preview = within(
    screen.getByRole('region', { name: 'Selected work preview' })
  )
  const work = screen.getByRole('region', {
    name: 'A few things I’ve shipped.',
  })
  const workCopy = work.textContent
  const product = selectors.getByRole('button', { name: /Product/ })
  expect(product).toHaveAttribute('aria-pressed', 'true')
  expect(preview.getByRole('img')).toHaveAttribute(
    'src',
    '/work/emmut-cover-desktop-mobile.webp'
  )
  expect(
    preview.getByRole('link', { name: 'View selected Emmut case study' })
  ).toHaveAttribute('href', '/work/property-platform')

  product.focus()
  await user.tab()
  await user.keyboard('{Enter}')
  const cloud = selectors.getByRole('button', { name: /Cloud/ })
  expect(cloud).toHaveFocus()
  expect(cloud).toHaveAttribute('aria-pressed', 'true')
  expect(product).toHaveAttribute('aria-pressed', 'false')
  expect(
    preview.getByText('Production workflows. Cut over September 2026.')
  ).toBeVisible()
  const cloudCover = preview.getByRole('img').getAttribute('src')
  expect(cloudCover).not.toBe('/work/emmut-cover-desktop-mobile.webp')
  expect(
    preview.getByRole('link', {
      name: 'View selected AWS → Railway case study',
    })
  ).toHaveAttribute('href', '/work/workflow-migration')
  expect(work.textContent).toBe(workCopy)

  await user.tab()
  await user.keyboard(' ')
  expect(selectors.getByRole('button', { name: /Systems/ })).toHaveFocus()
  expect(cloud).toHaveAttribute('aria-pressed', 'false')
  expect(
    preview.getByText(
      'Historical six-GPU cold prompt benchmark. Decode unchanged.'
    )
  ).toBeVisible()
  expect(preview.getByRole('img').getAttribute('src')).not.toBe(cloudCover)
  expect(
    preview.getByRole('link', {
      name: 'View selected Local inference case study',
    })
  ).toHaveAttribute('href', '/work/local-inference')
  expect(work.textContent).toBe(workCopy)
  for (const name of ['Emmut', 'AWS → Railway', 'Local inference']) {
    expect(
      within(work).getByRole('link', { name: `Open ${name} case study` })
    ).toBeVisible()
  }
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
    within(
      screen.getByRole('region', { name: 'A few things I’ve shipped.' })
    ).getByText('Daily admin work per employee. Measured.')
  ).toBeVisible()
  expect(
    within(screen.getByRole('region', { name: 'Introduction' })).getByRole(
      'link',
      { name: /3h → 1h.*Measured at Emmut/ }
    )
  ).toHaveAttribute('href', '/work/property-platform')
  for (const [name, slug] of [
    ['Emmut', 'property-platform'],
    ['AWS → Railway', 'workflow-migration'],
    ['Local inference', 'local-inference'],
  ]) {
    expect(
      within(portfolio).getByRole('link', {
        name: `Open ${name} case study`,
      })
    ).toHaveAttribute('href', `/work/${slug}`)
  }
  expect(
    within(portfolio).getByRole('link', { name: /All projects/ })
  ).toHaveAttribute('href', '/portfolio')
  expect(
    within(portfolio).getByRole('link', { name: /Seven GPUs/ })
  ).toHaveAttribute('href', '/infrastructure')
  expect(
    within(portfolio).getByRole('link', { name: /Hermes, agents & MCP/ })
  ).toHaveAttribute('href', '/infrastructure#agents')
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

test('visitors can open and pause the optional companion while navigating project evidence', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  expect(
    screen.queryByRole('button', { name: 'Pause' })
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  const opener = screen.getByRole('button', {
    name: 'Psst… Meet the coding companion',
  })
  expect(opener).toHaveAttribute('aria-expanded', 'false')
  await user.click(opener)
  const companion = within(
    screen.getByRole('dialog', { name: 'A little coding companion' })
  )
  expect(opener).toHaveAttribute('aria-expanded', 'true')
  const pause = companion.getByRole('button', { name: 'Pause' })
  await user.click(pause)
  expect(pause).toHaveAttribute('aria-pressed', 'true')
  expect(companion.getByRole('button', { name: 'Resume' })).toHaveFocus()
  await user.click(screen.getByRole('button', { name: /Systems/ }))
  expect(
    within(
      screen.getByRole('region', { name: 'Selected work preview' })
    ).getByRole('link', {
      name: 'View selected Local inference case study',
    })
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
  expect(companion.getByRole('button', { name: 'Resume' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await user.click(companion.getByRole('button', { name: 'Resume' }))
  expect(companion.getByRole('button', { name: 'Pause' })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
  await user.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(opener).toHaveAttribute('aria-expanded', 'false')
  expect(opener).toHaveFocus()
})
