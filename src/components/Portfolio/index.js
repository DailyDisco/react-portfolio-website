import { caseStudies } from '../../data/caseStudies'
import WorkCard from '../WorkCard'
import ProjectArchive from '../ProjectArchive'
export default function Portfolio() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">SELECTED WORK / 2025–2026</p>
        <h1>
          Products shipped.
          <br />
          <em>Systems understood.</em>
        </h1>
        <p>
          Full-stack delivery and technical leadership, from property operations
          and cloud migrations to real-time platforms and local inference.
        </p>
      </header>
      <div className="work-grid">
        {caseStudies.map((study) => (
          <WorkCard key={study.slug} study={study} />
        ))}
      </div>
      <ProjectArchive />
    </div>
  )
}
