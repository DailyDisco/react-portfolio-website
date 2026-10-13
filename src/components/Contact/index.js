import PageSurface from '../PageSurface'
import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { ArrowDown, ArrowUpRight, Check, Copy, Send } from 'lucide-react'
import './style.css'

const Contact = () => {
  const formReference = useRef(null)
  const submissionPending = useRef(false)
  const mounted = useRef(true)
  const [status, setStatus] = useState('idle')
  const [copyStatus, setCopyStatus] = useState('idle')

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
    for (const name of ['name', 'message']) {
      const field = form.elements.namedItem(name)
      field.setCustomValidity(
        field.value.trim() ? '' : 'Please complete this field.'
      )
    }
    if (!form.reportValidity()) return

    submissionPending.current = true
    setStatus('sending')
    const subject = form.elements.namedItem('subject')
    const originalSubject = subject.value
    if (!originalSubject.trim()) subject.value = 'Engineering opportunity'
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
      if (mounted.current) {
        subject.value = originalSubject
        setStatus('error')
      }
    } finally {
      submissionPending.current = false
    }
  }

  const copyEmail = async () => {
    setCopyStatus('copying')
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText('diegoespinowork@gmail.com')
      if (mounted.current) setCopyStatus('success')
    } catch {
      if (mounted.current) setCopyStatus('error')
    }
  }

  const clearValidation = (event) => {
    event.target.setCustomValidity('')
  }
  const isSending = status === 'sending'

  return (
    <PageSurface
      as="section"
      className="page-shell contact-page"
      aria-labelledby="contact-heading"
    >
      <header className="page-heading">
        <p className="eyebrow">Contact</p>
        <h1 id="contact-heading">Let’s talk.</h1>
        <p>
          Open to senior and lead full-stack roles. Tell me about your team, the
          product, and where you need ownership.
        </p>
      </header>
      <div className="contact-grid">
        <div className="contact-details">
          <h2>Email me directly</h2>
          <p className="contact-email">
            <a href="mailto:diegoespinowork@gmail.com">
              diegoespinowork
              <wbr />
              @gmail.com
            </a>
          </p>
          <div className="contact-quick-actions">
            <button
              className="text-link"
              type="button"
              onClick={copyEmail}
              disabled={copyStatus === 'copying'}
            >
              {copyStatus === 'success' ? (
                <Check size={17} aria-hidden="true" />
              ) : (
                <Copy size={17} aria-hidden="true" />
              )}
              Copy email
            </button>
            <a
              className="text-link"
              href={`${process.env.PUBLIC_URL || ''}/resume/Diego_Espino_Resume.pdf`}
            >
              <ArrowDown size={17} aria-hidden="true" /> Read my resume
            </a>
          </div>
          <p
            className="copy-feedback"
            role="status"
            aria-label="Copy email status"
          >
            {copyStatus === 'success' && 'Email copied.'}
            {copyStatus === 'error' &&
              'Couldn’t copy automatically. Select and copy the email address above.'}
          </p>
          <p>
            Based in Dallas-Fort Worth. Available for remote work and local
            collaboration. I work in English and Spanish.
          </p>
          <div className="contact-social-links">
            <a
              className="button button-secondary"
              href="https://www.linkedin.com/in/developerdiego/"
            >
              LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/DailyDisco"
            >
              GitHub <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <form
          ref={formReference}
          className="contact-form"
          aria-label="Contact Diego"
          aria-describedby="contact-form-note"
          aria-busy={isSending}
          onSubmit={sendEmail}
        >
          <div className="contact-form-heading">
            <h2>Send a message</h2>
            <p id="contact-form-note">Name, email, and message are required.</p>
          </div>
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
            <label htmlFor="contact-subject">
              Subject <span className="optional-label">(optional)</span>
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              readOnly={isSending}
              onInput={clearValidation}
            />
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="4"
              required
              readOnly={isSending}
              onInput={clearValidation}
            />
          </div>
          <button className="button" type="submit" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send message'}
            <Send size={18} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <div role="status" aria-label="Message status" aria-live="polite">
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
    </PageSurface>
  )
}

export default Contact
