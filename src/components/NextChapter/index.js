import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './style.css'

export default function NextChapter({ to, title, description }) {
  return (
    <Link className="next-chapter" to={to}>
      <div>
        <span className="next-chapter-label">Up next</span>
        <span className="next-chapter-title">{title}</span>
      </div>
      <p>{description}</p>
      <span className="next-chapter-arrow" aria-hidden="true">
        <ArrowRight size={24} strokeWidth={1.6} />
      </span>
    </Link>
  )
}
