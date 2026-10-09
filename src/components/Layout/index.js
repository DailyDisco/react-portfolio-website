import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import SiteFooter from '../SiteFooter'
import pageMetadata from '../../data/pageMetadata.json'
const resumeUrl = `${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`

function updateMeta(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.content = content
}

function updatePageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const page = pageMetadata.pages[path]
  const { title, description } = page || pageMetadata.notFound
  const url = `${pageMetadata.siteUrl}${path}`
  const image = `${pageMetadata.siteUrl}${pageMetadata.image}`
  document.title = title
  updateMeta('name', 'description', description)
  updateMeta('name', 'robots', page ? 'index, follow' : 'noindex, follow')
  Object.entries({
    'og:type': 'website',
    'og:site_name': pageMetadata.siteName,
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': image,
    'og:image:alt': pageMetadata.imageAlt,
  }).forEach(([name, content]) => updateMeta('property', name, content))
  Object.entries({
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:image:alt': pageMetadata.imageAlt,
  }).forEach(([name, content]) => updateMeta('name', name, content))
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (page) {
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  } else {
    canonical?.remove()
  }
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
    updatePageMetadata(location.pathname)
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
      {location.pathname !== '/' && <SiteFooter />}
    </div>
  )
}
