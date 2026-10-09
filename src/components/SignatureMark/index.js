import { useEffect, useRef, useState } from 'react'
import './style.css'

const letterPath =
  'M107 64H211C313 64 376 129 376 225C376 321 313 386 211 386H107V64ZM177 133V317H210C270 317 302 281 302 225C302 169 270 133 210 133H177Z'

const treatments = [
  {
    name: 'Outline',
    value: 'outline',
    caption: 'A letter D, drawn in layers.',
    description: 'precise yellow contours and cyan edges',
  },
  {
    name: 'Signal',
    value: 'signal',
    caption: 'Circuit traces, for the hardware side of me.',
    description: 'circuit traces drawn within the letter',
  },
  {
    name: 'Wave',
    value: 'wave',
    caption: 'Waveforms, for the music side of me.',
    description: 'flowing waveform lines within the letter',
  },
]

const circuitPaths = [
  'M107 92H165L181 108H250L271 129H327',
  'M107 116H137L153 132H177',
  'M107 160H131L145 146H180',
  'M107 187H130L149 206V247L168 266H182',
  'M107 223H126V264L143 281V386',
  'M107 294H123V320L150 347H205L222 364H305',
  'M194 64V85H249L290 126V164L324 198V259L300 283V322L270 352H237',
  'M235 64V77L312 154V181L348 217V279L324 303V338',
  'M294 84V104L336 146V177L365 206V270',
]

const wavePaths = Array.from({ length: 19 }, (_, row) => {
  const baseline = 83 + row * 16
  return Array.from({ length: 39 }, (_, column) => {
    const x = 93 + column * 8
    const amplitude = 13 + Math.sin(row * 0.38) * 9
    const y =
      baseline +
      Math.sin(column * 0.27 + row * 0.22) * amplitude +
      Math.sin(column * 0.12 - row * 0.31) * 7
    return `${column === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`
  }).join(' ')
})

let nextSignatureId = 0

export default function SignatureMark({ className = '' }) {
  const [treatment, setTreatment] = useState(treatments[0])
  const [instanceId] = useState(() => `signature-mark-${++nextSignatureId}`)
  const stage = useRef(null)

  useEffect(() => {
    const element = stage.current
    if (!element || typeof window.matchMedia !== 'function') return undefined

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = null
    let pointerPosition = null

    function resetTilt() {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame)
      animationFrame = null
      pointerPosition = null
      element.style.setProperty('--signature-rotate-x', '0deg')
      element.style.setProperty('--signature-rotate-y', '0deg')
    }

    function moveArtwork(event) {
      if (
        !finePointer.matches ||
        reducedMotion.matches ||
        event.pointerType === 'touch'
      ) {
        return
      }
      pointerPosition = { x: event.clientX, y: event.clientY }
      if (animationFrame !== null) return

      animationFrame = requestAnimationFrame(() => {
        animationFrame = null
        if (!pointerPosition) return
        const bounds = element.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return
        const x = Math.max(
          -0.5,
          Math.min(0.5, (pointerPosition.x - bounds.left) / bounds.width - 0.5)
        )
        const y = Math.max(
          -0.5,
          Math.min(0.5, (pointerPosition.y - bounds.top) / bounds.height - 0.5)
        )
        element.style.setProperty('--signature-rotate-x', `${-y * 10}deg`)
        element.style.setProperty('--signature-rotate-y', `${x * 12}deg`)
      })
    }

    element.addEventListener('pointermove', moveArtwork, { passive: true })
    element.addEventListener('pointerleave', resetTilt)
    finePointer.addEventListener('change', resetTilt)
    reducedMotion.addEventListener('change', resetTilt)

    return () => {
      resetTilt()
      element.removeEventListener('pointermove', moveArtwork)
      element.removeEventListener('pointerleave', resetTilt)
      finePointer.removeEventListener('change', resetTilt)
      reducedMotion.removeEventListener('change', resetTilt)
    }
  }, [])

  return (
    <figure
      className={`signature-mark ${className}`.trim()}
      data-treatment={treatment.value}
    >
      <div className="signature-stage" ref={stage}>
        <svg
          className="signature-artwork"
          viewBox="0 0 480 460"
          fill="none"
          role="img"
          aria-label={`Diego’s letter D, with ${treatment.description}.`}
        >
          <defs>
            <linearGradient
              id={`${instanceId}-face`}
              x1="107"
              y1="64"
              x2="355"
              y2="386"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#164757" />
              <stop offset="0.36" stopColor="#073348" />
              <stop offset="0.72" stopColor="#052a40" />
              <stop offset="1" stopColor="#10566a" />
            </linearGradient>
            <linearGradient
              id={`${instanceId}-edge`}
              x1="126"
              y1="72"
              x2="370"
              y2="390"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffe000" />
              <stop offset="0.4" stopColor="#ffe000" stopOpacity="0.48" />
              <stop offset="0.7" stopColor="#66c4da" />
              <stop offset="1" stopColor="#a6e0e9" />
            </linearGradient>
            <clipPath id={`${instanceId}-clip`}>
              <path d={letterPath} clipRule="evenodd" />
            </clipPath>
          </defs>

          <g className="signature-sculpture" transform="rotate(-8 240 225)">
            <path
              className="signature-rear"
              d={letterPath}
              transform="translate(25 19)"
              fillRule="evenodd"
            />
            <g className="signature-depth" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <path
                  key={index}
                  d={letterPath}
                  transform={`translate(${3 + index * 3.5} ${2 + index * 2.7})`}
                  style={{ opacity: 0.18 + index * 0.065 }}
                />
              ))}
            </g>
            <path
              className="signature-face"
              d={letterPath}
              fill={`url(#${instanceId}-face)`}
              fillRule="evenodd"
              stroke={`url(#${instanceId}-edge)`}
            />
            <g clipPath={`url(#${instanceId}-clip)`}>
              <g className="signature-contours">
                {[0.955, 0.91, 0.865].map((scale) => (
                  <path
                    key={scale}
                    d={letterPath}
                    transform={`translate(241.5 225) scale(${scale}) translate(-241.5 -225)`}
                  />
                ))}
              </g>
              <g className="signature-circuit">
                {circuitPaths.map((path) => (
                  <path key={path} d={path} />
                ))}
                <path
                  className="signature-circuit-route"
                  d="M107 187H130L149 206V247L168 266H182M194 64V85H249L290 126V164L324 198V259L300 283V322L270 352H237"
                />
                {[
                  [137, 116],
                  [131, 160],
                  [149, 225],
                  [123, 320],
                  [194, 85],
                  [290, 150],
                  [324, 238],
                  [270, 352],
                ].map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" />
                ))}
              </g>
              <g className="signature-waves">
                {wavePaths.map((path, index) => (
                  <path
                    key={path}
                    d={path}
                    className={index % 5 === 0 ? 'signature-wave-accent' : ''}
                  />
                ))}
              </g>
            </g>
            <path
              className="signature-leading-edge"
              d="M107 386V64H211C259 64 299 78 327 105"
            />
            <path
              className="signature-inner-edge"
              d="M177 317H210C270 317 302 281 302 225"
            />
          </g>
        </svg>
      </div>
      <figcaption className="signature-controls">
        <div
          className="signature-treatments"
          role="group"
          aria-label="Signature artwork treatment"
        >
          {treatments.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={treatment.value === option.value}
              onClick={() => setTreatment(option)}
            >
              {option.name}
            </button>
          ))}
        </div>
        <p className="signature-caption" aria-live="polite" aria-atomic="true">
          {treatment.caption}
        </p>
      </figcaption>
    </figure>
  )
}
