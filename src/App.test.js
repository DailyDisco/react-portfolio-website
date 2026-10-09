import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import App from './App'

const HistoryControls = () => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <output aria-label="Current path">{location.pathname}</output>
      <button type="button" onClick={() => navigate(-1)}>
        Go back
      </button>
    </>
  )
}

beforeEach(() => {
  window.scrollTo = jest.fn()
})
test('visitors can open a current case study and access the resume', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  expect(screen.getByRole('link', { name: /Download resume/ })).toHaveAttribute(
    'href',
    '/resume/Diego_Espino_Resume.pdf'
  )
  const projectLink = screen
    .getAllByRole('link')
    .find((link) => link.getAttribute('href') === '/work/property-platform')
  expect(projectLink).toBeVisible()
  fireEvent.click(projectLink)
  expect(
    await screen.findByRole('heading', { name: 'Context' })
  ).toBeInTheDocument()
  expect(screen.getByRole('main')).toHaveFocus()
  expect(document.title).toBe(
    `${screen.getByRole('heading', { level: 1 }).textContent} | Diego Espino`
  )
})
test('mobile menu closes with Escape and restores focus to its trigger', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  const menu = screen.getByRole('button', { name: /Menu/ })
  fireEvent.click(menu)
  expect(menu).toHaveAttribute('aria-expanded', 'true')
  fireEvent.keyDown(menu, { key: 'Escape' })
  expect(menu).toHaveAttribute('aria-expanded', 'false')
  expect(menu).toHaveFocus()
})
test('unknown case studies show a useful recovery link', () => {
  render(
    <MemoryRouter initialEntries={['/work/missing']}>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'isn’t here'
  )
  expect(
    screen.getByRole('link', { name: /View selected work/ })
  ).toHaveAttribute('href', '/portfolio')
})

test('old dashboard bookmarks redirect to portfolio without retaining dashboard in history', async () => {
  render(
    <MemoryRouter initialEntries={['/', '/dashboard']} initialIndex={1}>
      <App />
      <HistoryControls />
    </MemoryRouter>
  )
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Selected projects' })
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Current path')).toHaveTextContent('/portfolio')

  fireEvent.click(screen.getByRole('button', { name: 'Go back' }))
  expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  expect(screen.getByLabelText('Current path')).toHaveTextContent(/^\/$/)
})

test('selected work shows the three featured projects and preserves the confidential case without the old demo gallery', async () => {
  render(
    <MemoryRouter initialEntries={['/portfolio']}>
      <App />
    </MemoryRouter>
  )
  expect(
    await screen.findByRole('heading', { name: 'Selected projects' })
  ).toBeVisible()
  expect(
    screen.getByRole('heading', { name: 'Emmut property management' })
  ).toBeVisible()
  expect(
    screen.getByRole('heading', { name: 'AWS to Railway workflow migration' })
  ).toBeVisible()
  expect(
    screen.getByRole('heading', {
      name: 'Local LLM inference and upstream fixes',
    })
  ).toBeVisible()
  expect(
    screen.getByRole('link', { name: /Engineering details/ })
  ).toHaveAttribute('href', '/work/realtime-platform')
  expect(screen.getByAltText(/Actual Emmut maintenance-worker/)).toBeVisible()
  expect(
    screen.queryByText('Testing MetaMask Connection')
  ).not.toBeInTheDocument()
  expect(screen.queryByText('More things I’ve built')).not.toBeInTheDocument()
})
