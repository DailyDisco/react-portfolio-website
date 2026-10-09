import { caseStudies } from '../../data/caseStudies'
import WorkCard from '../WorkCard'
import ProjectArchive from '../ProjectArchive'
export default function Portfolio() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">SELECTED WORK / 2025–2026</p>
        <h1>Selected projects</h1>
        <p>
          Recent client work and personal infrastructure, with the problems I
          worked on, my contributions, and the results.
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
