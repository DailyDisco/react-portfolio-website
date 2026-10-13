import { useEffect, useRef } from 'react'
import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import { Link, useParams } from 'react-router-dom'
import { getCaseStudy } from '../../data/caseStudies'
import ProjectFigure from '../ProjectFigure'
import ProjectImageViewer from '../ProjectImageViewer'
import TechStack from '../TechStack'
import NotFound from '../NotFound'
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react'
import './style.css'

const resumeUrl = `${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`

const nextChapters = {
  'property-platform': {
    to: '/work/workflow-migration',
    title: 'AWS → Railway',
    description: 'Moving seven production workflows from Kestra to n8n.',
  },
  'workflow-migration': {
    to: '/work/local-inference',
    title: 'Local inference',
    description:
      'How operating my own server led to two fixes merged upstream.',
  },
  'local-inference': {
    to: '/about',
    title: 'Meet the engineer',
    description:
      'How I work, what I care about, and what I build away from the screen.',
  },
}

export default function CaseStudy() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)
  const navigation = useRef(null)
  useEffect(() => {
    const menu = navigation.current
    if (!menu) return undefined
    const root = menu.closest('.case-study')
    const header = document.querySelector('.site-header')
    const updateOffsets = () => {
      const position = header ? window.getComputedStyle(header).position : ''
      const top = ['fixed', 'sticky'].includes(position)
        ? header.getBoundingClientRect().height + 8
        : 12
      const scrollPadding =
        parseFloat(
          window.getComputedStyle(document.documentElement).scrollPaddingTop
        ) || 0
      menu.style.setProperty('--case-nav-top', `${top}px`)
      root.style.setProperty(
        '--case-anchor-margin',
        `${Math.max(12, top + menu.getBoundingClientRect().height + 12 - scrollPadding)}px`
      )
    }
    updateOffsets()
    const observer =
      typeof window.ResizeObserver === 'function'
        ? new window.ResizeObserver(updateOffsets)
        : null
    observer?.observe(menu)
    if (header) observer?.observe(header)
    window.addEventListener('resize', updateOffsets)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateOffsets)
    }
  }, [slug])
  if (!study) return <NotFound />
  const briefItems = [
    ['Ownership', study.brief?.ownership],
    ['Engineering decision', study.brief?.decision],
    ['Verification', study.brief?.verification],
  ].filter(([, description]) => description)
  const nextChapter = nextChapters[slug] || {
    to: '/portfolio',
    title: 'Explore selected work',
    description: 'Products, cloud systems, and the infrastructure behind them.',
  }
  return (
    <PageSurface
      key={slug}
      as="article"
      className="page-shell case-study segmented-page"
    >
      <header className="page-heading page-panel page-panel-primary">
        <Link className="text-link back-link" to="/portfolio">
          <ArrowLeft size={17} aria-hidden="true" /> All projects
        </Link>
        <p className="eyebrow">
          CASE STUDY {study.number} / {study.category}
        </p>
        <h1>{study.title}</h1>
        <p>{study.summary}</p>
      </header>
      <nav
        ref={navigation}
        className="case-section-nav"
        aria-label="On this page"
      >
        {[
          ['Overview', 'overview'],
          ['Contributions', 'contributions'],
          ['Results', 'results'],
        ].map(([label, anchor]) => (
          <a
            href={`#${anchor}`}
            key={anchor}
            onClick={(event) => {
              if (
                event.button !== 0 ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey ||
                event.shiftKey
              )
                return
              document.getElementById(anchor)?.focus({ preventScroll: true })
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <section className="page-panel case-primary-content">
        <section
          id="overview"
          tabIndex={-1}
          className="case-brief"
          aria-label="Project brief"
        >
          <dl className="case-brief-facts">
            <div>
              <dt>My role</dt>
              <dd>
                {study.role}
                <span className="case-brief-period">{study.period}</span>
              </dd>
            </div>
            <div className="case-brief-outcome">
              <dt>Outcome</dt>
              <dd>{study.outcome}</dd>
            </div>
          </dl>
          {briefItems.length > 0 && (
            <dl className="case-brief-details">
              {briefItems.map(([label, description]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          )}
          <TechStack items={study.stack} className="case-stack" />
        </section>
        {slug === 'property-platform' && (
          <section
            className="case-product-proof"
            aria-label="Emmut interface examples"
          >
            <div className="case-product-screens">
              <ProjectImageViewer
                src="/work/emmut-maintenance-desktop.png"
                alt="Emmut maintenance worker management dialog on desktop, using synthetic demo workers."
                title="Emmut desktop screenshot"
                caption="Actual Emmut maintenance component on desktop, rendered with synthetic demo workers."
                width={2560}
                height={1600}
              />
              <ProjectImageViewer
                src="/work/emmut-maintenance-mobile.png"
                alt="The same actual Emmut maintenance component as a mobile drawer with synthetic demo data."
                title="Emmut mobile screenshot"
                caption="The same actual Emmut maintenance component on mobile, rendered with synthetic demo data."
                width={780}
                height={1688}
                loading="lazy"
              />
            </div>
            <p>
              Emmut maintenance workflow. Actual application components rendered
              with synthetic demo data.
            </p>
          </section>
        )}
        {slug !== 'property-platform' && (
          <div className="case-visual-evidence">
            <ProjectFigure slug={slug} />
            <div className="case-metrics" aria-label="Project highlights">
              {study.highlights.map((item) => (
                <div key={item.value}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <div className="page-panel case-narrative">
        <div>
          <section>
            <h2 id="context" tabIndex={-1}>
              Context
            </h2>
            <p>{study.challenge}</p>
          </section>
          <section>
            <h2 id="contributions" tabIndex={-1}>
              My contributions
            </h2>
            {study.approach.map((item, index) => (
              <div className="approach-item" key={item.title}>
                <span className="mono">0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </section>
          <section>
            <h2 id="results" tabIndex={-1}>
              Results
            </h2>
            <ul className="results-list">
              {study.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
            {study.note && <p className="scope-note">{study.note}</p>}
          </section>
          {study.links.length > 0 && (
            <section>
              <h2>Source and pull requests</h2>
              <div className="evidence-links">
                {study.links.map((link) => (
                  <a
                    className="text-link"
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <section className="page-panel case-hiring" aria-label="Hiring contact">
        <div>
          <p className="eyebrow">WORK WITH ME</p>
          <h2>Have a senior or lead role in mind?</h2>
        </div>
        <div className="case-hiring-actions">
          <Link className="button" to="/contact">
            Discuss a senior/lead role
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <a className="text-link" href={resumeUrl} download>
            Download one-page resume
            <Download size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
      <NextChapter {...nextChapter} />
    </PageSurface>
  )
}
