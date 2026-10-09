import { Link } from 'react-router-dom'
import { caseStudies } from '../../data/caseStudies'
import WorkCard from '../WorkCard'
import { StackDiagram, GpuRack } from '../Infrastructure'
export default function Home() {
  return (
    <>
      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="availability">
            <span aria-hidden="true" />
            Open to senior & lead engineering roles
          </p>
          <h1>
            From interface
            <br />
            to <em>infrastructure.</em>
          </h1>
          <p className="hero-description">
            I’m Diego, a full-stack engineer and technical lead. I build web
            products, lead cloud migrations, and operate the systems behind
            them.
          </p>
          <div className="actions">
            <Link className="button" to="/#selected-work">
              Explore my work <span aria-hidden="true">↘</span>
            </Link>
            <a
              className="button button-secondary"
              href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
              download
            >
              Download resume <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero-location">
            Based in Dallas-Fort Worth · Working across product and platform
          </p>
        </div>
        <div className="hero-system">
          <StackDiagram />
          <div className="system-caption">
            <span className="mono">PRODUCT → PRODUCTION</span>
            <span>Ownership across the stack</span>
          </div>
        </div>
      </section>
      <section
        className="proof-strip page-shell"
        aria-label="Selected engineering results"
      >
        <div>
          <strong>
            1,000<span>+</span>
          </strong>
          <p>
            property units on a platform
            <br />I helped lead
          </p>
        </div>
        <div>
          <strong>
            3h <span>→</span> 1h
          </strong>
          <p>
            daily admin work per employee
            <br />
            after workflow automation
          </p>
        </div>
        <div>
          <strong>
            6 <span>GPUs</span>
          </strong>
          <p>
            local inference infrastructure
            <br />
            with fixes merged upstream
          </p>
        </div>
      </section>
      <section id="selected-work" className="section page-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2>
              Built to do
              <br />
              real work.
            </h2>
          </div>
          <p>
            Client platforms, cloud migrations, and systems engineering. Here’s
            what I owned, the decisions behind it, and what changed.
          </p>
        </div>
        <div className="work-grid">
          {caseStudies.map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </div>
      </section>
      <section className="infra-band">
        <div className="page-shell infra-intro">
          <div>
            <p className="eyebrow">02 / BEYOND THE APPLICATION</p>
            <h2>
              I run what
              <br />I build.
            </h2>
            <p>
              Cloud infrastructure is part of my client work. At home, I go
              deeper: six GPUs, a Proxmox lab, self-hosted services, and
              performance fixes contributed upstream.
            </p>
            <Link className="text-link" to="/infrastructure">
              Inside the infrastructure <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <GpuRack />
        </div>
      </section>
      <section className="section page-shell about-preview">
        <p className="eyebrow">03 / THE PERSON BEHIND THE CODE</p>
        <div>
          <h2>
            Hands-on engineering.
            <br />
            Shared responsibility.
          </h2>
          <p>
            I work through Lumara Technologies, partnering with teams at DFW
            Software Consulting and Craft Digital. I care about clear
            architecture, useful tests, and systems the next engineer can
            understand.
          </p>
          <p>
            Outside work: bass music, the occasional hardware rabbit hole, and
            finding the next thing to learn.
          </p>
          <Link className="text-link" to="/about">
            A little more about me <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="contact-banner page-shell">
        <p className="eyebrow">HAVE A ROLE IN MIND?</p>
        <h2>
          Let’s build something
          <br />
          worth owning.
        </h2>
        <Link className="button" to="/contact">
          Get in touch <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  )
}
