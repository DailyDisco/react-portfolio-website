import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Cpu,
  Languages,
  Quote,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import TechStack, { TechIcon } from '../TechStack'
import './style.css'

const recommendationsUrl =
  'https://www.linkedin.com/in/developerdiego/details/recommendations/'

const recommendations = [
  {
    author: 'Jeremy Ashley',
    relationship: 'CTO, DFW Software Consulting · Direct manager',
    date: '2026-03-27',
    dateLabel: 'March 2026',
    quote:
      'He’s someone you can trust to take a task, run with it, and deliver real value to the team.',
  },
  {
    author: 'Hector Oropesa',
    relationship: 'Teammate, DFW Consulting',
    date: '2026-03-29',
    dateLabel: 'March 2026',
    quote:
      'He understands systems end to end and can move between frontend, backend, and infrastructure without missing a beat.',
  },
  {
    author: 'Belle Duran',
    relationship: 'Direct manager, Smart Gym project',
    date: '2025-09-02',
    dateLabel: 'September 2025',
    quote:
      'What sets Diego apart is his ability to translate complex business requirements into intuitive user interfaces.',
  },
  {
    author: 'Naomi Carrigan',
    relationship: 'Mentor, Commit Your Code cohort',
    date: '2025-08-19',
    dateLabel: 'August 2025',
    quote:
      'What truly stood out was his growth in communication and his commitment to supporting teammates—he made himself available to help others while still delivering outstanding individual contributions.',
  },
]

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
            <div className="about-story-intro">
              <div className="about-portrait">
                <img
                  src="/about/diego-espino.jpg"
                  alt="Diego Espino outdoors at sunset."
                  width="800"
                  height="800"
                  decoding="async"
                />
              </div>
              <h2>Hands-on, even when I’m leading.</h2>
            </div>
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
            <p>
              At Lumara, I also built a Go and React client workspace with
              tenant-scoped collaboration and delivery approvals that reject
              stale decisions.
            </p>
            <p className="about-location">
              <Languages size={18} aria-hidden="true" />
              Dallas-Fort Worth · English & Spanish
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
        className="page-panel about-recommendations"
        aria-labelledby="about-recommendations-heading"
      >
        <div className="about-recommendations-heading">
          <h2
            id="about-recommendations-heading"
            className="about-secondary-title"
          >
            People I’ve worked with.
          </h2>
          <a className="text-link" href={recommendationsUrl}>
            Read the full recommendations
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="about-recommendations-grid">
          {recommendations.map((recommendation) => (
            <figure
              className="about-recommendation"
              key={recommendation.author}
            >
              <Quote size={22} strokeWidth={1.6} aria-hidden="true" />
              <blockquote cite={recommendationsUrl}>
                <p>“{recommendation.quote}”</p>
              </blockquote>
              <figcaption>
                <strong>{recommendation.author}</strong>
                <span>{recommendation.relationship}</span>
                <time dateTime={recommendation.date}>
                  {recommendation.dateLabel} · LinkedIn excerpt
                </time>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section
        className="page-panel about-secondary-panel"
        aria-labelledby="about-engineering-heading"
      >
        <h2 id="about-engineering-heading" className="about-secondary-title">
          Built, operated, understood.
        </h2>
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
            <Bot size={21} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <h3>Agents with a working environment</h3>
              <p>
                I configure Hermes and other agent environments, connect MCP
                tools, and set up local inference. I test the complete workflow,
                including tool access and recovery.
              </p>
              <Link to="/infrastructure#agents">
                Agent setups & MCP
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
        <section className="section skills-section">
          <h2>Tools I work with</h2>
          <div className="skill-groups">
            <div>
              <h3>Product & APIs</h3>
              <TechStack
                items={[
                  'TypeScript',
                  'React',
                  'Next.js',
                  'Node.js',
                  'Go',
                  'Python',
                  'FastAPI',
                ]}
                label="Product and API technologies"
              />
            </div>
            <div>
              <h3>Data & workflows</h3>
              <TechStack
                items={['PostgreSQL', 'Prisma', 'Redis', 'dbt', 'n8n']}
                label="Data and workflow technologies"
              />
            </div>
            <div>
              <h3>Cloud & delivery</h3>
              <TechStack
                items={[
                  'AWS',
                  'Railway',
                  'Terraform',
                  'Docker',
                  'GitHub Actions',
                  'Linux',
                ]}
                label="Cloud and delivery technologies"
              />
            </div>
            <div>
              <h3>Quality & operations</h3>
              <TechStack
                items={[
                  'Playwright',
                  'pytest',
                  'Vitest',
                  'Prometheus',
                  'Grafana',
                ]}
                label="Quality and operations technologies"
              />
            </div>
          </div>
          <p className="certification-line">
            <TechIcon name="AWS" size={24} />
            <span>
              AWS Certified Developer – Associate · AWS Certified Cloud
              Practitioner
            </span>
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
