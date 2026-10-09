import { Link } from 'react-router-dom'
export default function About() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">ABOUT DIEGO</p>
        <h1>About me</h1>
        <p>
          I’m a full-stack engineer and technical lead in Dallas-Fort Worth. I
          work across the application, its data, and the infrastructure that
          keeps it running.
        </p>
      </header>
      <div className="about-layout">
        <section className="about-story">
          <h2>My work</h2>
          <p>
            I run Lumara Technologies and work with teams at DFW Software
            Consulting and Craft Digital. My projects include Emmut’s property
            management platform, lead-intake and reporting systems for Joshua
            Tree Experts, and backend services for a confidential mixed reality
            product.
          </p>
          <p>
            I’ve led architecture and delivery with teams of four and five
            developers, while staying hands-on with frontend development, APIs,
            database design, and testing. I like decisions that are easy to
            explain and failure modes that are possible to debug.
          </p>
          <p>
            At home, I operate a multi-GPU inference server and Proxmox homelab.
            Debugging my inference setup led to fixes merged into ExLlamaV3 and
            TabbyAPI.
          </p>
          <p>
            Outside engineering, I produce bass music in Ableton, learn piano,
            and enjoy building things with hardware. I speak English and
            Spanish.
          </p>
          <div className="actions">
            <Link className="button" to="/contact">
              Contact me ↗
            </Link>
            <a
              className="text-link"
              href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
            >
              Read my resume ↓
            </a>
          </div>
        </section>
        <aside className="experience-panel">
          <p className="eyebrow">CURRENT ROLES</p>
          <div>
            <h3>DFW Software Consulting</h3>
            <p>Full Stack Engineer · Primary contract through Lumara</p>
            <span>March 2025 - Present</span>
          </div>
          <div>
            <h3>Craft Digital</h3>
            <p>Full Stack Engineer · Contract through Lumara</p>
            <span>July 2026 - Present</span>
          </div>
          <div>
            <h3>Lumara Technologies</h3>
            <p>Founder · Independent client engagements</p>
            <span>Founded 2025 · Consulting since 2022</span>
          </div>
          <div>
            <h3>Games For Love</h3>
            <p>Volunteer Full Stack Web Developer</p>
            <span>September 2025 - Present</span>
          </div>
        </aside>
      </div>
      <section className="section skills-section">
        <p className="eyebrow">TOOLS I WORK WITH</p>
        <div className="skill-groups">
          <div>
            <h3>Product & APIs</h3>
            <p>TypeScript, React, Next.js, Node.js, Go, Python, FastAPI</p>
          </div>
          <div>
            <h3>Data & workflows</h3>
            <p>PostgreSQL, Prisma, Redis, dbt, n8n</p>
          </div>
          <div>
            <h3>Cloud & delivery</h3>
            <p>AWS, Railway, Terraform, Docker, GitHub Actions, Linux</p>
          </div>
          <div>
            <h3>Quality & operations</h3>
            <p>Playwright, pytest, Vitest, Prometheus, Grafana</p>
          </div>
        </div>
        <p className="certification-line">
          AWS Certified Developer – Associate · AWS Certified Cloud Practitioner
        </p>
      </section>
    </div>
  )
}
