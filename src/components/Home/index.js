import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Download,
  Hand,
  PanelsTopLeft,
  Pause,
  Play,
  Workflow,
} from 'lucide-react'
import { getCaseStudy } from '../../data/caseStudies'
import DiscoCompanion from '../DiscoCompanion'
import SiteFooter from '../SiteFooter'
import useHomeMotion from './useHomeMotion'
import './console.css'

const projects = [
  {
    slug: 'property-platform',
    label: 'Product',
    scene: 'Building useful things.',
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
    scene: 'Keeping work moving.',
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
    scene: 'Going below the surface.',
    icon: Cpu,
    name: 'Local inference',
    category: 'Infrastructure & open source / Built at home',
    description: 'Two fixes merged into ExLlamaV3 and TabbyAPI.',
    metric: '+18%',
    metricCaption: 'Faster cold prompt processing. Measured on six GPUs.',
  },
]

export default function Home() {
  const [selected, setSelected] = useState(0)
  const [greeting, setGreeting] = useState(0)
  const [motionPaused, setMotionPaused] = useState(false)
  const root = useRef(null)
  useHomeMotion(root, selected)
  const project = projects[selected]
  const study = getCaseStudy(project.slug)

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
            React and TypeScript to cloud infrastructure and local AI.
          </p>
          <div className="home-actions">
            <Link className="button" to="/portfolio">
              View selected work <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/contact">
              Let’s talk <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
          <p className="home-availability">
            <span className="home-status-dot" aria-hidden="true" />
            Open to senior & lead roles
            <span className="home-location">Dallas, TX</span>
          </p>
        </div>
        <div className="home-playground">
          <div className="home-stage-top">
            <span>
              Meet Disco <ArrowDownRight size={18} aria-hidden="true" />
            </span>
            <span className="home-stage-note">Code. Hardware. Bass music.</span>
          </div>
          <div className="home-mascot-stage">
            <DiscoCompanion
              selected={selected}
              greeting={greeting}
              motionPaused={motionPaused}
            />
          </div>
          <div className="home-stage-bottom">
            <button
              className="home-replay"
              type="button"
              onClick={() => setGreeting((value) => value + 1)}
              aria-label="Say hello to Disco"
            >
              <Hand size={17} aria-hidden="true" /> Say hello
            </button>
            <button
              className="home-motion-toggle"
              type="button"
              aria-pressed={motionPaused}
              onClick={() => setMotionPaused((value) => !value)}
            >
              {motionPaused ? (
                <Play size={16} aria-hidden="true" />
              ) : (
                <Pause size={16} aria-hidden="true" />
              )}
              {motionPaused ? 'Resume animation' : 'Pause animation'}
            </button>
          </div>
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
                onClick={() => setSelected(index)}
              >
                <item.icon size={17} strokeWidth={1.6} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <p className="home-scene-caption" aria-live="polite">
            {project.scene}
          </p>
        </div>
      </section>
      <div className="home-proof-strip" aria-label="Results from my work">
        <Link to="/work/property-platform">
          <strong>2h</strong>
          <span>Saved per employee, every day.</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/work/workflow-migration">
          <strong>7</strong>
          <span>Production workflows migrated.</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/work/local-inference">
          <strong>2</strong>
          <span>Fixes merged upstream.</span>
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
        <div
          className="home-project-content"
          key={project.slug}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="home-project-copy">
            <div className="home-project-top">
              <p>{project.category}</p>
              <h3>{project.name}</h3>
            </div>
            <p className="home-project-summary">{project.description}</p>
            <div className="home-project-metric">
              <strong>{project.metric}</strong>
              <p>{project.metricCaption}</p>
            </div>
            <div className="home-project-bottom">
              <Link
                to={`/work/${project.slug}`}
                aria-label={`Open ${project.name} case study`}
              >
                Read case study <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <figure className="home-project-visual" data-project={project.slug}>
            <div className="home-project-picture">
              <img
                src={study.visual.src}
                alt={study.visual.alt}
                loading="lazy"
                width="1280"
                height="800"
              />
            </div>
            <figcaption>{study.visual.caption}</figcaption>
          </figure>
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
