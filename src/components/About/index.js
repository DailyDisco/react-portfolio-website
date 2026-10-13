import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import { ArrowDown, ArrowUpRight, Bot, Cpu, Languages } from 'lucide-react'
import { Link } from 'react-router-dom'
import TechStack, { TechIcon } from '../TechStack'
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
