import { useState } from 'react'
import { Cpu, Server, Workflow } from 'lucide-react'
import './style.css'

const views = {
  machine: {
    label: 'The machine',
    number: '01',
    category: 'Hardware',
    title: 'Six GPUs. One local inference server.',
    description:
      'I built and operate a six-RTX-3090 server for local models and coding agents.',
    details: [
      ['Hardware', '6 × NVIDIA RTX 3090'],
      ['GPU memory', '24 GB each · 144 GB combined'],
      ['Purpose', 'Local model inference'],
    ],
    illustration:
      'Illustration of six RTX 3090 GPUs with 144 GB of combined memory',
    caption: 'Hardware illustration · 6 GPUs × 24 GB',
  },
  software: {
    label: 'The software',
    number: '02',
    category: 'Inference stack',
    title: 'From a coding agent to local compute.',
    description:
      'An OpenAI-compatible gateway connects coding agents to local models served by TabbyAPI and ExLlamaV3.',
    details: [
      ['Interface', 'OpenAI-compatible gateway'],
      ['Serving', 'TabbyAPI'],
      ['Inference', 'ExLlamaV3'],
    ],
    illustration:
      'Conceptual request path from a coding agent through a gateway and TabbyAPI to ExLlamaV3',
    caption: 'Conceptual request path · Local model serving',
  },
  homelab: {
    label: 'The homelab',
    number: '03',
    category: 'Operations',
    title: 'Provisioning, networking, and recovery.',
    description:
      'My homelab is where I work through provisioning, networking, observability, and recovery for self-hosted services.',
    details: [
      ['Compute & delivery', 'Proxmox · Linux · Docker Compose'],
      ['Networking', 'Tailscale · Caddy'],
      ['Operations', 'Metrics, logs, backup and restore validation'],
    ],
    illustration:
      'Capabilities map linking Linux and Proxmox with Docker, Tailscale, Caddy, metrics, logs, and restore validation',
    caption: 'Capabilities map · Self-hosted infrastructure',
  },
}

function MachineDrawing() {
  return (
    <>
      <path className="lab-guide" d="M38 286H438" />
      {Array.from({ length: 6 }, (_, index) => (
        <g
          className="lab-board"
          key={index}
          transform={`translate(${49 + index * 7} ${36 + index * 37})`}
        >
          <path
            className="lab-board-edge"
            d="M0 17L31 0H186L218 20V35H34L0 23Z"
          />
          <path className="lab-board-face" d="M0 17L34 27H218L185 17Z" />
          <path className="lab-board-line" d="M34 27V35M43 30H100M111 30H175" />
          <path className="lab-board-chip" d="M125 5H151L167 14H141Z" />
          <path
            className="lab-board-circuit"
            d="M58 5H96L109 13M61 10H90M170 6H185"
          />
        </g>
      ))}
      <text className="lab-svg-total" x="334" y="109" textAnchor="middle">
        144
      </text>
      <text
        className="lab-svg-label lab-svg-accent"
        x="334"
        y="139"
        textAnchor="middle"
      >
        GB
      </text>
      <path className="lab-trace lab-trace-accent" d="M335 159V228H309" />
      <circle className="lab-dot" cx="309" cy="228" r="4" />
    </>
  )
}

function SoftwareDrawing() {
  return (
    <>
      <path
        className="lab-request-path"
        d="M137 83H341Q377 83 377 119V206Q377 238 343 238H140"
      />
      <path
        className="lab-arrow"
        d="M238 76L248 83L238 90M257 231L247 238L257 245"
      />
      <circle className="lab-operation-node" cx="116" cy="83" r="24" />
      <path
        className="lab-operation-icon"
        d="M106 77L113 83L106 89M118 90H128"
      />
      <path className="lab-gateway" d="M331 65V101M341 65V101M351 65V101" />
      <circle className="lab-operation-node" cx="343" cy="238" r="24" />
      <circle className="lab-api-center" cx="343" cy="238" r="8" />
      <path
        className="lab-engine-core"
        d="M95 216H120L133 238L120 260H95L82 238Z"
      />
      <path className="lab-operation-icon" d="M98 233H118M98 242H118" />
      <text className="lab-svg-label" x="116" y="142" textAnchor="middle">
        Coding agent
      </text>
      <text className="lab-svg-label" x="341" y="142" textAnchor="middle">
        Gateway
      </text>
      <text className="lab-svg-label" x="343" y="296" textAnchor="middle">
        TabbyAPI
      </text>
      <text className="lab-svg-label" x="109" y="296" textAnchor="middle">
        ExLlamaV3
      </text>
    </>
  )
}

function HomelabDrawing() {
  return (
    <>
      <path
        className="lab-trace"
        d="M135 170H178V56H206M178 132H206M178 208H206M178 170V284H206"
      />
      <g className="lab-server">
        <rect x="46" y="121" width="89" height="29" rx="3" />
        <rect x="46" y="156" width="89" height="29" rx="3" />
        <rect x="46" y="191" width="89" height="29" rx="3" />
        <path d="M60 135H106M60 170H106M60 205H106" />
        <circle cx="121" cy="135" r="2" />
        <circle cx="121" cy="170" r="2" />
        <circle cx="121" cy="205" r="2" />
      </g>
      <text className="lab-svg-label" x="92" y="260" textAnchor="middle">
        Proxmox
      </text>
      <text className="lab-svg-secondary" x="92" y="287" textAnchor="middle">
        Linux
      </text>
      <g className="lab-capability-labels">
        <circle className="lab-dot" cx="211" cy="56" r="4" />
        <text className="lab-svg-label" x="229" y="65">
          Docker Compose
        </text>
        <circle className="lab-dot" cx="211" cy="132" r="4" />
        <text className="lab-svg-label" x="229" y="141">
          Tailscale · Caddy
        </text>
        <circle className="lab-dot" cx="211" cy="208" r="4" />
        <text className="lab-svg-label" x="229" y="217">
          Metrics + logs
        </text>
        <circle className="lab-dot" cx="211" cy="284" r="4" />
        <text className="lab-svg-label" x="229" y="293">
          Restore checks
        </text>
      </g>
    </>
  )
}

const drawings = {
  machine: MachineDrawing,
  software: SoftwareDrawing,
  homelab: HomelabDrawing,
}
const controlIcons = { machine: Cpu, software: Workflow, homelab: Server }

export default function LabExplorer({ compact = false }) {
  const [selectedView, setSelectedView] = useState('machine')
  const view = views[selectedView]
  const Drawing = drawings[selectedView]

  return (
    <section
      className={`lab-explorer${compact ? ' lab-explorer-compact' : ''}`}
      aria-label="Explore my infrastructure"
      data-view={selectedView}
    >
      <div
        className="lab-explorer-controls"
        role="group"
        aria-label="Choose an infrastructure view"
      >
        {Object.entries(views).map(([key, item]) => {
          const Icon = controlIcons[key]
          return (
            <button
              type="button"
              key={key}
              aria-pressed={selectedView === key}
              onClick={() => setSelectedView(key)}
            >
              <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
      <div className="lab-explorer-content">
        <div
          className="lab-explorer-copy"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="lab-view-category">{view.category}</p>
          <h2>{view.title}</h2>
          <p>{view.description}</p>
        </div>
        <figure className="lab-explorer-figure">
          <svg
            key={selectedView}
            className="lab-explorer-drawing"
            viewBox="0 0 480 330"
            role="img"
            aria-label={view.illustration}
          >
            <Drawing />
          </svg>
          <figcaption>{view.caption}</figcaption>
        </figure>
        <dl className="lab-explorer-details">
          {view.details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
