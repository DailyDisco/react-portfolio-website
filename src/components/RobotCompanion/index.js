import { useEffect, useRef, useState } from 'react'
import RobotMark from '../RobotMark'
import './style.css'

const paletteDefaults = {
  paper: '#f3f2ed',
  ink: '#171a19',
  accent: '#364bff',
  signal: '#d8f36a',
  surface: '#e6e7df',
  edge: '#c5c9bd',
}

function readPalette(element) {
  const styles = window.getComputedStyle(element)
  return Object.fromEntries(
    Object.entries(paletteDefaults).map(([name, fallback]) => [
      name,
      styles.getPropertyValue(`--brand-${name}`).trim() || fallback,
    ])
  )
}

function StaticCompanion({ selected }) {
  return (
    <svg
      className="robot-companion__fallback"
      viewBox="0 0 560 480"
      fill="none"
      focusable="false"
    >
      <ellipse
        cx="281"
        cy="401"
        rx="115"
        ry="14"
        fill="var(--brand-ink, #171a19)"
        opacity="0.08"
      />
      <path
        d="M325 309C373 294 379 356 351 355L341 340"
        stroke="var(--brand-accent, #364bff)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect
        x="334"
        y="331"
        width="16"
        height="23"
        rx="6"
        fill="var(--robot-shell, #eaf0c3)"
        transform="rotate(-25 342 342)"
      />
      <ellipse
        cx="249"
        cy="385"
        rx="28"
        ry="18"
        fill="var(--robot-shell, #eaf0c3)"
      />
      <ellipse
        cx="313"
        cy="385"
        rx="28"
        ry="18"
        fill="var(--robot-shell, #eaf0c3)"
      />
      <rect
        x="228"
        y="272"
        width="106"
        height="113"
        rx="52"
        fill="var(--brand-accent, #364bff)"
      />
      <path
        d="M231 307C209 311 207 326 214 339"
        stroke="var(--brand-accent, #364bff)"
        strokeWidth="24"
        strokeLinecap="round"
      />
      <circle cx="214" cy="339" r="17" fill="var(--robot-shell, #eaf0c3)" />
      <path
        d={
          selected === 0
            ? 'M330 306C354 305 359 290 356 278'
            : 'M330 306C352 310 357 326 350 337'
        }
        stroke="var(--brand-accent, #364bff)"
        strokeWidth="24"
        strokeLinecap="round"
      />
      <circle
        cx={selected === 0 ? 356 : 350}
        cy={selected === 0 ? 278 : 337}
        r="17"
        fill="var(--robot-shell, #eaf0c3)"
      />
      <rect
        x="262"
        y="322"
        width="38"
        height="27"
        rx="10"
        fill="var(--brand-paper, #f3f2ed)"
      />
      <path
        d="M281 342c-2-3-11-7-8-12 2-4 6-3 8 0 2-3 6-4 8 0 3 5-6 9-8 12Z"
        fill="var(--brand-accent, #364bff)"
      />
      <RobotMark x="159" y="54" width="244" height="244" />
      <g
        stroke="var(--brand-ink, #171a19)"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        {selected === 0 ? (
          <>
            <g transform="translate(72 233) rotate(-12)">
              <rect
                width="88"
                height="65"
                rx="12"
                fill="var(--brand-paper, #f3f2ed)"
              />
              <path d="M0 20H88" />
              <path d="M14 10h2m8 0h2m8 0h2" strokeLinecap="round" />
              <rect
                x="13"
                y="32"
                width="25"
                height="20"
                rx="4"
                fill="var(--brand-signal, #d8f36a)"
                stroke="none"
              />
              <path d="M48 36h25m-25 12h16" />
            </g>
            <g transform="translate(409 168) rotate(12)">
              <rect
                width="72"
                height="57"
                rx="11"
                fill="var(--brand-accent, #364bff)"
              />
              <path
                d="m23 26 10 10 19-20"
                stroke="var(--brand-paper, #f3f2ed)"
                strokeLinecap="round"
              />
            </g>
          </>
        ) : selected === 1 ? (
          <>
            <path
              d="M94 253C127 200 137 166 158 159M404 159C440 165 438 222 462 267"
              stroke="var(--brand-accent, #364bff)"
            />
            <circle
              cx="94"
              cy="253"
              r="18"
              fill="var(--brand-signal, #d8f36a)"
            />
            <circle
              cx="462"
              cy="267"
              r="20"
              fill="var(--brand-accent, #364bff)"
            />
            <path
              d="M89 164C66 157 73 129 94 133C103 107 137 116 137 136C167 132 172 166 146 169H92Z"
              fill="var(--brand-paper, #f3f2ed)"
            />
          </>
        ) : (
          <g transform="translate(78 197) rotate(-12)">
            <rect
              x="0"
              y="23"
              width="87"
              height="68"
              rx="13"
              fill="var(--brand-ink, #171a19)"
            />
            <rect
              x="0"
              y="12"
              width="87"
              height="68"
              rx="13"
              fill="var(--brand-accent, #364bff)"
            />
            <rect
              width="87"
              height="68"
              rx="13"
              fill="var(--brand-paper, #f3f2ed)"
            />
            <rect
              x="23"
              y="15"
              width="41"
              height="38"
              rx="8"
              fill="var(--brand-signal, #d8f36a)"
            />
            <path d="M13-7v7m18-7v7m19-7v7m19-7v7m-76 15h7m-7 20h7m-7 20h7M87 15h7m-7 20h7m-7 20h7" />
          </g>
        )}
      </g>
    </svg>
  )
}

export default function RobotCompanion({
  selected = 0,
  greeting = 0,
  motionPaused = false,
  className = '',
}) {
  const stage = useRef(null)
  const canvas = useRef(null)
  const scene = useRef(null)
  const latest = useRef({ selected, greeting, motionPaused })
  latest.current = { selected, greeting, motionPaused }
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const element = stage.current
    const surface = canvas.current
    if (
      !element ||
      !surface ||
      typeof window.matchMedia !== 'function' ||
      typeof IntersectionObserver === 'undefined' ||
      typeof ResizeObserver === 'undefined'
    )
      return undefined
    let cancelled = false
    let loading = false
    let unavailable = false
    let visible = false
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      scene.current?.resize(width, height)
    }
    const updateActivity = () =>
      scene.current?.setActive(visible && !document.hidden)
    async function loadScene() {
      if (loading || scene.current || unavailable || cancelled) return
      loading = true
      try {
        const { createCompanionScene } = await import('./scene')
        if (cancelled) return
        scene.current = createCompanionScene(surface, {
          selected: latest.current.selected,
          greeting: latest.current.greeting,
          reducedMotion: preference.matches,
          motionEnabled: !latest.current.motionPaused,
          active: visible && !document.hidden,
          palette: readPalette(element),
          onReady: () => {
            if (!cancelled) setReady(true)
          },
          onUnavailable: () => {
            if (!cancelled) setReady(false)
          },
        })
        resize()
      } catch (error) {
        unavailable = true
        if (!cancelled) setReady(false)
        if (process.env.NODE_ENV === 'development')
          console.warn('The robot is using its static illustration.', error)
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
    const resetPointer = () => scene.current?.setPointer(0, 0)
    const handlePointer = (event) => {
      if (
        !finePointer.matches ||
        preference.matches ||
        latest.current.motionPaused ||
        event.pointerType === 'touch'
      )
        return
      const bounds = element.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      scene.current?.setPointer(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        ((event.clientY - bounds.top) / bounds.height) * 2 - 1
      )
    }
    document.addEventListener('visibilitychange', handleVisibility)
    preference.addEventListener('change', handlePreference)
    finePointer.addEventListener('change', resetPointer)
    element.addEventListener('pointermove', handlePointer, { passive: true })
    element.addEventListener('pointerleave', resetPointer)
    return () => {
      cancelled = true
      intersection.disconnect()
      sizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      preference.removeEventListener('change', handlePreference)
      finePointer.removeEventListener('change', resetPointer)
      element.removeEventListener('pointermove', handlePointer)
      element.removeEventListener('pointerleave', resetPointer)
      scene.current?.dispose()
      scene.current = null
    }
  }, [])

  useEffect(() => {
    scene.current?.setSelected(selected)
  }, [selected])
  useEffect(() => {
    scene.current?.setMotionEnabled(!motionPaused)
  }, [motionPaused])
  useEffect(() => {
    scene.current?.greet(greeting)
  }, [greeting])

  return (
    <div
      ref={stage}
      className={`robot-companion ${className}`.trim()}
      aria-hidden="true"
      data-ready={ready ? 'true' : 'false'}
      data-renderer={ready ? 'webgl' : 'fallback'}
      data-motion={
        reducedMotion ? 'reduced' : motionPaused ? 'paused' : 'interactive'
      }
      data-pose={['product', 'cloud', 'systems'][selected] || 'product'}
    >
      <StaticCompanion selected={selected} />
      <canvas ref={canvas} className="robot-companion__canvas" />
    </div>
  )
}
