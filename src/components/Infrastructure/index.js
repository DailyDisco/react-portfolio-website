import PageSurface from '../PageSurface'
import NextChapter from '../NextChapter'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Bot,
  Check,
  Cpu,
  GitPullRequest,
  Laptop,
  Network,
  Plug,
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
          <p className="eyebrow">HOMELAB, AGENTS & OPEN SOURCE</p>
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
        <div className="infrastructure-case-link">
          <p>
            <strong>Under upstream review</strong> · Open as of October 13, 2026
          </p>
          <p>
            <a
              className="text-link"
              href="https://github.com/mw00/project-maya/pull/138"
            >
              Maya: prompt pipelining #138
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            {' · '}
            <a
              className="text-link"
              href="https://github.com/mw00/project-maya/pull/144"
            >
              Maya: resumable reads #144
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            {' · '}
            <a
              className="text-link"
              href="https://github.com/NousResearch/hermes-agent/pull/136021"
            >
              Hermes: bounded cleanup #136021
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>
      <section
        id="agents"
        tabIndex={-1}
        className="page-panel agent-systems"
        aria-labelledby="agent-systems-heading"
      >
        <div className="agent-systems-intro">
          <div>
            <p className="eyebrow">AGENT ENVIRONMENTS & INTEGRATIONS</p>
            <h2 id="agent-systems-heading">Give the agent the right tools.</h2>
          </div>
          <p>
            I set up Hermes, connect agents to local models and MCP servers, and
            verify that the tools work in a real session.
          </p>
        </div>
        <div className="agent-capabilities">
          <article>
            <Bot size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>Hermes & agent setup</h3>
            <p>
              Profiles, model routing, and tool access for development and
              operations, with local inference where the workflow calls for it.
            </p>
          </article>
          <article>
            <Plug size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>MCP integrations</h3>
            <p>
              Connect tools through Model Context Protocol, check their input
              schemas, and test actual calls. Build read-only connectors with
              explicit access boundaries.
            </p>
          </article>
          <article>
            <Laptop size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>Consistent across machines</h3>
            <p>
              Automated agent setup across eight Linux, macOS, and Windows
              machines. Preserve credentials and custom configuration, with
              backups and rollback for configuration changes.
            </p>
          </article>
        </div>
        <div className="agent-verification">
          <Check size={20} aria-hidden="true" />
          <p>
            <strong>One working example:</strong> connected REA’s analysis tools
            to Hermes over MCP and ran JavaScript analysis against a disposable
            test fixture.
          </p>
        </div>
        <div className="actions">
          <a
            className="text-link"
            href="https://github.com/DailyDisco/claude-code-setup"
          >
            Inspect my development workflows and build/test hooks
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <Link className="text-link" to="/contact">
            Talk about agent infrastructure
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
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
