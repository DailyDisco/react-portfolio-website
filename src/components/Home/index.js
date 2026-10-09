import { useState } from 'react'
import { Link } from 'react-router-dom'
import './console.css'

const projects = [
  {
    slug: 'property-platform',
    label: 'Product',
    name: 'Emmut',
    category: 'Property management',
    description:
      'Led architecture and delivery with four developers. A platform for 1,000+ property units.',
  },
  {
    slug: 'workflow-migration',
    label: 'Cloud',
    name: 'AWS → Railway',
    category: 'Craft Digital · via Lumara',
    description:
      'Migrated seven production lead-intake workflows from Kestra on AWS to n8n on Railway.',
  },
  {
    slug: 'realtime-platform',
    label: 'Backend',
    name: 'Mixed reality',
    category: 'Confidential client',
    description:
      'Shared state, authorized event streams, and recovery after disconnects. Built for a Unity client.',
  },
]

function ProjectReadout({ selected }) {
  if (selected === 0) {
    return (
      <div className="console-readout">
        <div className="console-digits">
          <span>
            03<small>h</small>
          </span>
          <span className="console-readout-arrow" aria-hidden="true">
            →
          </span>
          <span>
            01<small>h</small>
          </span>
        </div>
        <p>Daily admin work per employee. Measured.</p>
      </div>
    )
  }
  if (selected === 1) {
    return (
      <div className="console-readout">
        <div className="console-flow-readout">
          <strong>07</strong>
          <svg viewBox="0 0 260 108" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => (
              <path
                key={index}
                d={`M 4 ${10 + index * 14} H 52 C 100 ${10 + index * 14}, 112 ${20 + index * 11}, 162 ${20 + index * 11} H 251`}
              />
            ))}
          </svg>
        </div>
        <p>Production workflows. Cut over September 2026.</p>
      </div>
    )
  }
  return (
    <div className="console-readout">
      <div className="console-event-readout">
        <span>SSE</span>
        <svg viewBox="0 0 250 100" aria-hidden="true">
          <path className="console-event-line" d="M8 35H78M175 35H242" />
          <path
            className="console-event-recovery"
            d="M78 35C105 35 91 78 126 78S150 35 175 35"
          />
          {[8, 43, 78, 175, 208, 242].map((x) => (
            <circle key={x} cx={x} cy="35" r="4" />
          ))}
        </svg>
      </div>
      <p>Resumable event delivery. Conceptual view.</p>
    </div>
  )
}

export default function Home() {
  const [selected, setSelected] = useState(0)
  const project = projects[selected]
  return (
    <div className="console-home">
      <section className="diego-console" aria-label="Digital Diego portfolio">
        <span className="console-screw screw-top-left" aria-hidden="true" />
        <span className="console-screw screw-top-right" aria-hidden="true" />
        <span className="console-screw screw-bottom-left" aria-hidden="true" />
        <span className="console-screw screw-bottom-right" aria-hidden="true" />
        <div className="console-body">
          <div className="console-identity">
            <p className="console-kicker">
              <span className="console-emblem" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              THE PERSONAL WORK OF DIEGO ESPINO
            </p>
            <h1>
              <span>digital</span>
              <span>
                diego<span className="console-period">.</span>
              </span>
            </h1>
            <div className="console-role">
              <p>
                Full-stack engineer
                <br />& technical lead.
              </p>
              <span className="console-role-symbol" aria-hidden="true">
                ↗
              </span>
            </div>
            <p className="console-intro">
              Web products, cloud systems,
              <br />
              and a habit of taking things apart.
            </p>
            <div className="console-availability">
              <span aria-hidden="true" />
              Open to senior & lead roles
              <span className="console-location">DALLAS, TX</span>
            </div>
          </div>
          <div className="console-projects">
            <div className="console-controls-header">
              <h2>Selected work</h2>
              <Link to="/portfolio">
                All projects <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div
              className="console-selectors"
              role="group"
              aria-label="Choose a project"
            >
              {projects.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={index === selected}
                  onClick={() => setSelected(index)}
                >
                  <span className="console-selector-number">0{index + 1}</span>
                  <span>{item.label}</span>
                  <span className="console-selector-lamp" aria-hidden="true" />
                </button>
              ))}
            </div>
            <div
              className="console-screen"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="console-screen-content" key={project.slug}>
                <p className="console-screen-kicker">{project.category}</p>
                <h3>{project.name}</h3>
                <ProjectReadout selected={selected} />
                <p className="console-project-description">
                  {project.description}
                </p>
                <div className="console-project-bottom">
                  <Link
                    to={`/work/${project.slug}`}
                    aria-label={`Open ${project.name} case study`}
                  >
                    Open case study <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="console-bottom-strip">
          <Link className="console-lab-link" to="/infrastructure">
            <span className="console-vent" aria-hidden="true">
              {Array.from({ length: 11 }, (_, index) => (
                <i key={index} />
              ))}
            </span>
            <span>
              <span className="console-strip-label">OFF THE CLOCK</span>
              <strong>6 × RTX 3090. One very personal homelab.</strong>
            </span>
            <span className="console-strip-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <a
            className="console-resume-link"
            href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
            download
          >
            <span className="console-strip-label">THE ONE-PAGE VERSION</span>
            <strong>
              Download resume <span aria-hidden="true">↓</span>
            </strong>
          </a>
        </div>
      </section>
      <div className="console-outside-footer">
        <p>Code, hardware, and bass music.</p>
        <div>
          <a href="https://github.com/DailyDisco">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/developerdiego/">LinkedIn ↗</a>
          <a href="mailto:diegoespinowork@gmail.com">Email ↗</a>
        </div>
        <Link to="/about">The person behind the projects ↗</Link>
      </div>
    </div>
  )
}
