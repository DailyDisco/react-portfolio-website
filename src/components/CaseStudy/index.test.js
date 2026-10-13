import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { getCaseStudy } from '../../data/caseStudies'
import CaseStudy from './index'

jest.mock('../../data/caseStudies', () => ({
  getCaseStudy: jest.fn(),
}))

const createStudy = (overrides = {}) => ({
  number: '01',
  category: 'Product engineering',
  title: 'Emmut property management',
  summary: 'Property management for 1,000+ units.',
  role: 'Full Stack Engineer · DFW Software Consulting, through Lumara',
  period: 'March 2025 - Present',
  outcome: '3 hours → 1 hour of daily admin work',
  stack: ['Next.js', 'PostgreSQL'],
  highlights: [{ value: '1,000+', label: 'property units managed' }],
  challenge: 'Replace legacy property management software.',
  approach: [
    {
      title: 'Architecture and releases',
      body: 'Led architecture with a four-developer team.',
    },
  ],
  results: ['Reduced repetitive administrative work.'],
  links: [],
  ...overrides,
})

function renderStudy(slug = 'property-platform') {
  return render(
    <MemoryRouter initialEntries={[`/work/${slug}`]}>
      <Routes>
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/contact" element={<h1>Contact Diego</h1>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  getCaseStudy.mockReset()
})

test('the engineering brief comes before Emmut screenshots and preserves their demo-data disclosure', () => {
  getCaseStudy.mockReturnValue(
    createStudy({
      brief: {
        ownership: 'Led architecture and releases with four developers.',
        decision: 'Used durable database jobs for recoverable email delivery.',
        verification: 'Tested interrupted workers against PostgreSQL and SMTP.',
      },
    })
  )
  renderStudy()

  const brief = screen.getByRole('region', { name: 'Project brief' })
  expect(within(brief).getByText('My role')).toBeVisible()
  expect(within(brief).getByText('Outcome')).toBeVisible()
  expect(
    within(brief).getByText(
      'Led architecture and releases with four developers.'
    )
  ).toBeVisible()
  expect(
    within(brief).getByText(
      'Used durable database jobs for recoverable email delivery.'
    )
  ).toBeVisible()
  expect(
    within(brief).getByText(
      'Tested interrupted workers against PostgreSQL and SMTP.'
    )
  ).toBeVisible()

  const desktop = screen.getByRole('img', {
    name: /maintenance worker management dialog on desktop/,
  })
  expect(desktop).toHaveAttribute('src', '/work/emmut-maintenance-desktop.png')
  expect(
    brief.compareDocumentPosition(desktop) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()
  expect(
    screen.getByRole('img', { name: /mobile drawer with synthetic demo data/ })
  ).toHaveAttribute('src', '/work/emmut-maintenance-mobile.png')
  expect(
    screen.getByText(
      /Actual application components rendered with synthetic demo data/
    )
  ).toBeVisible()
  expect(
    screen.queryByRole('heading', { name: /Two hours back/ })
  ).not.toBeInTheDocument()
})

test('a case without a brief keeps its role, outcome, conceptual diagram, and section links', () => {
  getCaseStudy.mockReturnValue(
    createStudy({
      title: 'Confidential mixed reality platform',
      role: 'Backend engineering lead',
      outcome: 'Resumable events with scoped access',
    })
  )
  renderStudy('realtime-platform')

  const brief = screen.getByRole('region', { name: 'Project brief' })
  expect(within(brief).getByText('Backend engineering lead')).toBeVisible()
  expect(
    within(brief).getByText('Resumable events with scoped access')
  ).toBeVisible()
  expect(within(brief).queryByText('Verification')).not.toBeInTheDocument()
  expect(screen.getByText('Conceptual view')).toBeVisible()

  const contents = screen.getByRole('navigation', { name: 'On this page' })
  for (const [name, anchor, target] of [
    ['Overview', 'overview', brief],
    [
      'Contributions',
      'contributions',
      screen.getByRole('heading', { name: 'My contributions' }),
    ],
    ['Results', 'results', screen.getByRole('heading', { name: 'Results' })],
  ]) {
    expect(within(contents).getByRole('link', { name })).toHaveAttribute(
      'href',
      `#${anchor}`
    )
    expect(target).toHaveAttribute('tabindex', '-1')
    fireEvent.click(within(contents).getByRole('link', { name }))
    expect(target).toHaveFocus()
  }
  expect(
    screen.getAllByRole('navigation', { name: 'On this page' })
  ).toHaveLength(1)
  expect(
    contents.compareDocumentPosition(brief) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()
})

test('the hiring CTA opens contact while the resume and next case remain available', () => {
  getCaseStudy.mockReturnValue(createStudy())
  renderStudy()

  expect(
    screen.getByRole('link', { name: 'Download one-page resume' })
  ).toHaveAttribute('href', '/resume/Diego_Espino_Resume.pdf')
  expect(
    screen.getByRole('link', { name: /Up next AWS → Railway/ })
  ).toHaveAttribute('href', '/work/workflow-migration')
  fireEvent.click(
    screen.getByRole('link', { name: 'Discuss a senior/lead role' })
  )
  expect(screen.getByRole('heading', { name: 'Contact Diego' })).toBeVisible()
})
