import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
export default function WorkCard({ study }) {
  return (
    <article className="work-card">
      <Link className="work-card-link" to={`/work/${study.slug}`}>
        {study.visual && (
          <figure className="work-card-visual" data-project={study.slug}>
            <div className="work-card-picture">
              <img
                src={study.visual.src}
                alt={study.visual.alt}
                width="1000"
                height="625"
                loading="lazy"
              />
            </div>
            <figcaption>{study.visual.caption}</figcaption>
          </figure>
        )}
        <div className="work-card-body">
          <h2>
            {study.cardTitle || study.title}
            <ArrowUpRight size={21} strokeWidth={1.5} aria-hidden="true" />
          </h2>
          <p>{study.summary}</p>
          <p className="project-stack">{study.stack.slice(0, 4).join(' / ')}</p>
          <span className="case-link">
            Read case study <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}
