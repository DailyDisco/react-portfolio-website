import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
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
    <div
      className={`site${location.pathname === '/' ? ' site-home' : ''}`}
      onKeyDown={closeOnEscape}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Diego Espino home">
          <span className="brand-mark" aria-hidden="true">
            <svg
              viewBox="60 20 175 180"
              width="36"
              height="38"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M75 28H125C182 28 211 60 211 110S182 192 125 192H75V28ZM110 63V157H126C158 157 175 141 175 110S158 63 126 63H110Z"
              />
              <path d="M220 144h8v46h-8z" fill="#b79936" />
            </svg>
          </span>
          <span>Diego Espino</span>
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
          {menuOpen ? (
            <X size={18} aria-hidden="true" />
          ) : (
            <Menu size={18} aria-hidden="true" />
          )}
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
            Resume <ArrowUpRight size={13} aria-hidden="true" />
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
      {location.pathname !== '/' && (
        <footer className="site-footer">
          <div className="footer-bottom">
            <div>
              <Link className="footer-name" to="/">
                Diego Espino<span>.</span>
              </Link>
              <p>Engineer, music producer, hardware tinkerer.</p>
            </div>
            <div className="footer-links">
              <a href="https://github.com/DailyDisco">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/developerdiego/">
                LinkedIn ↗
              </a>
              <a href="mailto:diegoespinowork@gmail.com">Email ↗</a>
            </div>
            <p className="footer-location">
              Dallas-Fort Worth, Texas
              <br />
              English & Spanish
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}
