import { Link } from 'react-router-dom'
import { caseStudies } from '../../data/caseStudies'
import WorkCard from '../WorkCard'

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
            I build web applications and the systems behind them. These days,
            that means property management software, cloud migrations, and
            backend services through my company, Lumara.
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
        <div className="personal-mark" aria-hidden="true">
          <svg viewBox="0 0 360 450" fill="none">
            <path
              className="mark-shadow"
              d="M75 55H165C280 55 322 124 322 225C322 326 280 395 165 395H75V55ZM143 121V329H168C226 329 252 298 252 225C252 152 226 121 168 121H143Z"
            />
            <path d="M65 45H155C270 45 312 114 312 215C312 316 270 385 155 385H65V45ZM133 111V319H158C216 319 242 288 242 215C242 142 216 111 158 111H133Z" />
          </svg>
          <span className="handwritten">Diego Espino</span>
        </div>
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
      <section className="home-lab page-shell">
        <div>
          <p className="handwritten">and at home...</p>
          <h2>
            Six GPUs.
            <br />
            Lots of tinkering.
          </h2>
        </div>
        <div className="home-lab-description">
          <p>
            I built a six-RTX-3090 inference server and run a Proxmox homelab.
            Working on my own setup led to fixes merged into ExLlamaV3 and
            TabbyAPI, including an 18% improvement in cold prompt processing on
            my server.
          </p>
          <Link className="text-link" to="/infrastructure">
            The hardware and open-source work →
          </Link>
        </div>
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
