import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import TechStack from '../TechStack'
export default function WorkCard({ study }) {
  const image = study.cover || study.visual
  return (
    <article className="work-card">
      <Link className="work-card-link" to={`/work/${study.slug}`}>
        {image && (
          <figure
            className="work-card-visual"
            data-project={study.cover ? `${study.slug}-cover` : study.slug}
          >
            <div className="work-card-picture">
              <img
                src={image.src}
                alt={image.alt}
                width="1000"
                height="625"
                loading="lazy"
              />
            </div>
            <figcaption>{image.caption}</figcaption>
          </figure>
        )}
        <div className="work-card-body">
          <h2>
            {study.cardTitle || study.title}
            <ArrowUpRight size={21} strokeWidth={1.5} aria-hidden="true" />
          </h2>
          <p>{study.cardSummary || study.summary}</p>
          <TechStack
            items={study.stack.slice(0, 4)}
            label={`${study.cardTitle || study.title} technologies`}
            className="project-stack"
            compact
          />
          <span className="case-link">
            Read case study <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}
