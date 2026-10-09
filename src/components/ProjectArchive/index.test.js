import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import ProjectArchive from './index'

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}))

jest.mock('../../firebase', () => ({ db: {} }))

const projectSnapshot = (projects) => ({
  docs: projects.map((project, index) => ({
    id: `project-${index}`,
    data: () => project,
  })),
})

beforeEach(() => {
  jest.clearAllMocks()
  collection.mockReturnValue('portfolio-collection')
})

afterEach(() => {
  jest.useRealTimers()
})

test('shows a loading status while reading the existing portfolio collection', async () => {
  let resolveProjects
  getDocs.mockReturnValueOnce(
    new Promise((resolve) => {
      resolveProjects = resolve
    })
  )

  render(<ProjectArchive />)

  expect(screen.getByRole('status')).toHaveTextContent('Loading earlier projects')
  expect(collection).toHaveBeenCalledWith(db, 'portfolio')

  await act(async () =>
    resolveProjects(projectSnapshot([{ name: 'Music platform' }]))
  )

  expect(screen.queryByText('Loading earlier projects…')).not.toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Music platform' })
  ).toBeInTheDocument()
})

test('offers a retry after a read failure and displays the recovered projects', async () => {
  getDocs.mockRejectedValueOnce(new Error('permission-denied'))
  getDocs.mockResolvedValueOnce(projectSnapshot([{ name: 'Recovered project' }]))

  render(<ProjectArchive />)

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'The project archive couldn’t load'
  )
  expect(screen.queryByText('permission-denied')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Retry loading projects' }))

  expect(
    await screen.findByRole('heading', { name: 'Recovered project' })
  ).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('distinguishes an empty collection from a loading failure', async () => {
  getDocs.mockResolvedValueOnce(projectSnapshot([]))

  render(<ProjectArchive title="Earlier work" />)

  expect(
    await screen.findByText('There are no archived projects to show yet.')
  ).toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Earlier work' })).toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Retry loading projects' })
  ).not.toBeInTheDocument()
})

test('keeps every record while exposing only safe project and image URLs', async () => {
  getDocs.mockResolvedValueOnce(
    projectSnapshot([
      {
        name: 'Music platform',
        description: 'Subscriptions and artist releases.',
        url: 'https://example.com/music',
        image: 'https://example.com/music.png',
      },
      {
        name: 'Legacy experiment',
        description: '<script>alert("test")</script>',
        // eslint-disable-next-line no-script-url -- Malicious fixture verifies URL rejection.
        url: 'javascript:alert(1)',
        image: 'data:image/svg+xml,<svg></svg>',
      },
      { name: null, description: { unexpected: true }, url: null },
    ])
  )

  render(<ProjectArchive />)
  const cards = await screen.findAllByRole('article')

  expect(cards).toHaveLength(3)
  const link = within(cards[0]).getByRole('link', {
    name: 'View Music platform (opens in a new tab)',
  })
  expect(link).toHaveAttribute('href', 'https://example.com/music')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  expect(within(cards[0]).getByAltText('Preview of Music platform')).toHaveAttribute(
    'loading',
    'lazy'
  )
  expect(within(cards[1]).queryByRole('link')).not.toBeInTheDocument()
  expect(
    within(cards[1]).getByText('<script>alert("test")</script>')
  ).toBeInTheDocument()
  expect(
    within(cards[1]).getByRole('img', {
      name: 'Legacy experiment preview unavailable',
    })
  ).toBeInTheDocument()
  expect(
    within(cards[2]).getByRole('heading', { name: 'Untitled project' })
  ).toBeInTheDocument()
})

test('replaces an image that fails to load with an accessible fallback', async () => {
  getDocs.mockResolvedValueOnce(
    projectSnapshot([
      { name: 'Music platform', image: 'https://example.com/missing.png' },
    ])
  )

  render(<ProjectArchive />)
  fireEvent.error(await screen.findByAltText('Preview of Music platform'))

  expect(
    screen.queryByAltText('Preview of Music platform')
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('img', { name: 'Music platform preview unavailable' })
  ).toBeInTheDocument()
})

test('recovers from a stalled request without a late response replacing the retry', async () => {
  jest.useFakeTimers()
  let resolveStalledRequest
  getDocs.mockReturnValueOnce(
    new Promise((resolve) => {
      resolveStalledRequest = resolve
    })
  )
  getDocs.mockResolvedValueOnce(projectSnapshot([{ name: 'Fresh project' }]))

  render(<ProjectArchive />)
  act(() => jest.advanceTimersByTime(15000))

  expect(screen.getByRole('alert')).toHaveTextContent(
    'The project archive couldn’t load'
  )
  expect(screen.queryByRole('status')).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Retry loading projects' }))
  expect(
    await screen.findByRole('heading', { name: 'Fresh project' })
  ).toBeInTheDocument()

  await act(async () =>
    resolveStalledRequest(projectSnapshot([{ name: 'Stale project' }]))
  )

  expect(screen.queryByText('Stale project')).not.toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Fresh project' })
  ).toBeInTheDocument()
})
