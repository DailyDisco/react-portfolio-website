import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Hand, Pause, Play, X } from 'lucide-react'
import RobotCompanion from '../RobotCompanion'
import RobotMark from '../RobotMark'
import './style.css'

let nextPocketId = 0

export default function RobotPocket({ selected = 0 }) {
  const [open, setOpen] = useState(false)
  const [greeting, setGreeting] = useState(0)
  const [motionPaused, setMotionPaused] = useState(false)
  const [panelId] = useState(() => `robot-pocket-${++nextPocketId}`)
  const anchor = useRef(null)
  const opener = useRef(null)
  const closeButton = useRef(null)

  const close = useCallback(() => {
    setOpen(false)
    opener.current?.focus({ preventScroll: true })
  }, [])

  useLayoutEffect(() => {
    if (!open) return undefined
    const updatePlacement = () => {
      const bounds = anchor.current.getBoundingClientRect()
      const viewport = window.visualViewport
      const viewportLeft = viewport?.offsetLeft || 0
      const viewportTop = viewport?.offsetTop || 0
      const viewportWidth = viewport?.width || window.innerWidth
      const panelWidth = Math.min(300, viewportWidth - 32)
      const rightEdge = Math.min(
        viewportLeft + viewportWidth - 16,
        Math.max(bounds.right, viewportLeft + panelWidth + 16)
      )
      anchor.current.style.setProperty(
        '--robot-pocket-space',
        `${Math.max(72, bounds.top - viewportTop - 22)}px`
      )
      anchor.current.style.setProperty(
        '--robot-pocket-right',
        `${bounds.right - rightEdge}px`
      )
    }
    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, { passive: true })
    window.visualViewport?.addEventListener('resize', updatePlacement)
    return () => {
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement)
      window.visualViewport?.removeEventListener('resize', updatePlacement)
    }
  }, [open, selected])

  useEffect(() => {
    if (!open) return undefined
    closeButton.current?.focus({ preventScroll: true })
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, close])

  function sayHello() {
    setMotionPaused(false)
    setGreeting((value) => value + 1)
  }

  return (
    <div className="robot-pocket-anchor" ref={anchor}>
      <button
        ref={opener}
        type="button"
        className="robot-pocket__opener"
        aria-label={
          open
            ? 'Close the coding companion'
            : 'Psst… Meet the coding companion'
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <RobotMark width={24} height={24} />
        <span>Psst…</span>
      </button>
      {open && (
        <div
          id={panelId}
          className="robot-pocket"
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${panelId}-title`}
        >
          <div className="robot-pocket__header">
            <p id={`${panelId}-title`}>A little coding companion</p>
            <button
              ref={closeButton}
              type="button"
              className="robot-pocket__close"
              aria-label="Close companion"
              onClick={close}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="robot-pocket__stage">
            <RobotCompanion
              selected={selected}
              greeting={greeting}
              motionPaused={motionPaused}
            />
          </div>
          <div className="robot-pocket__actions">
            <button type="button" onClick={sayHello}>
              <Hand size={17} aria-hidden="true" />
              Say hello
            </button>
            <button
              type="button"
              aria-pressed={motionPaused}
              onClick={() => setMotionPaused((value) => !value)}
            >
              {motionPaused ? (
                <Play size={16} aria-hidden="true" />
              ) : (
                <Pause size={16} aria-hidden="true" />
              )}
              {motionPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
