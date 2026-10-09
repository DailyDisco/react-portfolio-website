import { Link } from 'react-router-dom'
import LabExplorer from '../LabExplorer'
export default function Infrastructure() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">INFRASTRUCTURE & OPEN SOURCE</p>
        <h1>My homelab and open-source work</h1>
        <p>
          I run local models for coding agents and maintain my own Linux
          services. Here’s the hardware, the homelab, and two upstream fixes
          that came from using them.
        </p>
      </header>
      <LabExplorer />
      <p className="infrastructure-case-link">
        <Link className="text-link" to="/work/local-inference">
          Read the inference engineering case study →
        </Link>
      </p>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTRIBUTIONS MERGED UPSTREAM</p>
            <h2>ExLlamaV3 and TabbyAPI</h2>
          </div>
          <p>Both fixes came from debugging my own inference server.</p>
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
            <h3>Release the old generator before replacing it</h3>
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
          <h2>Proxmox and self-hosted services</h2>
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
