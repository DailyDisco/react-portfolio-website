import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  GitBranch,
  Mail,
  MapPin,
  Music2,
} from 'lucide-react'
import { getCaseStudy } from '../../data/caseStudies'
import './style.css'

const product = getCaseStudy('property-platform')
const migration = getCaseStudy('workflow-migration')
const inference = getCaseStudy('local-inference')
const resumePath = `${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`

function ChapterLabel({ number, children }) {
  return (
    <p className="home-story-label">
      <span aria-hidden="true">{number}</span>
      {children}
    </p>
  )
}

function CaseLink({ slug, children }) {
  return (
    <Link className="home-story-link" to={`/work/${slug}`}>
      {children} <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  )
}

function GpuDrawing() {
  return (
    <svg
      className="home-story-gpu-drawing"
      viewBox="0 0 500 245"
      role="img"
      aria-label="Hardware illustration of seven RTX 3090 graphics cards, each with 24 GiB of memory"
    >
      <path className="home-story-gpu-rail" d="M35 208H465M55 219H445" />
      {Array.from({ length: 7 }, (_, index) => (
        <g key={index} transform={`translate(${43 + index * 59} 45)`}>
          <path
            className="home-story-gpu-side"
            d="M0 10L8 0H44V142L36 152H0Z"
          />
          <rect
            className="home-story-gpu-face"
            width="36"
            height="142"
            x="0"
            y="10"
            rx="3"
          />
          <circle className="home-story-gpu-fan" cx="18" cy="45" r="12" />
          <circle className="home-story-gpu-fan" cx="18" cy="82" r="12" />
          <path
            className="home-story-gpu-detail"
            d="M18 34V56M7 45H29M18 71V93M7 82H29M7 117H29M7 123H29M7 129H29"
          />
          <path className="home-story-gpu-contact" d="M8 152V163H29V152" />
          <text x="18" y="-12" textAnchor="middle">
            {String(index + 1).padStart(2, '0')}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function HomeStory() {
  return (
    <div className="home-story">
      <section
        className="home-story-chapter home-story-product"
        id="home-results"
        data-home-story-chapter
        tabIndex={-1}
        aria-labelledby="home-results-title"
      >
        <div className="home-story-product-intro">
          <ChapterLabel number="01">Software people use</ChapterLabel>
          <h2 id="home-results-title">Give people their time back.</h2>
          <p className="home-story-lead">
            At Emmut, I led a four-developer team building property management
            software for more than 1,000 units.
          </p>
          <p>
            I automated invoicing, financial calculations, and reporting so
            staff could spend less of their day on admin.
          </p>
          <CaseLink slug={product.slug}>How I built Emmut</CaseLink>
        </div>
        <figure className="home-story-time-display">
          <p>Measured daily admin work</p>
          <div className="home-story-time-change">
            <div>
              <span>Before</span>
              <strong>3<small>h</small></strong>
            </div>
            <ArrowRight size={36} strokeWidth={1.2} aria-hidden="true" />
            <div>
              <span>After</span>
              <strong>1<small>h</small></strong>
            </div>
          </div>
          <figcaption>
            Two hours saved per employee, every day.
          </figcaption>
        </figure>
        <figure className="home-story-product-visual">
          <div className="home-story-window-label">
            <span>Emmut · Actual interface</span>
            <span>Synthetic demo data</span>
          </div>
          <img
            src={product.visual.src}
            alt={product.visual.alt}
            width="2560"
            height="1600"
            loading="lazy"
          />
          <figcaption>Emmut maintenance management.</figcaption>
        </figure>
        <dl className="home-story-product-facts">
          <div>
            <dt>The scope</dt>
            <dd>1,000+ property units</dd>
          </div>
          <div>
            <dt>My responsibility</dt>
            <dd>Architecture, delivery, and a team of four</dd>
          </div>
          <div>
            <dt>The stack</dt>
            <dd>Next.js · TypeScript · PostgreSQL</dd>
          </div>
        </dl>
      </section>

      <section
        className="home-story-chapter home-story-migration"
        id="home-range"
        data-home-story-chapter
        tabIndex={-1}
        aria-labelledby="home-range-title"
      >
        <header className="home-story-migration-heading">
          <ChapterLabel number="02">The systems behind the product</ChapterLabel>
          <h2 id="home-range-title">Then keep the work moving.</h2>
        </header>
        <div className="home-story-migration-copy">
          <p className="home-story-lead">
            For Craft Digital, I moved seven production lead workflows from
            Kestra on AWS to n8n on Railway.
          </p>
          <p>
            Intake saves each submission before processing it. Recovery and
            reconciliation were part of the migration, alongside the September
            2026 production cutover.
          </p>
          <CaseLink slug={migration.slug}>Inside the migration</CaseLink>
        </div>
        <figure className="home-story-migration-visual">
          <img
            src={migration.visual.src}
            alt={migration.visual.alt}
            width="1000"
            height="625"
            loading="lazy"
          />
          <figcaption>
            Architecture overview · Craft Digital contract through Lumara,
            since July 2026.
          </figcaption>
        </figure>
        <div className="home-story-range-note">
          <Check size={23} strokeWidth={1.7} aria-hidden="true" />
          <p>
            I can own the path from a user action to a working system.
          </p>
        </div>
      </section>

      <section
        className="home-story-chapter home-story-systems"
        id="home-approach"
        data-home-story-chapter
        tabIndex={-1}
        aria-labelledby="home-approach-title"
      >
        <div className="home-story-systems-copy">
          <ChapterLabel number="03">Curiosity that ships upstream</ChapterLabel>
          <h2 id="home-approach-title">Go all the way down the stack.</h2>
          <p className="home-story-lead">
            Operating my own local AI server and Proxmox homelab led me into
            the stack’s source code.
          </p>
          <p>
            I traced a CPU bottleneck in ExLlamaV3 and a recovery problem in
            TabbyAPI. Both fixes merged upstream.
          </p>
          <div className="home-story-upstream-links">
            {inference.links.map((link) => (
              <a
                key={link.url}
                className="home-story-link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <figure className="home-story-machine">
          <p className="home-story-machine-label">Current local inference server</p>
          <div className="home-story-memory">
            <strong>168<small>GiB</small></strong>
            <p>combined GPU memory</p>
          </div>
          <GpuDrawing />
          <figcaption>Hardware illustration · 7 × NVIDIA RTX 3090</figcaption>
        </figure>
        <div className="home-story-benchmark">
          <div>
            <strong>+18<span>%</span></strong>
            <p>faster cold prompt processing</p>
          </div>
          <p>
            1,238 → 1,458 tokens/s in my earlier six-GPU benchmark. Decode speed
            was unchanged.
          </p>
          <CaseLink slug={inference.slug}>The fix and the measurement</CaseLink>
        </div>
        <div className="home-story-operations">
          <p>Built, deployed, and operated.</p>
          <p>
            Linux · Proxmox · Docker · Tailscale · Caddy · Metrics and logs ·
            Backup and restore validation
          </p>
          <Link className="home-story-link" to="/infrastructure">
            Explore my homelab <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        className="home-story-chapter home-story-collaboration"
        id="home-contact"
        data-home-story-chapter
        tabIndex={-1}
        aria-labelledby="home-contact-title"
      >
        <header className="home-story-collaboration-heading">
          <ChapterLabel number="04">The person you would work with</ChapterLabel>
          <h2 id="home-contact-title">Hands-on, even when I’m leading.</h2>
          <p className="home-story-lead">
            I’m Diego Espino, founder of Lumara Technologies. I help teams own
            the product and its engineering.
          </p>
        </header>
        <div className="home-story-working-style">
          <div>
            <h3>Own the whole problem.</h3>
            <p>
              Connect the interface, API, data, and infrastructure to the
              business goal.
            </p>
          </div>
          <div>
            <h3>Lead close to the code.</h3>
            <p>
              Lead the team, build features, review changes, and test failure
              paths.
            </p>
          </div>
          <div>
            <h3>Make the system explainable.</h3>
            <p>
              Durable intake, bounded retries, and clear contracts make
              failures recoverable.
            </p>
          </div>
        </div>
        <div className="home-story-profile">
          <div className="home-story-experience">
            <h3>Where I work</h3>
            <dl>
              <div>
                <dt>DFW Software Consulting</dt>
                <dd>Primary contract through Lumara</dd>
              </div>
              <div>
                <dt>Craft Digital</dt>
                <dd>Engineering contract through Lumara</dd>
              </div>
              <div>
                <dt>Lumara Technologies</dt>
                <dd>Founder · Independent client engagements</dd>
              </div>
              <div>
                <dt>Games For Love</dt>
                <dd>Volunteer full-stack developer</dd>
              </div>
            </dl>
            <p className="home-story-credentials">
              AWS Certified Developer – Associate · AWS Certified Cloud
              Practitioner
            </p>
          </div>
          <div className="home-story-tools">
            <h3>What I build with</h3>
            <dl>
              <div>
                <dt>Product & APIs</dt>
                <dd>TypeScript · React · Next.js · Go · Python</dd>
              </div>
              <div>
                <dt>Data & delivery</dt>
                <dd>PostgreSQL · Redis · AWS · Railway · Docker</dd>
              </div>
            </dl>
            <p>
              Also: shared state, resumable events, and Unity API contracts for
              confidential mixed reality work.
            </p>
          </div>
        </div>
        <div className="home-story-personal">
          <figure>
            <img
              src="/brand/code-hardware-music.webp"
              alt="An illustrated still life of piano keys, a computer heatsink, and a circuit board joined by an ochre cable."
              width="1024"
              height="1024"
              loading="lazy"
            />
            <figcaption>Code, hardware, and bass music. An illustrated study.</figcaption>
          </figure>
          <div>
            <Music2 size={26} strokeWidth={1.5} aria-hidden="true" />
            <h3>Away from the terminal</h3>
            <p>
              I produce bass music, learn piano, and build with hardware.
            </p>
            <p className="home-story-location">
              <MapPin size={18} aria-hidden="true" />
              Dallas-Fort Worth · English & Spanish
            </p>
          </div>
        </div>
        <div className="home-story-contact">
          <div className="home-story-contact-copy">
            <p className="home-story-label">Open to senior & lead engineering roles</p>
            <h3>What are you building?</h3>
            <p>
              Need a full-stack engineer who can lead and build with you?
              Let’s talk.
            </p>
          </div>
          <div className="home-story-contact-actions">
            <a
              className="home-story-button"
              href="mailto:diegoespinowork@gmail.com"
            >
              Email Diego <Mail size={20} aria-hidden="true" />
            </a>
            <a
              className="home-story-button home-story-button-secondary"
              href={resumePath}
            >
              Read my résumé <Download size={19} aria-hidden="true" />
            </a>
            <div className="home-story-socials">
              <a
                href="https://github.com/DailyDisco"
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch size={18} aria-hidden="true" /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/developerdiego"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <Link to="/contact">
                Contact form <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
