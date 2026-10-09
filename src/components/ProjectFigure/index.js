import './style.css'

function PropertyFigure() {
  return (
    <figure className="project-figure property-figure">
      <div className="figure-heading">
        <span>Measured impact</span>
        <span>Emmut Properties</span>
      </div>
      <h2>
        Two hours back.
        <br />
        <em>Every day.</em>
      </h2>
      <div className="comparison-bars">
        <div>
          <span>Before</span>
          <div className="comparison-track">
            <div style={{ width: '100%' }} />
            <strong>3 hours</strong>
          </div>
        </div>
        <div>
          <span>After</span>
          <div className="comparison-track">
            <div style={{ width: '33.333%' }} />
            <strong>1 hour</strong>
          </div>
        </div>
      </div>
      <figcaption>
        Measured daily administrative work per employee, before and after
        workflow automation.
      </figcaption>
    </figure>
  )
}

function MigrationFigure() {
  return (
    <figure className="project-figure migration-figure">
      <div className="figure-heading">
        <span>Production cutover</span>
        <span>September 2026</span>
      </div>
      <div className="migration-journey">
        <div>
          <span>From</span>
          <strong>Kestra</strong>
          <small>AWS</small>
        </div>
        <svg viewBox="0 0 180 160" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <path
              key={index}
              d={`M 4 ${20 + index * 20} C 85 ${20 + index * 20}, 95 ${140 - index * 20}, 174 ${140 - index * 20}`}
            />
          ))}
          <circle cx="90" cy="80" r="27" />
          <text x="90" y="90" textAnchor="middle">
            7
          </text>
        </svg>
        <div>
          <span>To</span>
          <strong>n8n</strong>
          <small>Railway</small>
        </div>
      </div>
      <figcaption>
        Seven production lead-intake workflows migrated. Payload persistence and
        recovery were part of the cutover work.
      </figcaption>
    </figure>
  )
}

function StreamFigure() {
  return (
    <figure className="project-figure stream-figure">
      <div className="figure-heading">
        <span>Resumable event delivery</span>
        <span>Conceptual view</span>
      </div>
      <div className="stream-sequence" aria-hidden="true">
        <svg viewBox="0 0 440 150">
          <path className="stream-line" d="M20 45H176M266 45H420" />
          <path
            className="stream-recovery"
            d="M176 45C176 115 266 115 266 45"
          />
          {[35, 83, 131, 290, 338, 386].map((x) => (
            <g key={x}>
              <rect x={x} y="35" width="20" height="20" rx="3" />
              <path d={`M${x + 5} 45h10`} />
            </g>
          ))}
          <path className="stream-gap" d="M196 32l16 26m-16 0l16-26" />
          <text x="218" y="133" textAnchor="middle">
            resume
          </text>
        </svg>
        <div>
          <span>Connected</span>
          <span>Interrupted</span>
          <span>Recovered</span>
        </div>
      </div>
      <p className="stream-caption">
        Shared state. Scoped access.
        <br />
        <strong>A way back after a disconnect.</strong>
      </p>
      <figcaption>
        Redis-backed state and resumable server-sent events, with channel
        authorization and bounded queues.
      </figcaption>
    </figure>
  )
}

function InferenceFigure() {
  return (
    <figure className="project-figure inference-figure">
      <div className="figure-heading">
        <span>ExLlamaV3 benchmark</span>
        <span>6 × RTX 3090</span>
      </div>
      <div className="benchmark-result">
        <strong>
          +18<span>%</span>
        </strong>
        <p>
          cold prompt
          <br />
          throughput
        </p>
      </div>
      <div className="comparison-bars">
        <div>
          <span>Before</span>
          <div className="comparison-track">
            <div style={{ width: '84.91%' }} />
            <strong>1,238 tok/s</strong>
          </div>
        </div>
        <div>
          <span>After</span>
          <div className="comparison-track">
            <div style={{ width: '100%' }} />
            <strong>1,458 tok/s</strong>
          </div>
        </div>
      </div>
      <figcaption>
        Measured on my six-GPU setup after the CPU all-reduce fix. Decode speed
        was unchanged.
      </figcaption>
    </figure>
  )
}

const figures = {
  'property-platform': PropertyFigure,
  'workflow-migration': MigrationFigure,
  'realtime-platform': StreamFigure,
  'local-inference': InferenceFigure,
}
export default function ProjectFigure({ slug }) {
  const Figure = figures[slug]
  return Figure ? <Figure /> : null
}
