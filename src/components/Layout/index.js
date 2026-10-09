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
          <NavLink to="/portfolio">Work</NavLink>
          <NavLink to="/infrastructure">Homelab</NavLink>
          <NavLink to="/about">About</NavLink>
          <a href={resumeUrl} target="_blank" rel="noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
          <NavLink className="nav-contact" to="/contact">
            Contact
          </NavLink>
        </nav>
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
