import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
jest.mock('./firebase', () => ({ db: {}, auth: {}, storage: {} }))
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
}))
beforeEach(() => {
  window.scrollTo = jest.fn()
})
test('visitors can open a current case study and access the resume', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'From interface'
  )
  expect(screen.getByRole('link', { name: /Download resume/ })).toHaveAttribute(
    'href',
    '/resume/Diego_Espino_Resume.pdf'
  )
  fireEvent.click(screen.getByRole('link', { name: /Less administration/ }))
  expect(
    await screen.findByRole('heading', { name: 'The challenge' })
  ).toBeInTheDocument()
  expect(screen.getByRole('main')).toHaveFocus()
  expect(document.title).toContain('Less administration')
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
