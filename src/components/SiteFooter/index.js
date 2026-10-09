import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="console-outside-footer">
      <p>Code, hardware, and bass music.</p>
      <div>
        <a href="https://github.com/DailyDisco">GitHub ↗</a>
        <a href="https://www.linkedin.com/in/developerdiego/">LinkedIn ↗</a>
        <a
          className="console-email-link"
          href="mailto:diegoespinowork@gmail.com"
        >
          <Mail size={14} aria-hidden="true" /> Email
        </a>
      </div>
      <Link to="/about">About me ↗</Link>
    </footer>
  )
}
