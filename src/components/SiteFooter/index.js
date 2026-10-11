import { Link } from 'react-router-dom'
import { ExternalLink, Mail, UserRound } from 'lucide-react'
import { TechIcon } from '../TechStack'

export default function SiteFooter() {
  return (
    <footer className="console-outside-footer">
      <p>Diego Espino · Full-stack engineer.</p>
      <div>
        <a href="https://github.com/DailyDisco">
          <TechIcon name="GitHub" size={17} /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/developerdiego/">
          <ExternalLink size={17} aria-hidden="true" /> LinkedIn
        </a>
        <a
          className="console-email-link"
          href="mailto:diegoespinowork@gmail.com"
        >
          <Mail size={17} aria-hidden="true" /> Email
        </a>
      </div>
      <Link to="/about">
        <UserRound size={17} aria-hidden="true" /> About me
      </Link>
    </footer>
  )
}
