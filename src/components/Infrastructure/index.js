import { Link } from 'react-router-dom'
export function StackDiagram() {
  return (
    <div
      className="stack-diagram"
      aria-label="The full stack: React, TypeScript, and Next.js product interfaces; Go, Python, and PostgreSQL services; AWS, Linux, and GPU infrastructure. Architecture, delivery, and operations."
      role="img"
    >
      <div className="diagram-topline">
        <span className="mono">THE FULL STACK</span>
        <span className="diagram-dot" />
      </div>
      {[
        {
          name: 'The experience',
          layer: '01 / PRODUCT',
          tags: 'React · TypeScript · Next.js',
          symbol: '◫',
        },
        {
          name: 'The engine',
          layer: '02 / SERVICES',
          tags: 'Go · Python · PostgreSQL',
          symbol: '⌘',
        },
        {
          name: 'The foundation',
          layer: '03 / INFRASTRUCTURE',
          tags: 'AWS · Linux · GPU compute',
          symbol: '▥',
        },
      ].map((item) => (
        <div className="stack-layer" key={item.layer}>
          <span className="stack-symbol" aria-hidden="true">
            {item.symbol}
          </span>
          <div>
            <span className="mono">{item.layer}</span>
            <strong>{item.name}</strong>
            <small>{item.tags}</small>
          </div>
          <span className="layer-corner" aria-hidden="true">
            ↗
          </span>
        </div>
      ))}
      <div className="diagram-bottomline">
        <span>Architecture</span>
        <span>Delivery</span>
        <span>Operations</span>
      </div>
    </div>
  )
}
export function GpuRack() {
  return (
    <figure className="gpu-figure">
      <div
        className="gpu-rack"
        aria-label="Diagram of six NVIDIA RTX 3090 graphics cards"
        role="img"
      >
        <div className="rack-header">
          <span className="mono">LOCAL INFERENCE / 6 × RTX 3090</span>
          <span className="rack-lights" aria-hidden="true">
            •••
          </span>
        </div>
        {Array.from({ length: 6 }, (_, index) => (
          <div className="gpu-unit" key={index}>
            <span className="mono">GPU / 0{index + 1}</span>
            <span className="gpu-vents" aria-hidden="true" />
            <span>24 GB</span>
            <span className="gpu-led" aria-hidden="true" />
          </div>
        ))}
        <div className="rack-footer">
          <strong>
            144 <span>GB VRAM</span>
          </strong>
          <span className="mono">EXLLAMAV3 + TABBYAPI</span>
        </div>
      </div>
      <figcaption>
        System illustration · Six GPUs, one hands-on learning loop.
      </figcaption>
    </figure>
  )
}
export default function Infrastructure() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">INFRASTRUCTURE & OPEN SOURCE</p>
        <h1>
          Beyond the app.
          <br />
          <em>Into the system.</em>
        </h1>
        <p>
          Building the software is part of the work. Understanding how it runs,
          fails, and recovers is the rest.
        </p>
      </header>
      <section className="infrastructure-feature">
        <GpuRack />
        <div>
          <p className="eyebrow">THE INFERENCE SERVER</p>
          <h2>
            Six GPUs.
            <br />
            Useful constraints.
          </h2>
          <p>
            I built and operate a six-RTX-3090 inference server with 144 GB of
            combined GPU memory. It serves local models to coding agents through
            ExLlamaV3, TabbyAPI, and an OpenAI-compatible gateway.
          </p>
          <p>
            Tuning the system led me into CPU all-reduce performance and Python
            object lifetimes, and to two fixes merged upstream.
          </p>
          <Link className="text-link" to="/work/local-inference">
            Read the engineering case study ↗
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTRIBUTIONS MERGED UPSTREAM</p>
            <h2>Measure. Trace. Contribute.</h2>
          </div>
          <p>
            Small, specific changes backed by benchmarks and regression tests.
          </p>
        </div>
        <div className="contribution-grid">
          <article>
            <span className="contribution-number">
              +18<span>%</span>
            </span>
            <p className="eyebrow">EXLLAMAV3 / C++</p>
            <h3>Faster cold prompt processing</h3>
            <p>
              Multithreaded AVX2 CPU all-reduce increased throughput from 1,238
              to 1,458 tokens/second in my six-GPU benchmark. Decode speed was
              unchanged.
            </p>
            <a
              className="text-link"
              href="https://github.com/turboderp-org/exllamav3/pull/447"
            >
              Merged pull request #447 ↗
            </a>
          </article>
          <article>
            <span className="contribution-number contribution-word">
              Release → replace
            </span>
            <p className="eyebrow">TABBYAPI / PYTHON</p>
            <h3>More predictable error recovery</h3>
            <p>
              Release the previous generator before allocating its replacement,
              preventing overlapping main-process host caches during recovery.
              Covered by an object-release regression test.
            </p>
            <a
              className="text-link"
              href="https://github.com/theroyallab/tabbyAPI/pull/493"
            >
              Merged pull request #493 ↗
            </a>
          </article>
        </div>
      </section>
      <section className="homelab-section">
        <div>
          <p className="eyebrow">THE HOMELAB</p>
          <h2>
            Infrastructure
            <br />I live with.
          </h2>
          <p>
            Proxmox virtual machines and a dozen self-hosted services give me a
            practical place to work through provisioning, networking,
            observability, and recovery.
          </p>
        </div>
        <dl className="system-list">
          <div>
            <dt>Compute</dt>
            <dd>Proxmox · Linux · GPU workloads</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>Docker Compose · Automated provisioning</dd>
          </div>
          <div>
            <dt>Networking</dt>
            <dd>Tailscale · Caddy · Cloudflare Tunnels</dd>
          </div>
          <div>
            <dt>Operations</dt>
            <dd>Metrics · Logs · Backup and restore validation</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
