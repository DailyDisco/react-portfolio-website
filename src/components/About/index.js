import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import { ArrowDown, ArrowUpRight, Cpu, Music2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './style.css'

export default function About() {
  return (
    <PageSurface className="page-shell about-page segmented-page">
      <section className="page-panel page-panel-primary">
        <header className="page-heading">
          <p className="eyebrow">ABOUT DIEGO</p>
          <h1>About me</h1>
          <p>
            I’m a full-stack engineer and technical lead in Dallas-Fort Worth. I
            build web applications and the infrastructure behind them.
          </p>
        </header>
        <div className="about-layout">
          <section className="about-story">
            <h2>Hands-on, even when I’m leading.</h2>
            <p>
              I run Lumara Technologies and contract with DFW Software
              Consulting and Craft Digital. My work spans Emmut’s property
              platform, lead intake and reporting for Joshua Tree Experts, and
              confidential mixed reality services.
            </p>
            <p>
              I’ve led architecture and delivery with teams of four and five
              developers. I stay hands-on with frontends, APIs, databases, and
              tests, and build systems I can explain and debug.
            </p>
            <div className="actions">
              <Link className="button" to="/contact">
                Contact me <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <a
                className="text-link"
                href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
              >
                Read my resume <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </section>
          <aside
            className="experience-panel"
            aria-labelledby="current-roles-heading"
          >
            <h2 id="current-roles-heading">Current roles</h2>
            <div>
              <h3>DFW Software Consulting</h3>
              <p>Primary contract through Lumara</p>
              <span>March 2025 - Present</span>
            </div>
            <div>
              <h3>Craft Digital</h3>
              <p>Engineering contract through Lumara</p>
              <span>July 2026 - Present</span>
            </div>
            <div>
              <h3>Lumara Technologies</h3>
              <p>Founder · Independent client engagements</p>
              <span>Founded 2025 · Consulting since 2022</span>
            </div>
            <div>
              <h3>Games For Love</h3>
              <p>Volunteer Full Stack Web Developer</p>
              <span>September 2025 - Present</span>
            </div>
          </aside>
        </div>
      </section>
      <section
        className="page-panel about-secondary-panel"
        aria-labelledby="about-off-clock-heading"
      >
        <h2 id="about-off-clock-heading" className="about-secondary-title">
          Off the clock, still building.
        </h2>
        <div className="about-off-clock-layout">
          <figure className="about-study">
            <img
              src="/brand/code-hardware-music.webp"
              alt="An illustrated still life connecting piano keys, a computer heatsink, and a circuit board with an ochre cable."
              width="1024"
              height="1024"
              loading="lazy"
            />
            <figcaption>
              Code, hardware, and bass music. An illustrated study.
            </figcaption>
          </figure>
          <div className="about-personal-notes">
            <section className="about-personal-note">
              <Cpu size={21} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h3>Built at home</h3>
                <p>
                  I run a multi-GPU inference server and Proxmox homelab.
                  Debugging that setup led to fixes merged into ExLlamaV3 and
                  TabbyAPI.
                </p>
                <Link to="/infrastructure">
                  Inside the homelab
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </section>
            <section className="about-personal-note">
              <Music2 size={21} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h3>Away from the terminal</h3>
                <p>
                  I produce bass music in Ableton, learn piano, and build things
                  with hardware. I speak English and Spanish.
                </p>
              </div>
            </section>
          </div>
        </div>
        <section className="section skills-section">
          <h2>Tools I work with</h2>
          <div className="skill-groups">
            <div>
              <h3>Product & APIs</h3>
              <p>TypeScript, React, Next.js, Node.js, Go, Python, FastAPI</p>
            </div>
            <div>
              <h3>Data & workflows</h3>
              <p>PostgreSQL, Prisma, Redis, dbt, n8n</p>
            </div>
            <div>
              <h3>Cloud & delivery</h3>
              <p>AWS, Railway, Terraform, Docker, GitHub Actions, Linux</p>
            </div>
            <div>
              <h3>Quality & operations</h3>
              <p>Playwright, pytest, Vitest, Prometheus, Grafana</p>
            </div>
          </div>
          <p className="certification-line">
            AWS Certified Developer – Associate · AWS Certified Cloud
            Practitioner
          </p>
        </section>
      </section>
      <NextChapter
        to="/contact"
        title="Let’s talk about your team"
        description="Looking for a hands-on technical lead? Tell me what you’re building."
      />
    </PageSurface>
  )
}
