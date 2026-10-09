import { useEffect, useRef, useState } from 'react'
import './style.css'

const fallbackShape =
  'M75 28H125C182 28 211 60 211 110S182 192 125 192H75V28ZM110 63V157H126C158 157 175 141 175 110S158 63 126 63H110Z'

export default function SignalSculpture({ selected = 0, className = '' }) {
  const stage = useRef(null)
  const canvas = useRef(null)
  const scene = useRef(null)
  const latestSelection = useRef(selected)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  latestSelection.current = selected

  useEffect(() => {
    const element = stage.current
    const surface = canvas.current
    if (
      !element ||
      !surface ||
      typeof window.matchMedia !== 'function' ||
      typeof IntersectionObserver === 'undefined' ||
      typeof ResizeObserver === 'undefined'
    ) {
      return undefined
    }

    let cancelled = false
    let loading = false
    let visible = false
    let unavailable = false
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    function updateActivity() {
      scene.current?.setActive(visible && !document.hidden)
    }

    function resize() {
      const { width, height } = element.getBoundingClientRect()
      scene.current?.resize(width, height)
    }

    async function loadScene() {
      if (loading || scene.current || unavailable || cancelled) return
      loading = true
      try {
        const { createSignalScene } = await import('./scene')
        if (cancelled) return
        scene.current = createSignalScene(surface, {
          selected: latestSelection.current,
          reducedMotion: motion.matches,
          active: visible && !document.hidden,
          onReady: () => {
            if (!cancelled) setReady(true)
          },
          onUnavailable: () => {
            if (!cancelled) setReady(false)
          },
        })
        resize()
      } catch {
        unavailable = true
        if (!cancelled) setReady(false)
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
    intersection.observe(element)

    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(element)

    function handleVisibility() {
      if (!document.hidden && visible) loadScene()
      updateActivity()
    }

    function handleMotion() {
      setReducedMotion(motion.matches)
      scene.current?.setReducedMotion(motion.matches)
    }

    function handlePointer(event) {
      if (!pointer.matches || motion.matches || event.pointerType === 'touch') {
        return
      }
      const bounds = element.getBoundingClientRect()
      scene.current?.setPointer(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
      )
    }

    function resetPointer() {
      scene.current?.setPointer(0, 0)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    motion.addEventListener('change', handleMotion)
    pointer.addEventListener('change', resetPointer)
    element.addEventListener('pointermove', handlePointer, { passive: true })
    element.addEventListener('pointerleave', resetPointer)

    return () => {
      cancelled = true
      intersection.disconnect()
      sizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      motion.removeEventListener('change', handleMotion)
      pointer.removeEventListener('change', resetPointer)
      element.removeEventListener('pointermove', handlePointer)
      element.removeEventListener('pointerleave', resetPointer)
      scene.current?.dispose()
      scene.current = null
    }
  }, [])

  useEffect(() => {
    scene.current?.setSelected(selected)
  }, [selected])

  return (
    <div
      ref={stage}
      className={`signal-sculpture ${className}`.trim()}
      data-ready={ready ? 'true' : 'false'}
      data-renderer={ready ? 'webgl' : 'fallback'}
      data-motion={reducedMotion ? 'reduced' : 'interactive'}
      aria-hidden="true"
    >
      <svg
        className="signal-sculpture__fallback"
        viewBox="0 0 300 220"
        fill="none"
        focusable="false"
      >
        <ellipse
          cx="159"
          cy="198"
          rx="77"
          ry="10"
          fill="#173633"
          opacity="0.08"
        />
        <g transform="translate(2 -2) rotate(-8 150 110) skewY(6)">
          {[5, 4, 3, 2, 1, 0].map((level) => (
            <path
              key={level}
              d={fallbackShape}
              transform={`translate(${level * 6} ${level * -2.5})`}
              fill={level === 0 ? '#dcd8c2' : '#263d36'}
              fillRule="evenodd"
              stroke={level === 0 ? '#a78a42' : '#87917a'}
              strokeWidth="1.25"
            />
          ))}
          <circle cx="90" cy="42" r="2.2" fill="#7b6a43" />
          <circle cx="90" cy="177" r="2.2" fill="#7b6a43" />
          <path d="M86 107h9M86 111h9M86 115h9" stroke="#44594a" />
        </g>
      </svg>
      <canvas ref={canvas} className="signal-sculpture__canvas" />
    </div>
  )
}
