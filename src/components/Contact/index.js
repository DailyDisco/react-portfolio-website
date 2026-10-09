import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const formReference = useRef(null)
  const submissionPending = useRef(false)
  const mounted = useRef(true)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const sendEmail = async (event) => {
    event.preventDefault()
    if (submissionPending.current) return

    const form = formReference.current
    for (const name of ['name', 'subject', 'message']) {
      const field = form.elements.namedItem(name)
      field.setCustomValidity(
        field.value.trim() ? '' : 'Please complete this field.'
      )
    }
    if (!form.reportValidity()) return

    submissionPending.current = true
    setStatus('sending')
    try {
      await emailjs.sendForm(
        'service_x9eyeta',
        'template_f4q0edh',
        form,
        'Gip3snFovpUWaqP6V'
      )
      if (mounted.current) {
        form.reset()
        setStatus('success')
      }
    } catch {
      if (mounted.current) setStatus('error')
    } finally {
      submissionPending.current = false
    }
  }

  const clearValidation = (event) => {
    event.target.setCustomValidity('')
  }
  const isSending = status === 'sending'

  return (
    <section className="page-shell contact-page" aria-labelledby="contact-heading">
      <header className="page-heading">
        <p className="eyebrow">Contact</p>
        <h1 id="contact-heading">Discuss a role or project.</h1>
        <p>
          I’m open to senior and lead full-stack engineering opportunities across
          product delivery, cloud infrastructure, and reliable systems.
        </p>
      </header>
      <div className="contact-grid">
        <div className="contact-details">
          <h2>Start a conversation</h2>
          <p>
            Based in Dallas-Fort Worth. Available for remote work and local
            collaboration. I work in English and Spanish.
          </p>
          <p>
            <a href="mailto:diegoespinowork@gmail.com">diegoespinowork@gmail.com</a>
          </p>
          <div className="field-row">
            <a
              className="button button-secondary"
              href="https://www.linkedin.com/in/developerdiego/"
            >
              LinkedIn
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/DailyDisco"
            >
              GitHub
            </a>
          </div>
        </div>
        <form
          ref={formReference}
          className="contact-form"
          aria-label="Contact Diego"
          aria-busy={isSending}
          onSubmit={sendEmail}
        >
          <div className="field-row">
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                readOnly={isSending}
                onInput={clearValidation}
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                readOnly={isSending}
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              readOnly={isSending}
              onInput={clearValidation}
            />
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="7"
              required
              readOnly={isSending}
              onInput={clearValidation}
            />
          </div>
          <button className="button" type="submit" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send message'}
          </button>
          <div role="status" aria-live="polite">
            {status === 'success' && (
              <p className="status-panel">
                Your message was sent. Thanks for reaching out.
              </p>
            )}
          </div>
          {status === 'error' && (
            <p className="status-panel error" role="alert">
              Your message could not be sent. Your details are still here. Try
              again, or email me directly.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contact
