import { useEffect, useState } from 'react'
import { Cpu, Play, RotateCcw, Server, Workflow } from 'lucide-react'
import TechStack, { TechIcon } from '../TechStack'
import ServerExplorer from '../ServerExplorer'
import './style.css'

const views = {
  machine: {
    label: 'The machine',
    number: '01',
    category: 'Hardware',
    title: 'Seven GPUs. One local inference server.',
    description:
      'I built and operate a seven-RTX-3090 server for local models and coding agents.',
    details: [
      ['Hardware', '7 × NVIDIA RTX 3090', 'NVIDIA'],
      ['GPU memory', '24 GiB each · 168 GiB combined'],
      ['Purpose', 'Local model inference'],
    ],
    illustration:
      'Illustration of seven RTX 3090 GPUs with 168 GiB of combined memory',
    caption: 'Schematic illustration · 7 GPUs × 24 GiB',
  },
  software: {
    label: 'The software',
    number: '02',
    category: 'Inference stack',
    title: 'From a coding agent to local compute.',
    description:
      'An OpenAI-compatible gateway routes coding-agent requests to local model servers. Maya is my current default; TabbyAPI with ExLlamaV3 remains an alternate.',
    details: [
      ['Interface', 'OpenAI-compatible gateway', 'OpenAI-compatible gateway'],
      ['Default backend', 'Maya'],
      ['Alternate backend', 'TabbyAPI + ExLlamaV3', 'ExLlamaV3'],
    ],
    illustration:
      'Conceptual request path: coding agent, OpenAI-compatible gateway, model server, then local GPUs. Maya is the default backend; TabbyAPI with ExLlamaV3 is an alternate.',
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
      ['Compute & delivery', ['Proxmox', 'Linux', 'Docker Compose']],
      ['Networking', ['Tailscale', 'Caddy']],
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
      {Array.from({ length: 7 }, (_, index) => (
        <g
          className="lab-board"
          key={index}
          transform={`translate(${49 + index * 6} ${36 + index * 31})`}
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
        168
      </text>
      <text
        className="lab-svg-label lab-svg-accent"
        x="334"
        y="139"
        textAnchor="middle"
      >
        GiB
      </text>
      <path className="lab-trace lab-trace-accent" d="M335 159V228H309" />
      <circle className="lab-dot" cx="309" cy="228" r="4" />
    </>
  )
}

const requestPath = 'M137 83H341Q377 83 377 119V206Q377 238 343 238H140'

function SoftwareDrawing({ trace, onTraceComplete }) {
  return (
    <>
      <path className="lab-request-path" d={requestPath} />
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
      {trace.run > 0 && (
        <g
          key={trace.run}
          className={`lab-request-trace${trace.status === 'complete' ? ' is-complete' : ''}`}
          aria-hidden="true"
        >
          <path
            className="lab-request-progress"
            d={requestPath}
            pathLength="1"
          />
          <circle
            className="lab-request-node lab-request-agent"
            cx="116"
            cy="83"
            r="32"
          />
          <circle
            className="lab-request-node lab-request-gateway"
            cx="341"
            cy="83"
            r="30"
          />
          <circle
            className="lab-request-node lab-request-server"
            cx="343"
            cy="238"
            r="32"
          />
          <circle
            className="lab-request-node lab-request-gpus"
            cx="109"
            cy="238"
            r="35"
            onAnimationEnd={() => onTraceComplete(trace.run)}
          />
        </g>
      )}
      <text className="lab-svg-label" x="116" y="142" textAnchor="middle">
        Coding agent
      </text>
      <text className="lab-svg-label" x="341" y="142" textAnchor="middle">
        Gateway
      </text>
      <text className="lab-svg-label" x="343" y="296" textAnchor="middle">
        Model server
      </text>
      <text className="lab-svg-label" x="109" y="296" textAnchor="middle">
        Local GPUs
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
  const [trace, setTrace] = useState({ run: 0, status: 'idle' })
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const view = views[selectedView]
  const Drawing = drawings[selectedView]

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function updatePreference() {
      setReducedMotion(preference.matches)
      if (preference.matches) {
        setTrace((current) =>
          current.status === 'playing'
            ? { ...current, status: 'complete' }
            : current
        )
      }
    }
    if (typeof preference.addEventListener === 'function') {
      preference.addEventListener('change', updatePreference)
      return () => preference.removeEventListener('change', updatePreference)
    }
    if (typeof preference.addListener === 'function') {
      preference.addListener(updatePreference)
      return () => preference.removeListener(updatePreference)
    }
    return undefined
  }, [])

  function selectView(nextView) {
    if (nextView === selectedView) return
    setSelectedView(nextView)
    setTrace({ run: 0, status: 'idle' })
  }

  function traceRequest() {
    setTrace((current) => ({
      run: current.run + 1,
      status: reducedMotion ? 'complete' : 'playing',
    }))
  }

  function completeTrace(run) {
    setTrace((current) =>
      current.run === run ? { ...current, status: 'complete' } : current
    )
  }

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
              onClick={() => selectView(key)}
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
          {selectedView === 'machine' ? (
            <ServerExplorer
              fallback={
                <svg
                  className="lab-explorer-drawing"
                  viewBox="0 0 480 330"
                  role="img"
                  aria-label={view.illustration}
                >
                  <MachineDrawing />
                </svg>
              }
            />
          ) : (
            <svg
              key={selectedView}
              className="lab-explorer-drawing"
              viewBox="0 0 480 330"
              role="img"
              aria-label={view.illustration}
            >
              <Drawing trace={trace} onTraceComplete={completeTrace} />
            </svg>
          )}
          <figcaption>{view.caption}</figcaption>
          {selectedView === 'software' && (
            <div className="lab-request-controls">
              <button
                type="button"
                className="lab-trace-button"
                onClick={traceRequest}
              >
                {trace.run > 0 ? (
                  <RotateCcw size={16} aria-hidden="true" />
                ) : (
                  <Play size={16} aria-hidden="true" />
                )}
                {trace.run > 0 ? 'Replay request trace' : 'Trace a request'}
              </button>
              <p className="lab-trace-status" role="status" aria-atomic="true">
                <span>
                  {trace.status === 'playing'
                    ? 'Tracing the conceptual request path.'
                    : trace.status === 'complete'
                      ? 'Trace complete.'
                      : 'Request path'}
                </span>
                Coding agent → gateway → model server → local GPUs.
              </p>
            </div>
          )}
        </figure>
        <dl className="lab-explorer-details">
          {view.details.map(([label, value, iconName]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={iconName ? 'lab-detail-with-icon' : undefined}>
                {Array.isArray(value) ? (
                  <TechStack
                    items={value}
                    label={`${label} technologies`}
                    compact
                  />
                ) : (
                  <>
                    {iconName && <TechIcon name={iconName} size={18} />}
                    {value}
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
