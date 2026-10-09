import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import App from './App'
import pageMetadata from './data/pageMetadata.json'

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

// Metadata has no accessible role; inspect its head elements directly.
const getHeadElement = (selector) =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector(selector)

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

test.each([
  ['/dashboard', '/portfolio', 'What I’ve shipped.'],
  ['/blog', '/portfolio', 'What I’ve shipped.'],
  ['/youtubeVideosAndTwitchStreams', '/about', 'About me'],
])(
  'old %s bookmarks redirect without retaining the old URL in history',
  async (source, destination, heading) => {
    render(
      <MemoryRouter initialEntries={['/', source]} initialIndex={1}>
        <App />
        <HistoryControls />
      </MemoryRouter>
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: heading })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Current path')).toHaveTextContent(destination)

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }))
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
    expect(screen.getByLabelText('Current path')).toHaveTextContent(/^\/$/)
  }
)

test('SPA navigation synchronizes sharing metadata and clears canonical links on unknown routes', () => {
  const knownPath = '/work/local-inference'
  const page = pageMetadata.pages[knownPath]
  render(
    <MemoryRouter
      initialEntries={['/about', '/missing', knownPath]}
      initialIndex={2}
    >
      <App />
      <HistoryControls />
    </MemoryRouter>
  )
  expect(document.title).toBe(page.title)
  expect(getHeadElement('meta[name="description"]')).toHaveAttribute(
    'content',
    page.description
  )
  expect(getHeadElement('meta[property="og:title"]')).toHaveAttribute(
    'content',
    page.title
  )
  expect(getHeadElement('meta[property="og:description"]')).toHaveAttribute(
    'content',
    page.description
  )
  expect(getHeadElement('meta[property="og:url"]')).toHaveAttribute(
    'content',
    `${pageMetadata.siteUrl}${knownPath}`
  )
  expect(getHeadElement('meta[name="twitter:title"]')).toHaveAttribute(
    'content',
    page.title
  )
  expect(getHeadElement('meta[name="twitter:description"]')).toHaveAttribute(
    'content',
    page.description
  )
  expect(getHeadElement('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${pageMetadata.siteUrl}${knownPath}`
  )

  fireEvent.click(screen.getByRole('button', { name: 'Go back' }))
  expect(document.title).toBe(pageMetadata.notFound.title)
  expect(getHeadElement('meta[property="og:title"]')).toHaveAttribute(
    'content',
    pageMetadata.notFound.title
  )
  expect(getHeadElement('meta[property="og:url"]')).toHaveAttribute(
    'content',
    `${pageMetadata.siteUrl}/missing`
  )
  expect(getHeadElement('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow'
  )
  expect(getHeadElement('link[rel="canonical"]')).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Go back' }))
  expect(document.title).toBe(pageMetadata.pages['/about'].title)
  expect(getHeadElement('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index, follow'
  )
  expect(getHeadElement('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${pageMetadata.siteUrl}/about`
  )
})

test('selected work shows the three featured projects and preserves the confidential case without the old demo gallery', async () => {
  render(
    <MemoryRouter initialEntries={['/portfolio']}>
      <App />
    </MemoryRouter>
  )
  expect(
    await screen.findByRole('heading', { name: 'What I’ve shipped.' })
  ).toBeVisible()
  expect(screen.getByRole('heading', { name: 'Emmut' })).toBeVisible()
  expect(screen.getByRole('heading', { name: 'AWS → Railway' })).toBeVisible()
  expect(
    screen.getByRole('heading', {
      name: 'Local AI & open source',
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
