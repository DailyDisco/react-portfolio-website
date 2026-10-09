import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import App from './App'

const HistoryControls = () => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <output aria-label="Current path">{location.pathname}</output>
      <button type="button" onClick={() => navigate(-1)}>Go back</button>
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
  const projectLink = screen.getAllByRole('link').find(
    (link) => link.getAttribute('href') === '/work/property-platform'
  )
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
