import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Expand, Maximize, X, ZoomIn, ZoomOut } from 'lucide-react'
import './style.css'

let nextImageId = 0

export default function ProjectImageViewer({
  src,
  alt,
  title,
  caption,
  width,
  height,
  loading,
}) {
  const [open, setOpen] = useState(false)
  const [scale, setScale] = useState(null)
  const [fitScale, setFitScale] = useState(1)
  const [fallback, setFallback] = useState(false)
  const [imageId] = useState(() => `project-image-${++nextImageId}`)
  const opener = useRef(null)
  const overlay = useRef(null)
  const dialog = useRef(null)
  const closeButton = useRef(null)
  const viewport = useRef(null)
  const zoomCenter = useRef(null)
  const backdropPress = useRef(false)
  const actualScale = scale ?? fitScale

  const close = () => setOpen(false)

  const reset = () => {
    zoomCenter.current = null
    setScale(null)
    if (viewport.current) {
      viewport.current.scrollLeft = 0
      viewport.current.scrollTop = 0
    }
  }

  const zoom = (nextScale) => {
    const surface = viewport.current
    if (surface) {
      zoomCenter.current = {
        x: (surface.scrollLeft + surface.clientWidth / 2) / actualScale,
        y: (surface.scrollTop + surface.clientHeight / 2) / actualScale,
      }
    }
    if (nextScale < fitScale) reset()
    else setScale(Math.min(4, nextScale))
  }

  useLayoutEffect(() => {
    const surface = viewport.current
    const center = zoomCenter.current
    if (!surface || !center) return
    surface.scrollLeft = center.x * actualScale - surface.clientWidth / 2
    surface.scrollTop = center.y * actualScale - surface.clientHeight / 2
    zoomCenter.current = null
  }, [actualScale])

  useLayoutEffect(() => {
    if (!open) return undefined
    const modal = dialog.current
    const trigger = opener.current
    const surface = viewport.current
    const body = modal.ownerDocument.body
    const view = modal.ownerDocument.defaultView
    const previousOverflow = body.style.overflow
    const useFallback = typeof modal.showModal !== 'function'
    const background = useFallback
      ? Array.from(body.children)
          .filter((element) => element !== overlay.current)
          .map((element) => ({
            element,
            inert: element.getAttribute('inert'),
            hidden: element.getAttribute('aria-hidden'),
          }))
      : []

    setFallback(useFallback)
    if (useFallback) modal.setAttribute('open', '')
    else modal.showModal()
    closeButton.current.focus({ preventScroll: true })
    background.forEach(({ element }) => {
      element.setAttribute('inert', '')
      element.setAttribute('aria-hidden', 'true')
    })
    body.style.overflow = 'hidden'

    const measure = () => {
      if (surface.clientWidth <= 32 || surface.clientHeight <= 32) return
      setFitScale(
        Math.min(
          1,
          (surface.clientWidth - 32) / width,
          (surface.clientHeight - 32) / height
        )
      )
    }
    const keepFocusInside = (event) => {
      if (useFallback && !modal.contains(event.target)) {
        closeButton.current?.focus({ preventScroll: true })
      }
    }
    measure()
    const observer =
      typeof view.ResizeObserver === 'function'
        ? new view.ResizeObserver(measure)
        : null
    observer?.observe(surface)
    view.addEventListener('resize', measure)
    modal.ownerDocument.addEventListener('focusin', keepFocusInside)

    return () => {
      observer?.disconnect()
      view.removeEventListener('resize', measure)
      modal.ownerDocument.removeEventListener('focusin', keepFocusInside)
      if (!useFallback && modal.open) modal.close()
      background.forEach(({ element, inert, hidden }) => {
        if (inert === null) element.removeAttribute('inert')
        else element.setAttribute('inert', inert)
        if (hidden === null) element.removeAttribute('aria-hidden')
        else element.setAttribute('aria-hidden', hidden)
      })
      body.style.overflow = previousOverflow
      if (trigger?.isConnected) {
        trigger.focus({ preventScroll: true })
      }
    }
  }, [open, width, height])

  const handleKeys = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }
    if (event.key === 'Tab') {
      const controls = Array.from(
        dialog.current.querySelectorAll('button:not(:disabled), [tabindex="0"]')
      )
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && event.target === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && event.target === last) {
        event.preventDefault()
        first.focus()
      }
      return
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      zoom(actualScale * 1.5)
    } else if (event.key === '-') {
      event.preventDefault()
      zoom(actualScale / 1.5)
    } else if (event.key === '0') {
      event.preventDefault()
      reset()
    } else if (event.key === '1') {
      event.preventDefault()
      zoom(1)
    } else if (event.target === viewport.current) {
      const directions = {
        ArrowLeft: [-100, 0],
        ArrowRight: [100, 0],
        ArrowUp: [0, -100],
        ArrowDown: [0, 100],
      }
      const direction = directions[event.key]
      if (direction) {
        event.preventDefault()
        viewport.current.scrollLeft += direction[0]
        viewport.current.scrollTop += direction[1]
      }
    }
  }

  const isBackdrop = (event) => {
    if (event.target === overlay.current) return true
    if (event.target !== dialog.current) return false
    const bounds = dialog.current.getBoundingClientRect()
    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
  }

  return (
    <>
      <button
        ref={opener}
        className="project-image-trigger"
        type="button"
        aria-label={`Enlarge ${title}`}
        aria-haspopup="dialog"
        aria-controls={open ? imageId : undefined}
        onClick={() => {
          setScale(null)
          setOpen(true)
        }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
        />
        <span>
          <Expand size={17} aria-hidden="true" /> {title} · View full size
        </span>
      </button>
      {open &&
        createPortal(
          <div
            ref={overlay}
            className={`project-image-overlay${fallback ? ' is-fallback' : ''}`}
            onPointerDown={(event) => {
              backdropPress.current = isBackdrop(event)
            }}
            onPointerCancel={() => {
              backdropPress.current = false
            }}
            onClick={(event) => {
              if (backdropPress.current && isBackdrop(event)) close()
              backdropPress.current = false
            }}
          >
            <dialog
              ref={dialog}
              id={imageId}
              className="project-image-dialog"
              aria-modal="true"
              aria-labelledby={`${imageId}-title`}
              aria-describedby={`${imageId}-caption ${imageId}-help`}
              onKeyDown={handleKeys}
              onCancel={(event) => {
                event.preventDefault()
                close()
              }}
            >
              <div className="project-image-dialog__header">
                <h2 id={`${imageId}-title`}>{title}</h2>
                <button
                  ref={closeButton}
                  type="button"
                  aria-label="Close image viewer"
                  onClick={close}
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </div>
              <div
                className="project-image-dialog__tools"
                aria-label="Image controls"
              >
                <button
                  type="button"
                  onClick={() => zoom(actualScale / 1.5)}
                  disabled={scale === null}
                  aria-label="Zoom out"
                >
                  <ZoomOut size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => zoom(actualScale * 1.5)}
                  disabled={actualScale >= 4}
                  aria-label="Zoom in"
                >
                  <ZoomIn size={20} aria-hidden="true" />
                </button>
                <button type="button" onClick={reset}>
                  Fit image
                </button>
                <button type="button" onClick={() => zoom(1)}>
                  <Maximize size={17} aria-hidden="true" /> Actual size
                </button>
                <output aria-label="Image zoom" aria-live="polite">
                  {scale === null ? 'Fit' : `${Math.round(actualScale * 100)}%`}
                </output>
              </div>
              <div
                ref={viewport}
                className="project-image-dialog__viewport"
                role="region"
                aria-label={`${title} enlarged image`}
                tabIndex={0}
              >
                <div className="project-image-dialog__canvas">
                  <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    draggable="false"
                    style={{
                      width: `${Math.round(width * actualScale)}px`,
                      height: `${Math.round(height * actualScale)}px`,
                    }}
                  />
                </div>
              </div>
              <div className="project-image-dialog__footer">
                <p id={`${imageId}-caption`}>{caption}</p>
                <p id={`${imageId}-help`}>
                  Scroll or swipe to inspect. + / − zoom, 0 fits, 1 shows actual
                  size. Arrow keys pan the focused image.
                </p>
              </div>
            </dialog>
          </div>,
          document.body
        )}
    </>
  )
}
