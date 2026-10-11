import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import { Link, useParams } from 'react-router-dom'
import { getCaseStudy } from '../../data/caseStudies'
import ProjectFigure from '../ProjectFigure'
import TechStack from '../TechStack'
import NotFound from '../NotFound'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import './style.css'

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
  if (!study) return <NotFound />
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
      <section className="page-panel page-panel-primary">
        <header className="page-heading">
          <Link className="text-link back-link" to="/portfolio">
            <ArrowLeft size={17} aria-hidden="true" /> All projects
          </Link>
          <p className="eyebrow">
            CASE STUDY {study.number} / {study.category}
          </p>
          <h1>{study.title}</h1>
          <p>{study.summary}</p>
        </header>
        {slug === 'property-platform' && (
          <section
            className="case-product-proof"
            aria-label="Emmut interface examples"
          >
            <div className="case-product-screens">
              <img
                src="/work/emmut-maintenance-desktop.png"
                alt="Emmut maintenance worker management dialog on desktop, using synthetic demo workers."
                width="2560"
                height="1600"
              />
              <img
                src="/work/emmut-maintenance-mobile.png"
                alt="The same actual Emmut maintenance component as a mobile drawer with synthetic demo data."
                width="780"
                height="1688"
                loading="lazy"
              />
            </div>
            <p>
              Emmut maintenance workflow. Actual application components rendered
              with synthetic demo data.
            </p>
          </section>
        )}
        <div className="case-overview">
          <div>
            <p className="eyebrow">MY ROLE</p>
            <p>{study.role}</p>
            <p className="muted">{study.period}</p>
            <TechStack items={study.stack} className="case-stack" />
          </div>
          <ProjectFigure slug={slug} />
        </div>
        <div className="case-metrics">
          {study.highlights.map((item) => (
            <div key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="page-panel case-narrative">
        <aside>
          <p className="eyebrow">PROJECT DETAILS</p>
          <nav className="case-contents" aria-label="On this page">
            <a href="#context">Context</a>
            <a href="#contributions">My contributions</a>
            <a href="#results">Results</a>
          </nav>
        </aside>
        <div>
          <section>
            <h2 id="context">Context</h2>
            <p>{study.challenge}</p>
          </section>
          <section>
            <h2 id="contributions">My contributions</h2>
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
            <h2 id="results">Results</h2>
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
      <NextChapter {...nextChapter} />
    </PageSurface>
  )
}
