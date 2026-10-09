import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <section className="page-shell page-heading">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        That page
        <br />
        isn’t here.
      </h1>
      <p>
        You can find my current projects and engineering case studies in
        Selected Work.
      </p>
      <Link className="button" to="/portfolio">
        View selected work →
      </Link>
    </section>
  )
}
