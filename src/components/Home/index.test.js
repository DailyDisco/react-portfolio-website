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

test('the homepage exposes the complete hiring story and contact path without selecting projects', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const storyNavigation = screen.getByRole('navigation', {
    name: 'Homepage story',
  })
  const chapterLinks = within(storyNavigation).getAllByRole('link')
  expect(chapterLinks).toHaveLength(4)
  const results = screen.getByRole('region', {
    name: /Give people their time back/i,
  })
  const delivery = screen.getByRole('region', {
    name: /Then keep the work moving/i,
  })
  const systems = screen.getByRole('region', {
    name: /Go all the way down the stack/i,
  })
  const collaboration = screen.getByRole('region', {
    name: /Hands-on, even when I’m leading/i,
  })
  const chapters = [results, delivery, systems, collaboration]
  chapterLinks.forEach((link, index) => {
    const destination = link.getAttribute('href')
    expect(destination).toMatch(/^#home-/)
    const chapter = chapters[index]
    expect(chapter).toHaveAttribute('id', destination.slice(1))
    expect(chapter).toBeVisible()
    expect(within(chapter).getByRole('heading', { level: 2 })).toBeVisible()
  })

  expect(
    within(results).getByText(/four-developer team.*1,000 units/i)
  ).toBeVisible()
  expect(results).toHaveTextContent(/Before3h.*After1h/)
  expect(within(results).getByRole('link', { name: /Emmut/i })).toHaveAttribute(
    'href',
    '/work/property-platform'
  )
  expect(
    within(delivery).getByText(/seven production lead workflows/i)
  ).toBeVisible()
  expect(
    within(delivery).getByRole('link', { name: /migration/i })
  ).toHaveAttribute('href', '/work/workflow-migration')
  expect(
    within(systems).getByText(/1,238.*1,458.*six-GPU benchmark/i)
  ).toBeVisible()
  expect(
    within(systems).getByRole('link', { name: /ExLlamaV3 performance fix/i })
  ).toHaveAttribute('href', 'https://github.com/turboderp-org/exllamav3/pull/447')
  expect(
    within(systems).getByRole('link', { name: /TabbyAPI recovery fix/i })
  ).toHaveAttribute('href', 'https://github.com/theroyallab/tabbyAPI/pull/493')

  expect(collaboration).toHaveTextContent(
    /DFW Software Consulting\s*Primary contract through Lumara/
  )
  expect(collaboration).toHaveTextContent(
    /Craft Digital\s*Engineering contract through Lumara/
  )
  expect(collaboration).toHaveTextContent(
    /Games For Love\s*Volunteer full-stack developer/i
  )
  expect(
    within(collaboration).getByText(/founder of Lumara Technologies/i)
  ).toBeVisible()
  expect(
    within(collaboration).getByText(/senior & lead engineering roles/i)
  ).toBeVisible()
  expect(
    within(collaboration).getByRole('link', { name: 'Email Diego' })
  ).toHaveAttribute('href', 'mailto:diegoespinowork@gmail.com')
  expect(
    within(collaboration).getByRole('link', { name: /Read my résumé/i })
  ).toHaveAttribute('href', '/resume/Diego_Espino_Resume.pdf')
  expect(
    within(collaboration).getByRole('link', { name: 'GitHub' })
  ).toHaveAttribute('href', 'https://github.com/DailyDisco')
  expect(
    within(collaboration).getByRole('link', { name: 'LinkedIn' })
  ).toHaveAttribute('href', 'https://www.linkedin.com/in/developerdiego')

  const selectors = within(
    screen.getByRole('group', { name: 'Choose a project' })
  )
  expect(selectors.getByRole('button', { name: /Cloud/ })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
  expect(selectors.getByRole('button', { name: /Systems/ })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
})
