import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { getSafeWebUrl } from '../../lib/projectLinks'
import ProjectImage from './ProjectImage'

const REQUEST_TIMEOUT_MS = 15000

const ProjectArchive = ({ title = 'More things I’ve built' }) => {
  const [requestVersion, setRequestVersion] = useState(0)
  const [request, setRequest] = useState({ status: 'loading', projects: [] })

  useEffect(() => {
    let active = true
    setRequest({ status: 'loading', projects: [] })

    const timeout = setTimeout(() => {
      if (active) {
        active = false
        setRequest({ status: 'error', projects: [] })
      }
    }, REQUEST_TIMEOUT_MS)

    const loadProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'portfolio'))
        const projects = snapshot.docs.map((document) => {
          const data = document.data() || {}
          return {
            id: document.id,
            name:
              typeof data.name === 'string' && data.name.trim()
                ? data.name.trim()
                : 'Untitled project',
            description:
              typeof data.description === 'string' ? data.description.trim() : '',
            url: getSafeWebUrl(data.url),
            imageUrl: getSafeWebUrl(data.image),
          }
        })

        if (active) {
          clearTimeout(timeout)
          setRequest({ status: 'ready', projects })
        }
      } catch {
        if (active) {
          clearTimeout(timeout)
          setRequest({ status: 'error', projects: [] })
        }
      }
    }

    loadProjects()
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [requestVersion])

  return (
    <section className="project-archive" aria-label={title}>
      <p className="eyebrow">Project archive</p>
      <h2>{title}</h2>
      <p>Earlier projects and experiments from my portfolio.</p>

      {request.status === 'loading' && (
        <div className="status-panel" role="status">
          Loading earlier projects…
        </div>
      )}

      {request.status === 'error' && (
        <div className="status-panel" role="alert">
          <p>The project archive couldn’t load. Please try again.</p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setRequestVersion((version) => version + 1)}
          >
            Retry loading projects
          </button>
        </div>
      )}

      {request.status === 'ready' && request.projects.length === 0 && (
        <div className="status-panel" role="status">
          There are no archived projects to show yet.
        </div>
      )}

      {request.status === 'ready' && request.projects.length > 0 && (
        <div className="archive-grid">
          {request.projects.map((project) => (
            <article className="archive-card" key={project.id}>
              <ProjectImage name={project.name} imageUrl={project.imageUrl} />
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              {project.url ? (
                <a
                  className="text-link"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} (opens in a new tab)`}
                >
                  View {project.name} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <p>Project link unavailable.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectArchive
