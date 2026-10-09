import { fireEvent, render, screen, within } from '@testing-library/react'
import projects from '../../data/projects.json'
import ProjectArchive from './index'

jest.mock('../../data/projects.json', () => [])

beforeEach(() => {
  projects.splice(0)
})

test('renders the complete local archive immediately with descriptive external links', () => {
  projects.push(...jest.requireActual('../../data/projects.json'))

  render(<ProjectArchive />)

  const cards = screen.getAllByRole('article')
  expect(cards).toHaveLength(8)
  expect(
    screen.getByRole('heading', { name: 'The Daily Disco' })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Modern Restaurant Menu' })
  ).toBeInTheDocument()
  expect(screen.getAllByRole('link')).toHaveLength(8)
  for (const card of cards) {
    const name = within(card).getByRole('heading').textContent
    const link = within(card).getByRole('link', {
      name: `View ${name} (opens in a new tab)`,
    })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.getAllByRole('img')).toHaveLength(1)
  expect(screen.getByAltText('Preview of E-Commerce Shop')).toHaveAttribute(
    'src',
    '/portfolio/three/ecommerceShop.jpg'
  )
  expect(screen.queryByText('Preview unavailable')).not.toBeInTheDocument()
})

test('preserves a text-only card when its link is unsafe and rejects remote image dependencies', () => {
  projects.push({
    id: 'unsafe-project',
    name: 'Legacy experiment',
    description: '<script>alert("test")</script>',
    // eslint-disable-next-line no-script-url -- Malicious fixture verifies URL rejection.
    url: 'javascript:alert(1)',
    image: 'https://example.com/legacy-preview.png',
  })

  render(<ProjectArchive />)

  const card = screen.getByRole('article')
  expect(
    within(card).getByRole('heading', { name: 'Legacy experiment' })
  ).toBeInTheDocument()
  expect(
    within(card).getByText('<script>alert("test")</script>')
  ).toBeInTheDocument()
  expect(within(card).queryByRole('link')).not.toBeInTheDocument()
  expect(within(card).queryByRole('img')).not.toBeInTheDocument()
  expect(within(card).getByText('Project link unavailable.')).toBeInTheDocument()
})

test('removes an image that fails to load while retaining the project and its link', () => {
  projects.push({
    id: 'shop',
    name: 'Example shop',
    description: 'A storefront.',
    url: 'https://example.com/shop',
    image: '/portfolio/missing.jpg',
  })

  render(<ProjectArchive />)
  const image = screen.getByAltText('Preview of Example shop')
  expect(image).toHaveAttribute('loading', 'lazy')
  fireEvent.error(image)

  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  expect(screen.queryByText('Preview unavailable')).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Example shop' })).toBeInTheDocument()
  expect(
    screen.getByRole('link', {
      name: 'View Example shop (opens in a new tab)',
    })
  ).toHaveAttribute('href', 'https://example.com/shop')
})

test('keeps a clear empty state if all archived projects are removed', () => {
  render(<ProjectArchive title="Earlier work" />)

  expect(screen.getByRole('region', { name: 'Earlier work' })).toBeInTheDocument()
  expect(
    screen.getByText('There are no archived projects to show yet.')
  ).toBeInTheDocument()
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})
