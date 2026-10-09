import { Link } from 'react-router-dom'
import { caseStudies } from '../../data/caseStudies'
import WorkCard from '../WorkCard'
import SignatureMark from '../SignatureMark'
import LabExplorer from '../LabExplorer'

export default function Home() {
  return (
    <div className="personal-home">
      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="handwritten" aria-hidden="true">
            hello, world.
          </p>
          <h1>
            Hi,
            <br />
            I’m <em>Diego.</em>
          </h1>
          <p className="hero-role">Full-stack engineer & technical lead</p>
          <p className="hero-description">
            I work across React and TypeScript, Go and Python, and the
            infrastructure behind them. My recent projects include property
            software for 1,000+ units and a production AWS-to-Railway migration.
          </p>
          <div className="actions">
            <Link className="button" to="/#selected-work">
              View my work
            </Link>
            <a
              className="text-link"
              href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
              download
            >
              Download resume ↓
            </a>
          </div>
          <p className="hero-location">
            Dallas-Fort Worth · Open to senior and lead roles
          </p>
        </div>
        <SignatureMark />
      </section>
      <section id="selected-work" className="selected-work page-shell">
        <div className="section-heading">
          <h2>Some recent work.</h2>
          <Link className="text-link" to="/portfolio">
            All projects →
          </Link>
        </div>
        <div className="work-grid">
          {caseStudies.slice(0, 3).map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </div>
      </section>
      <section
        className="home-lab page-shell"
        aria-labelledby="home-lab-heading"
      >
        <header className="section-heading">
          <div>
            <p className="handwritten">and at home...</p>
            <h2 id="home-lab-heading">Inside my homelab.</h2>
          </div>
          <p>
            Six GPUs, local models, and the debugging that led to two fixes
            merged upstream.
          </p>
        </header>
        <LabExplorer compact />
        <Link className="text-link home-lab-link" to="/infrastructure">
          Hardware, benchmarks, and pull requests →
        </Link>
      </section>
      <section className="home-personal page-shell">
        <p>
          Away from the terminal, I make bass music, learn piano, and work on
          hardware projects.{' '}
          <Link className="text-link" to="/about">
            More about me →
          </Link>
        </p>
        <p>
          Have an engineering role in mind?{' '}
          <Link className="text-link" to="/contact">
            Let’s talk.
          </Link>
        </p>
      </section>
    </div>
  )
}
