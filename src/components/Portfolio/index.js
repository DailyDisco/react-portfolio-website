import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import { ArrowUpRight, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredCaseStudies } from '../../data/caseStudies'
import WorkCard from '../WorkCard'
import './work.css'
export default function Portfolio() {
  return (
    <PageSurface className="page-shell work-page segmented-page">
      <section className="page-panel page-panel-primary">
        <header className="page-heading">
          <p className="eyebrow">SELECTED WORK / 2025–2026</p>
          <h1>What I’ve shipped.</h1>
          <p>
            Products people use, production workflows, and the infrastructure
            behind them.
          </p>
        </header>
        <div className="selected-work-grid">
          {featuredCaseStudies.map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </div>
      </section>
      <aside
        className="page-panel supporting-project"
        aria-label="More engineering work"
      >
        <Radio size={23} strokeWidth={1.4} aria-hidden="true" />
        <div>
          <p className="eyebrow">ALSO BUILT / CONFIDENTIAL CLIENT</p>
          <h2>Real-time systems for mixed reality.</h2>
          <p>
            Shared state, resumable event streams, and scoped access for a Unity
            client.
          </p>
        </div>
        <Link to="/work/realtime-platform">
          Engineering details <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </aside>
      <NextChapter
        to="/infrastructure"
        title="Go under the hood"
        description="The machines, services, and upstream fixes behind the work."
      />
    </PageSurface>
  )
}
