import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  MapPin,
  Download,
  PanelsTopLeft,
  Workflow,
} from 'lucide-react'
import { getCaseStudy } from '../../data/caseStudies'
import RobotPocket from '../RobotPocket'
import SiteFooter from '../SiteFooter'
import TechStack from '../TechStack'
import useHomeMotion from './useHomeMotion'
import './console.css'

const projects = [
  {
    slug: 'property-platform',
    label: 'Product',
    icon: PanelsTopLeft,
    name: 'Emmut',
    category: 'Product engineering / DFW through Lumara',
    description:
      'Led a four-developer team building a platform for 1,000+ units.',
    metric: '3h → 1h',
    metricCaption: 'Daily admin work per employee. Measured.',
  },
  {
    slug: 'workflow-migration',
    label: 'Cloud',
    icon: Workflow,
    name: 'AWS → Railway',
    category: 'Cloud & data / Craft Digital through Lumara',
    description: 'Moved production lead intake from Kestra to n8n.',
    metric: '7 workflows',
    metricCaption: 'Production workflows. Cut over September 2026.',
  },
  {
    slug: 'local-inference',
    label: 'Systems',
    icon: Cpu,
    name: 'Local inference',
    category: 'Infrastructure & open source / Built at home',
    description: 'Two fixes merged into ExLlamaV3 and TabbyAPI.',
    metric: '+18%',
    metricCaption:
      'Historical six-GPU cold prompt benchmark. Decode unchanged.',
  },
]

export default function Home() {
  const [selected, setSelected] = useState(0)
  const root = useRef(null)
  useHomeMotion(root, selected)
  const project = projects[selected]
  const study = getCaseStudy(project.slug)
  const cover = study.cover || study.visual

  return (
    <div
      className="orbit-home"
      ref={root}
      role="region"
      aria-label="Digital Diego portfolio"
    >
      <section className="home-hero" aria-label="Introduction">
        <div className="home-intro">
          <p className="home-eyebrow">Product. Cloud. Infrastructure.</p>
          <h1>
            Hi, I’m <span className="home-name">Diego.</span>
          </h1>
          <p className="home-role">Full-stack engineer & technical lead.</p>
          <p className="home-description">
            I build web products, lead teams, and run the systems behind them.
          </p>
          <TechStack
            items={['React', 'TypeScript', 'Go', 'Python', 'AWS']}
            label="Core technologies"
            className="home-tech-stack"
            compact
          />
          <div className="home-actions">
            <Link className="button" to="/portfolio">
              View selected work <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/contact">
              Let’s talk <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
          <Link className="home-intro-result" to="/work/property-platform">
            <strong>3h → 1h</strong>
            <span>Daily admin work per employee. Measured at Emmut.</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <p className="home-availability">
            <span className="home-status-dot" aria-hidden="true" />
            Open to senior & lead roles
            <span className="home-location">
              <MapPin size={14} aria-hidden="true" /> Dallas, TX
            </span>
          </p>
        </div>
        <div
          className="home-playground"
          role="region"
          aria-label="Selected work preview"
        >
          <div className="home-stage-top">
            <span>
              Selected work <ArrowDownRight size={18} aria-hidden="true" />
            </span>
            <span className="home-stage-note">{project.name}</span>
          </div>
          <figure className="home-cover" data-cover={Boolean(study.cover)}>
            <Link
              className="home-cover-picture"
              to={`/work/${project.slug}`}
              aria-label={`Preview ${project.name} case study`}
            >
              <img
                key={project.slug}
                src={cover.src}
                alt={cover.alt}
                width="1280"
                height="800"
                decoding="async"
              />
            </Link>
            <figcaption>
              <span>{cover.caption}</span>
              <RobotPocket selected={selected} />
            </figcaption>
          </figure>
          <div
            className="home-scenes"
            role="group"
            aria-label="Choose a project"
          >
            {projects.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                aria-pressed={index === selected}
                aria-controls="home-preview-readout"
                onClick={() => setSelected(index)}
              >
                <item.icon size={17} strokeWidth={1.6} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div
            id="home-preview-readout"
            className="home-project-content"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="home-preview-result">
              <strong>{project.metric}</strong>
              <p>{project.metricCaption}</p>
            </div>
            <Link
              to={`/work/${project.slug}`}
              aria-label={`View selected ${project.name} case study`}
            >
              {project.name} <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <div className="home-proof-strip" aria-label="Results from my work">
        <Link to="/work/property-platform">
          <strong>2h</strong>
          <span>Emmut · Saved per employee, every day.</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/work/workflow-migration">
          <strong>7</strong>
          <span>AWS → Railway · Production workflows migrated.</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/work/local-inference">
          <strong>2</strong>
          <span>Local inference · Fixes merged upstream.</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <section className="home-workbench" aria-labelledby="home-work-title">
        <div className="home-work-heading">
          <h2 id="home-work-title">A few things I’ve shipped.</h2>
          <Link to="/portfolio">
            All projects <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-work-grid">
          {projects.map((item) => (
            <article
              className="home-work-summary"
              key={item.slug}
              aria-labelledby={`home-${item.slug}-title`}
            >
              <p className="home-summary-owner">{item.category}</p>
              <h3 id={`home-${item.slug}-title`}>
                <Link
                  to={`/work/${item.slug}`}
                  aria-label={`Open ${item.name} case study`}
                >
                  {item.name}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </h3>
              <p className="home-summary-description">{item.description}</p>
              <p className="home-summary-result">{item.metric}</p>
              <p className="home-summary-scope">{item.metricCaption}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="home-links">
        <Link className="home-lab-link" to="/infrastructure">
          <Cpu size={22} aria-hidden="true" />
          <span>
            <small>Built at home</small>
            <strong>Seven GPUs. Built and run by me.</strong>
          </span>
          <ArrowUpRight size={21} aria-hidden="true" />
        </Link>
        <Link className="home-agent-link" to="/infrastructure#agents">
          <Workflow size={22} aria-hidden="true" />
          <span>
            <small>Agent environments, connected tools & local inference</small>
            <strong>Hermes, agents & MCP</strong>
          </span>
          <ArrowUpRight size={21} aria-hidden="true" />
        </Link>
        <a
          className="home-resume-link"
          href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
          download
        >
          <Download size={22} aria-hidden="true" />
          <span>
            <small>One-page PDF</small>
            <strong>Download resume</strong>
          </span>
          <ArrowUpRight size={21} aria-hidden="true" />
        </a>
      </div>
      <SiteFooter />
    </div>
  )
}
