import { useEffect, useRef, useState } from 'react'
import { auth, storage, db } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'

const Home = () => {
  const formReference = useRef(null)
  const operationPending = useRef(false)
  const mounted = useRef(true)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const submitPortfolio = async (event) => {
    event.preventDefault()
    if (operationPending.current) return

    const form = formReference.current
    const nameField = form.elements.namedItem('name')
    const descriptionField = form.elements.namedItem('description')
    const urlField = form.elements.namedItem('url')
    const imageField = form.elements.namedItem('image')
    const name = nameField.value.trim()
    const description = descriptionField.value.trim()
    const url = urlField.value.trim()
    const image = imageField.files[0]

    nameField.setCustomValidity(name ? '' : 'Enter a project name.')
    descriptionField.setCustomValidity(
      description ? '' : 'Enter a project description.'
    )
    let validUrl = false
    try {
      const parsedUrl = new URL(url)
      validUrl =
        /^https:\/\//i.test(url) &&
        parsedUrl.protocol === 'https:' &&
        !parsedUrl.username &&
        !parsedUrl.password
    } catch {
      validUrl = false
    }
    urlField.setCustomValidity(
      validUrl ? '' : 'Enter a complete HTTPS URL without embedded credentials.'
    )
    imageField.setCustomValidity(
      !image || image.type.startsWith('image/') ? '' : 'Choose an image file.'
    )
    if (!form.reportValidity()) return

    operationPending.current = true
    setStatus({ type: 'saving', message: 'Saving project…' })
    let stage = 'image'
    try {
      let imageUrl = null
      if (image) {
        const safeFilename = image.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const storageReference = ref(
          storage,
          `portfolio/${crypto.randomUUID()}-${safeFilename}`
        )
        const snapshot = await uploadBytes(storageReference, image)
        imageUrl = await getDownloadURL(snapshot.ref)
      }
      stage = 'project'
      await addDoc(collection(db, 'portfolio'), {
        name,
        description,
        url,
        image: imageUrl,
      })
      if (mounted.current) {
        form.reset()
        setStatus({ type: 'success', message: 'Project saved.' })
      }
    } catch {
      if (mounted.current) {
        setStatus({
          type: 'error',
          message:
            stage === 'image'
              ? 'The image could not be uploaded. The project was not saved. Your details are still here; try again.'
              : 'The project could not be saved. Your details are still here; try again.',
        })
      }
    } finally {
      operationPending.current = false
    }
  }

  const signOut = async () => {
    if (operationPending.current) return
    operationPending.current = true
    setStatus({ type: 'signing-out', message: 'Signing out…' })
    try {
      await auth.signOut()
      if (mounted.current) setStatus({ type: 'idle', message: '' })
    } catch {
      if (mounted.current) {
        setStatus({
          type: 'error',
          message: 'You could not be signed out. Try again.',
        })
      }
    } finally {
      operationPending.current = false
    }
  }

  const clearValidation = (event) => event.target.setCustomValidity('')
  const isBusy = status.type === 'saving' || status.type === 'signing-out'

  return (
    <section className="page-shell" aria-labelledby="dashboard-heading">
      <header className="page-heading">
        <p className="eyebrow">Portfolio management</p>
        <h1 id="dashboard-heading">Add a project</h1>
        <p>Add a name, description, and HTTPS link. A project image is optional.</p>
      </header>
      <form
        ref={formReference}
        className="contact-form"
        aria-label="Add a portfolio project"
        aria-busy={isBusy}
        onSubmit={submitPortfolio}
      >
        <div className="form-field">
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            name="name"
            type="text"
            required
            readOnly={isBusy}
            onInput={clearValidation}
          />
        </div>
        <div className="form-field">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            name="description"
            rows="5"
            required
            readOnly={isBusy}
            onInput={clearValidation}
          />
        </div>
        <div className="form-field">
          <label htmlFor="project-url">Project URL</label>
          <input
            id="project-url"
            name="url"
            type="url"
            placeholder="https://example.com"
            required
            readOnly={isBusy}
            onInput={clearValidation}
          />
        </div>
        <div className="form-field">
          <label htmlFor="project-image">Project image (optional)</label>
          <input
            id="project-image"
            name="image"
            type="file"
            accept="image/*"
            disabled={isBusy}
            onChange={clearValidation}
          />
        </div>
        <div className="field-row">
          <button className="button" type="submit" disabled={isBusy}>
            {status.type === 'saving' ? 'Saving…' : 'Save project'}
          </button>
          <button
            className="button button-secondary"
            type="button"
            disabled={isBusy}
            onClick={signOut}
          >
            {status.type === 'signing-out' ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
        {status.type === 'error' ? (
          <p className="status-panel error" role="alert">
            {status.message}
          </p>
        ) : (
          <div role="status" aria-live="polite">
            {status.message && <p className="status-panel">{status.message}</p>}
          </div>
        )}
      </form>
    </section>
  )
}

export default Home
