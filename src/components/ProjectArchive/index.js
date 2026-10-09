import projects from '../../data/projects.json'
import { getSafeWebUrl } from '../../lib/projectLinks'
import ProjectImage from './ProjectImage'

const ProjectArchive = ({ title = 'More things I’ve built' }) => (
  <section className="project-archive" aria-label={title}>
    <p className="eyebrow">Project archive</p>
    <h2>{title}</h2>
    <p>Earlier projects and experiments from my portfolio.</p>

    {projects.length === 0 ? (
      <p className="status-panel">There are no archived projects to show yet.</p>
    ) : (
      <div className="archive-grid">
        {projects.map((project) => {
          const projectUrl = getSafeWebUrl(project.url)
          const imageUrl =
            typeof project.image === 'string' &&
            project.image.startsWith('/portfolio/')
              ? project.image
              : null

          return (
            <article
              className={`archive-card${imageUrl ? '' : ' archive-card-text'}`}
              key={project.id}
            >
              <ProjectImage name={project.name} imageUrl={imageUrl} />
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              {projectUrl ? (
                <a
                  className="text-link"
                  href={projectUrl}
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
          )
        })}
      </div>
    )}
  </section>
)

export default ProjectArchive
