import { useState } from 'react'
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
      <path
        className="lab-trace lab-trace-faint"
        d="M74 334H536M106 350H568M66 70H135V35H540"
      />
      <text className="lab-svg-small" x="440" y="44">
        GPU MEMORY
      </text>
      <text className="lab-svg-total" x="437" y="108">
        144
      </text>
      <text className="lab-svg-unit" x="443" y="136">
        GB COMBINED
      </text>
      <path className="lab-trace lab-trace-accent" d="M457 154V253H409" />
      <circle className="lab-dot" cx="409" cy="253" r="4" />
      {Array.from({ length: 6 }, (_, index) => (
        <g
          className="lab-board"
          key={index}
          transform={`translate(${92 + index * 10}, ${43 + index * 44})`}
        >
          <path
            className="lab-board-edge"
            d="M0 15L40 0H257L292 26V45H44L0 31Z"
          />
          <path className="lab-board-face" d="M0 15L44 32H292L253 15Z" />
          <path className="lab-board-line" d="M44 32V45M55 36H139M155 36H241" />
          <path className="lab-board-chip" d="M157 6H195L211 15H173Z" />
          <path
            className="lab-board-circuit"
            d="M82 5H134L152 13M86 10H120M213 6H240"
          />
          <text className="lab-svg-index" x="52" y="27">
            0{index + 1}
          </text>
          <text className="lab-svg-card" x="86" y="27">
            RTX 3090
          </text>
          <text className="lab-svg-card" x="217" y="27">
            24 GB
          </text>
          <circle className="lab-dot" cx="279" cy="37" r="2" />
        </g>
      ))}
      <text className="lab-svg-small" x="90" y="371">
        SIX CARDS / LOCAL MODELS
      </text>
    </>
  )
}

function SoftwareDrawing() {
  return (
    <>
      <path
        className="lab-trace lab-trace-faint"
        d="M65 70H548V336H90M90 55V344"
      />
      <text className="lab-svg-small" x="90" y="41">
        REQUEST → INFERENCE
      </text>
      <path
        className="lab-request-path"
        d="M103 98H277Q306 98 306 127V173Q306 202 336 202H414"
      />
      <path className="lab-return-path" d="M439 262V313H125V261" />
      <path
        className="lab-arrow"
        d="M399 194L414 202L399 210M117 273L125 261L133 273"
      />
      <circle className="lab-endpoint" cx="104" cy="98" r="16" />
      <path
        className="lab-terminal-mark"
        d="M98 93L104 98L98 103M108 104H114"
      />
      <text className="lab-svg-label" x="86" y="140">
        Coding agent
      </text>
      <text className="lab-svg-small" x="86" y="164">
        CLIENT
      </text>
      <path className="lab-gateway" d="M224 75V121M237 75V121M250 75V121" />
      <text className="lab-svg-label" x="185" y="55">
        Gateway
      </text>
      <text className="lab-svg-small" x="182" y="151">
        OPENAI-COMPATIBLE
      </text>
      <circle className="lab-api-ring" cx="306" cy="202" r="27" />
      <circle className="lab-api-center" cx="306" cy="202" r="10" />
      <text className="lab-svg-label" x="206" y="244">
        TabbyAPI
      </text>
      <text className="lab-svg-small" x="206" y="266">
        MODEL SERVING
      </text>
      <circle className="lab-engine-orbit" cx="461" cy="202" r="84" />
      <circle className="lab-engine-ring" cx="461" cy="202" r="66" />
      <path
        className="lab-engine-core"
        d="M441 167H480L500 202L480 237H441L422 202Z"
      />
      <path
        className="lab-engine-circuit"
        d="M447 189H475M447 202H475M447 215H475"
      />
      <text className="lab-svg-label" x="414" y="101">
        ExLlamaV3
      </text>
      <text className="lab-svg-small" x="418" y="337">
        GPU INFERENCE
      </text>
      <text className="lab-svg-small" x="89" y="371">
        A FAMILIAR API / LOCAL COMPUTE
      </text>
    </>
  )
}

function HomelabDrawing() {
  return (
    <>
      <text className="lab-svg-small" x="82" y="42">
        OPERATING THE SYSTEM
      </text>
      <ellipse className="lab-orbit" cx="322" cy="203" rx="176" ry="126" />
      <ellipse
        className="lab-orbit lab-orbit-inner"
        cx="322"
        cy="203"
        rx="108"
        ry="78"
      />
      <path
        className="lab-trace"
        d="M322 110V146M397 203H444M322 260V295M190 203H244"
      />
      <path
        className="lab-hub"
        d="M264 171L322 141L380 171V234L322 264L264 234Z"
      />
      <path
        className="lab-hub-detail"
        d="M280 176L322 198L364 176M322 198V244"
      />
      <text className="lab-svg-hub" x="322" y="205" textAnchor="middle">
        Proxmox
      </text>
      <text className="lab-svg-small" x="322" y="225" textAnchor="middle">
        LINUX
      </text>
      <g transform="translate(322 77)">
        <circle className="lab-operation-node" r="26" />
        <path
          className="lab-operation-icon"
          d="M-10 -7H-2V1H-10ZM2 -7H10V1H2ZM-4 5H4V13H-4Z"
        />
      </g>
      <text className="lab-svg-label" x="365" y="78">
        Docker Compose
      </text>
      <text className="lab-svg-small" x="365" y="98">
        DELIVERY
      </text>
      <g transform="translate(497 203)">
        <circle className="lab-operation-node" r="26" />
        <path className="lab-operation-icon" d="M-9 -7L9 7M9 -7L-9 7" />
        <circle className="lab-dot" cx="-9" cy="-7" r="3" />
        <circle className="lab-dot" cx="9" cy="7" r="3" />
        <circle className="lab-dot" cx="9" cy="-7" r="3" />
        <circle className="lab-dot" cx="-9" cy="7" r="3" />
      </g>
      <text className="lab-svg-label" x="454" y="253">
        Tailscale
      </text>
      <text className="lab-svg-small" x="454" y="274">
        CADDY
      </text>
      <g transform="translate(322 329)">
        <circle className="lab-operation-node" r="26" />
        <path
          className="lab-operation-icon"
          d="M-10 3A11 11 0 1 0-3 -10M-10 -7V3H0"
        />
      </g>
      <text className="lab-svg-label" x="365" y="328">
        Restore validation
      </text>
      <text className="lab-svg-small" x="365" y="349">
        RECOVERY
      </text>
      <g transform="translate(146 203)">
        <circle className="lab-operation-node" r="26" />
        <path className="lab-operation-icon" d="M-12 5H-7L-3 -8L3 9L7 -1H12" />
      </g>
      <text className="lab-svg-label" x="78" y="253">
        Metrics + logs
      </text>
      <text className="lab-svg-small" x="78" y="274">
        OBSERVABILITY
      </text>
    </>
  )
}

const drawings = {
  machine: MachineDrawing,
  software: SoftwareDrawing,
  homelab: HomelabDrawing,
}

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
      <div className="lab-explorer-topline">
        <span className="lab-explorer-kicker">UNDER THE HOOD</span>
        <span className="lab-explorer-note">My own infrastructure.</span>
      </div>
      <div
        className="lab-explorer-controls"
        role="group"
        aria-label="Choose an infrastructure view"
      >
        {Object.entries(views).map(([key, item]) => (
          <button
            type="button"
            key={key}
            aria-pressed={selectedView === key}
            onClick={() => setSelectedView(key)}
          >
            <span className="lab-control-number" aria-hidden="true">
              {item.number}
            </span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="lab-explorer-content">
        <div
          className="lab-explorer-copy"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="lab-view-category">
            <span aria-hidden="true">{view.number}</span>
            {view.category}
          </div>
          <h2>{view.title}</h2>
          <p>{view.description}</p>
          <dl className="lab-explorer-details">
            {view.details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="lab-explorer-figure">
          <svg
            key={selectedView}
            className="lab-explorer-drawing"
            viewBox="0 0 640 400"
            role="img"
            aria-label={view.illustration}
          >
            <Drawing />
          </svg>
          <figcaption>{view.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
