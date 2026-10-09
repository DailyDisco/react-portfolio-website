import { Link } from 'react-router-dom'
const diagrams = {
  'property-platform': {
    label: 'PROPERTY OPERATIONS',
    steps: ['Units & tenants', 'Billing & workflows', 'Reporting'],
    metric: '3 hours → 1 hour',
    caption: 'daily administration per employee',
  },
  'workflow-migration': {
    label: 'WORKFLOW MIGRATION',
    steps: ['Kestra / AWS', 'Durable intake', 'n8n / Railway'],
    metric: '7 workflows',
    caption: 'migrated to production',
  },
  'realtime-platform': {
    label: 'REAL-TIME ARCHITECTURE',
    steps: ['Unity client', 'FastAPI / SSE', 'Redis / PostgreSQL'],
    metric: 'Reconnect. Resume.',
    caption: 'shared state and authorized streams',
  },
  'local-inference': {
    label: 'LOCAL INFERENCE',
    steps: ['Coding agents', 'TabbyAPI / ExLlamaV3', '6 × RTX 3090'],
    metric: '+18% cold prompt throughput',
    caption: 'measured on the six-GPU setup',
  },
}
export function WorkDiagram({ slug }) {
  const diagram = diagrams[slug]
  return (
    <div className={`work-diagram diagram-${slug}`} aria-hidden="true">
      <div className="diagram-label">
        <span>{diagram.label}</span>
        <span>
          /{String(Object.keys(diagrams).indexOf(slug) + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="diagram-flow">
        {diagram.steps.map((step, index) => (
          <div key={step}>
            <span className="node-index">0{index + 1}</span>
            <span>{step}</span>
            {index < 2 && <span className="flow-arrow">↓</span>}
          </div>
        ))}
      </div>
      <div className="diagram-result">
        <strong>{diagram.metric}</strong>
        <span>{diagram.caption}</span>
      </div>
    </div>
  )
}
export default function WorkCard({ study }) {
  return (
    <article className="work-card">
      <Link className="work-card-link" to={`/work/${study.slug}`}>
        <WorkDiagram slug={study.slug} />
        <div className="work-card-body">
          <p className="eyebrow">{study.category}</p>
          <h3>
            {study.title}
            <span aria-hidden="true">↗</span>
          </h3>
          <p>{study.summary}</p>
          <ul className="tag-list">
            {study.stack.slice(0, 4).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <span className="case-link">
            Read case study <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  )
}
