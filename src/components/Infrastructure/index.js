import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Cpu,
  GitPullRequest,
  Network,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import LabExplorer from '../LabExplorer'
import TechStack, { TechIcon } from '../TechStack'
import './style.css'

export default function Infrastructure() {
  return (
    <PageSurface className="page-shell infrastructure-page segmented-page">
      <section className="page-panel page-panel-primary">
        <header className="page-heading">
          <p className="eyebrow">HOMELAB & OPEN SOURCE</p>
          <h1>Under the hood.</h1>
          <p>
            I built a local inference server, now expanded to seven GPUs.
            Operating it led to fixes merged into ExLlamaV3 and TabbyAPI.
          </p>
        </header>
        <LabExplorer />
        <p className="infrastructure-case-link">
          <Link className="text-link" to="/work/local-inference">
            Read the inference case study{' '}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </p>
      </section>
      <section
        className="page-panel infrastructure-contributions"
        aria-labelledby="upstream-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">MERGED UPSTREAM</p>
            <h2 id="upstream-heading">Fixes from running the stack.</h2>
          </div>
        </div>
        <div className="contribution-grid">
          <article>
            <div
              className="contribution-readout"
              aria-label="18 percent faster cold prompt processing"
            >
              <span className="contribution-number">
                +18<span>%</span>
              </span>
              <span>cold prompt throughput</span>
            </div>
            <p className="eyebrow contribution-technology">
              <TechIcon name="C++" /> EXLLAMAV3 · C++
            </p>
            <h3>Faster cold prompts</h3>
            <p>
              Multithreaded AVX2 CPU all-reduce raised throughput from 1,238 to
              1,458 tokens/second in my six-GPU benchmark. Decode speed was
              unchanged.
            </p>
            <a
              className="text-link"
              href="https://github.com/turboderp-org/exllamav3/pull/447"
            >
              <GitPullRequest size={17} aria-hidden="true" />
              Merged PR #447 <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </article>
          <article>
            <div
              className="contribution-readout contribution-sequence"
              aria-hidden="true"
            >
              <span>Release</span>
              <ArrowRight size={27} />
              <span>Replace</span>
            </div>
            <p className="eyebrow contribution-technology">
              <TechIcon name="Python" /> TABBYAPI · PYTHON
            </p>
            <h3>Safer generator recovery</h3>
            <p>
              Release the old generator before allocating its replacement to
              prevent overlapping main-process host caches. Covered by an
              object-release regression test.
            </p>
            <a
              className="text-link"
              href="https://github.com/theroyallab/tabbyAPI/pull/493"
            >
              <GitPullRequest size={17} aria-hidden="true" />
              Merged PR #493 <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </article>
        </div>
      </section>
      <section
        className="page-panel homelab-section"
        aria-labelledby="homelab-operations-heading"
      >
        <div>
          <p className="eyebrow">DAY-TO-DAY OPERATIONS</p>
          <h2 id="homelab-operations-heading">
            A dozen services. My responsibility.
          </h2>
          <p>
            Proxmox VMs and self-hosted services give me a practical place to
            work through provisioning, networking, observability, and recovery.
          </p>
        </div>
        <dl className="system-list">
          <div>
            <dt>
              <Cpu size={17} aria-hidden="true" /> Compute
            </dt>
            <dd>
              <TechStack
                items={['Proxmox', 'Linux']}
                label="Compute technologies"
              />
              <span className="system-detail">GPU workloads</span>
            </dd>
          </div>
          <div>
            <dt>
              <Boxes size={17} aria-hidden="true" /> Delivery
            </dt>
            <dd>
              <TechStack
                items={['Docker Compose']}
                label="Delivery technologies"
              />
              <span className="system-detail">Automated provisioning</span>
            </dd>
          </div>
          <div>
            <dt>
              <Network size={17} aria-hidden="true" /> Networking
            </dt>
            <dd>
              <TechStack
                items={['Tailscale', 'Caddy', 'Cloudflare Tunnels']}
                label="Networking technologies"
              />
            </dd>
          </div>
          <div>
            <dt>
              <Activity size={17} aria-hidden="true" /> Operations
            </dt>
            <dd>Metrics · Logs · Backup and restore validation</dd>
          </div>
        </dl>
      </section>
      <NextChapter
        to="/about"
        title="Meet the engineer"
        description="How I work, what I care about, and what I build away from the screen."
      />
    </PageSurface>
  )
}
