import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { getCaseStudy } from '../../data/caseStudies'
const resumeUrl = `${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`
const titles = {
  '/': 'Diego Espino | Full Stack Engineer & Technical Lead',
  '/portfolio': 'Selected Work | Diego Espino',
  '/infrastructure': 'Infrastructure & Open Source | Diego Espino',
  '/about': 'About Diego Espino',
  '/contact': 'Contact Diego Espino',
}
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const menuButton = useRef(null)
  const main = useRef(null)
  const previousPath = useRef(location.pathname)
  const workActive =
    location.pathname === '/portfolio' ||
    location.pathname === '/blog' ||
    location.pathname.startsWith('/work/')
  useEffect(() => {
    setMenuOpen(false)
    const study = getCaseStudy(location.pathname.split('/work/')[1])
    document.title = study
      ? `${study.title} | Diego Espino`
      : titles[location.pathname] || 'Diego Espino | Full Stack Engineer'
    const description = document.querySelector('meta[name="description"]')
    if (description)
      description.content =
        study?.summary ||
        'Full-stack engineer and technical lead building web products, cloud migrations, and GPU infrastructure. Based in Dallas-Fort Worth.'
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView()
      )
    else if (previousPath.current !== location.pathname) {
      window.scrollTo(0, 0)
      main.current?.focus({ preventScroll: true })
    }
    previousPath.current = location.pathname
  }, [location.pathname, location.hash])
  function closeOnEscape(event) {
    if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }
  return (
    <div className="site" onKeyDown={closeOnEscape}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Diego Espino home">
          <span className="brand-mark" aria-hidden="true">
            de<span>.</span>
          </span>
          <span>
            Diego Espino
            <span className="brand-caption">FULL STACK ENGINEER</span>
          </span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          ref={menuButton}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close' : 'Menu'}
          <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
        </button>
        <nav
          id="primary-navigation"
          className={`primary-navigation ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          <Link
            className={workActive ? 'active' : undefined}
            aria-current={workActive ? 'location' : undefined}
            to="/portfolio"
          >
            Work
          </Link>
          <NavLink to="/infrastructure">Homelab</NavLink>
          <NavLink to="/about">About</NavLink>
          <a href={resumeUrl} target="_blank" rel="noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
          <NavLink className="nav-contact" to="/contact">
            Contact
          </NavLink>
        </nav>
        <a
          className="rail-social"
          href="https://github.com/DailyDisco"
          aria-label="Diego on GitHub"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 7 3 12l5 5m8-10 5 5-5 5M14 4l-4 16" />
          </svg>
          GitHub
        </a>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        <Suspense
          fallback={
            <div className="page-shell status-panel" role="status">
              Loading page…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="site-footer">
        <div>
          <Link className="footer-name" to="/">
            Diego Espino<span>.</span>
          </Link>
          <p>Engineer, music producer, hardware tinkerer.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/DailyDisco">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/developerdiego/">LinkedIn ↗</a>
          <a href="mailto:diegoespinowork@gmail.com">Email ↗</a>
        </div>
        <p className="footer-location">
          Dallas-Fort Worth, Texas
          <br />
          English & Spanish
        </p>
      </footer>
    </div>
  )
}
