import { Link } from 'react-router-dom'
export default function WorkCard({ study }) {
  return (
    <article className="work-card">
      <Link className="work-card-link" to={`/work/${study.slug}`}>
        <div className="work-card-body">
          <p className="project-context">{study.category}</p>
          <h3>
            {study.title}
            <span aria-hidden="true">↗</span>
          </h3>
          <p>{study.summary}</p>
          <p className="project-stack">{study.stack.slice(0, 4).join(' / ')}</p>
          <span className="case-link">
            Read case study <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  )
}
