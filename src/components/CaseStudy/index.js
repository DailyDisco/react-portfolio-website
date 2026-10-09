import { Link, useParams } from 'react-router-dom'
import { caseStudies, getCaseStudy } from '../../data/caseStudies'
import ProjectFigure from '../ProjectFigure'
import NotFound from '../NotFound'
export default function CaseStudy() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)
  if (!study) return <NotFound />
  const nextStudy =
    caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]
  return (
    <article className="page-shell case-study">
      <header className="page-heading">
        <Link className="text-link back-link" to="/portfolio">
          ← All projects
        </Link>
        <p className="eyebrow">
          CASE STUDY {study.number} / {study.category}
        </p>
        <h1>{study.title}</h1>
        <p>{study.summary}</p>
      </header>
      <div className="case-overview">
        <div>
          <p className="eyebrow">MY ROLE</p>
          <p>{study.role}</p>
          <p className="muted">{study.period}</p>
          <ul className="tag-list">
            {study.stack.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
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
      <div className="case-narrative">
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
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="next-case">
        <p className="eyebrow">NEXT PROJECT</p>
        <Link to={`/work/${nextStudy.slug}`}>
          {nextStudy.title}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}
