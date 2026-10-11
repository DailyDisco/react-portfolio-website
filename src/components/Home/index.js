import SiteFooter from '../SiteFooter'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Cpu,
  Download,
  PanelsTopLeft,
  Workflow,
} from 'lucide-react'
import SignalSculpture from '../SignalSculpture'
import useConsoleMotion from './useConsoleMotion'
import './console.css'

const projects = [
  {
    slug: 'property-platform',
    label: 'Product',
    icon: PanelsTopLeft,
    name: 'Emmut',
    category: 'Property management',
    description:
      'Led a four-developer team building a platform for 1,000+ units.',
  },
  {
    slug: 'workflow-migration',
    label: 'Cloud',
    icon: Workflow,
    name: 'AWS → Railway',
    category: 'Craft Digital · via Lumara',
    description: 'Moved production lead intake from Kestra to n8n.',
  },
  {
    slug: 'local-inference',
    label: 'Systems',
    icon: Cpu,
    name: 'Local inference',
    category: 'GPU infrastructure · Open source',
    description: 'Two fixes merged into ExLlamaV3 and TabbyAPI.',
  },
]

function ProjectReadout({ selected }) {
  if (selected === 0) {
    return (
      <div className="console-readout">
        <div className="console-digits">
          <span>
            3<small>h</small>
          </span>
          <span className="console-readout-arrow" aria-hidden="true">
            →
          </span>
          <span>
            1<small>h</small>
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
          <strong>7</strong>
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
      <div className="console-inference-readout">
        <span>
          +18<small>%</small>
        </span>
        <span className="console-gpu-bank" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} />
          ))}
        </span>
      </div>
      <p>Faster cold prompt processing. Measured on six GPUs.</p>
    </div>
  )
}

export default function Home() {
  const [selected, setSelected] = useState(0)
  const consoleRef = useRef(null)
  useConsoleMotion(consoleRef, selected)
  const project = projects[selected]
  return (
    <div className="console-home">
      <section
        ref={consoleRef}
        className="diego-console"
        aria-label="Digital Diego portfolio"
      >
        <span className="console-screw screw-top-left" aria-hidden="true" />
        <span className="console-screw screw-top-right" aria-hidden="true" />
        <span className="console-screw screw-bottom-left" aria-hidden="true" />
        <span className="console-screw screw-bottom-right" aria-hidden="true" />
        <div className="console-body">
          <div className="console-identity">
            <h1>
              digital diego<span className="console-period">.</span>
            </h1>
            <div className="console-object-bay">
              <SignalSculpture selected={selected} />
            </div>
            <div className="console-role">
              <p>Full-stack engineer & technical lead.</p>
            </div>
            <p className="console-intro">
              I build web products and the systems they run on.
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
                All projects <ArrowUpRight size={13} aria-hidden="true" />
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
                  <item.icon
                    className="console-selector-icon"
                    size={15}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
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
                    Open case study{' '}
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
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
              <span className="console-strip-label">HOMELAB</span>
              <strong>Seven GPUs. Built and run by me.</strong>
            </span>
            <span className="console-strip-arrow" aria-hidden="true">
              <ArrowUpRight size={19} strokeWidth={1.4} />
            </span>
          </Link>
          <a
            className="console-resume-link"
            href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
            download
          >
            <span className="console-strip-label">ONE-PAGE PDF</span>
            <strong>
              Download resume{' '}
              <Download size={16} strokeWidth={1.6} aria-hidden="true" />
            </strong>
          </a>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
