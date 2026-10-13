import { useEffect, useRef, useState } from 'react'
import { Box, RotateCcw, RotateCw, Layers3 } from 'lucide-react'
import './style.css'

const hardware = {
  gpus: {
    label: 'GPUs',
    title: 'Seven RTX 3090s.',
    description:
      'Seven GPUs run local models. This layout is a schematic, not a scale replica.',
  },
  memory: {
    label: 'Memory',
    title: '168 GiB combined.',
    description:
      'Each card has 24 GiB. Usable model capacity also depends on runtime and memory overhead.',
  },
  airflow: {
    label: 'Airflow',
    title: 'Room to breathe.',
    description:
      'Spacing and cooling matter in a multi-GPU system. The airflow arrangement here is conceptual.',
  },
}
const paletteDefaults = {
  paper: '#f3f2ed',
  ink: '#171a19',
  accent: '#364bff',
  signal: '#d8f36a',
  edge: '#c5c9bd',
}

export default function ServerExplorer({ fallback }) {
  const [requested, setRequested] = useState(false)
  const [renderer, setRenderer] = useState('static')
  const [rotation, setRotation] = useState(0)
  const [exploded, setExploded] = useState(false)
  const [highlight, setHighlight] = useState('gpus')
  const [reducedMotion, setReducedMotion] = useState(false)
  const viewport = useRef(null)
  const canvas = useRef(null)
  const scene = useRef(null)
  const drag = useRef(null)
  const latest = useRef({ rotation, exploded, highlight })
  latest.current = { rotation, exploded, highlight }

  useEffect(() => {
    if (!requested) return undefined
    if (
      typeof window.matchMedia !== 'function' ||
      typeof IntersectionObserver === 'undefined' ||
      typeof ResizeObserver === 'undefined'
    ) {
      setRenderer('fallback')
      return undefined
    }
    let cancelled = false
    let loading = false
    let failed = false
    let visible = false
    const element = viewport.current
    const surface = canvas.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(preference.matches)
    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      scene.current?.resize(width, height)
    }
    const updateActivity = () =>
      scene.current?.setActive(visible && !document.hidden)
    async function loadScene() {
      if (loading || failed || cancelled || scene.current) return
      loading = true
      setRenderer('loading')
      try {
        const { createServerScene } = await import('./scene')
        if (cancelled) return
        const styles = window.getComputedStyle(element)
        const palette = Object.fromEntries(
          Object.entries(paletteDefaults).map(([name, fallbackColor]) => [
            name,
            styles.getPropertyValue(`--brand-${name}`).trim() || fallbackColor,
          ])
        )
        scene.current = createServerScene(surface, {
          ...latest.current,
          palette,
          active: visible && !document.hidden,
          reducedMotion: preference.matches,
          onReady: () => {
            if (!cancelled) setRenderer('webgl')
          },
          onUnavailable: () => {
            if (!cancelled) setRenderer('fallback')
          },
        })
        resize()
      } catch (error) {
        failed = true
        if (!cancelled) setRenderer('fallback')
        if (process.env.NODE_ENV === 'development')
          console.warn(
            'The server explorer is using its static schematic.',
            error
          )
      } finally {
        loading = false
      }
    }
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !document.hidden) loadScene()
        updateActivity()
      },
      { threshold: 0.01 }
    )
    const sizeObserver = new ResizeObserver(resize)
    intersection.observe(element)
    sizeObserver.observe(element)
    const handleVisibility = () => {
      if (visible && !document.hidden) loadScene()
      updateActivity()
    }
    const handlePreference = () => {
      setReducedMotion(preference.matches)
      scene.current?.setReducedMotion(preference.matches)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    preference.addEventListener('change', handlePreference)
    return () => {
      cancelled = true
      drag.current = null
      intersection.disconnect()
      sizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      preference.removeEventListener('change', handlePreference)
      scene.current?.dispose()
      scene.current = null
    }
  }, [requested])

  useEffect(() => {
    scene.current?.setRotation(rotation)
  }, [rotation])
  useEffect(() => {
    scene.current?.setExploded(exploded)
  }, [exploded])
  useEffect(() => {
    scene.current?.setHighlight(highlight)
  }, [highlight])

  function rotate(degrees) {
    setRotation((current) => (current + degrees + 360) % 360)
  }
  function reset() {
    setRotation(0)
    setExploded(false)
    setHighlight('gpus')
  }
  function handlePointerDown(event) {
    if (renderer !== 'webgl' || event.button !== 0 || event.isPrimary === false)
      return
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rotation,
      committed: false,
    }
  }
  function handlePointerMove(event) {
    const gesture = drag.current
    if (!gesture || gesture.id !== event.pointerId) return
    if (event.pointerType !== 'touch' && event.buttons === 0) {
      drag.current = null
      return
    }
    const distance = event.clientX - gesture.x
    if (!gesture.committed) {
      if (
        Math.abs(event.clientY - gesture.y) > Math.abs(distance) &&
        Math.abs(event.clientY - gesture.y) > 6
      ) {
        drag.current = null
        return
      }
      if (Math.abs(distance) < 6) return
      gesture.committed = true
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }
    const next = (((gesture.rotation + distance * 0.5) % 360) + 360) % 360
    scene.current?.setRotation(next, true)
    setRotation(next)
  }
  function releasePointer(event) {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    drag.current = null
  }
  const ready = renderer === 'webgl'
  const detail = hardware[highlight]

  return (
    <div
      className="server-explorer"
      data-active={requested}
      data-renderer={renderer}
      data-motion={reducedMotion ? 'reduced' : 'interactive'}
    >
      <div
        ref={viewport}
        className="server-explorer-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onLostPointerCapture={() => {
          drag.current = null
        }}
      >
        <div className="server-explorer-fallback" aria-hidden={ready}>
          {fallback}
        </div>
        {requested && (
          <canvas
            ref={canvas}
            className="server-explorer-canvas"
            role="img"
            aria-hidden={!ready}
            aria-label="Interactive schematic of a seven-GPU inference server. Use the rotation and chassis controls below."
          />
        )}
      </div>
      <div className="server-explorer-entry">
        <button
          type="button"
          aria-expanded={requested}
          onClick={() => {
            setRequested((value) => !value)
            setRenderer(requested ? 'static' : 'loading')
          }}
        >
          <Box size={17} aria-hidden="true" />
          {requested ? 'Return to illustration' : 'Explore 3D'}
        </button>
      </div>
      {requested && (
        <div className="server-explorer-tools">
          <p className="server-explorer-status" role="status">
            {ready
              ? 'Drag sideways or use the controls.'
              : renderer === 'loading'
                ? 'Loading the 3D schematic…'
                : '3D is unavailable here. The illustration and hardware notes still work.'}
          </p>
          <div
            className="server-explorer-controls"
            role="group"
            aria-label="Control the server view"
          >
            <button type="button" disabled={!ready} onClick={() => rotate(-30)}>
              <RotateCcw size={16} aria-hidden="true" />
              Rotate left
            </button>
            <button type="button" disabled={!ready} onClick={() => rotate(30)}>
              <RotateCw size={16} aria-hidden="true" />
              Rotate right
            </button>
            <button
              type="button"
              disabled={!ready}
              aria-pressed={exploded}
              onClick={() => setExploded((value) => !value)}
            >
              <Layers3 size={16} aria-hidden="true" />
              {exploded ? 'Close chassis' : 'Open chassis'}
            </button>
            <button type="button" disabled={!ready} onClick={reset}>
              Reset view
            </button>
          </div>
          <div
            className="server-explorer-topics"
            role="group"
            aria-label="Explore the hardware"
          >
            {Object.entries(hardware).map(([key, item]) => (
              <button
                key={key}
                type="button"
                aria-pressed={highlight === key}
                onClick={() => setHighlight(key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p
            className="server-explorer-detail"
            aria-live="polite"
            aria-atomic="true"
          >
            <strong>{detail.title}</strong> {detail.description}
          </p>
        </div>
      )}
    </div>
  )
}
