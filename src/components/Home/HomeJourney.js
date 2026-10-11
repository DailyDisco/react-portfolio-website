import { useEffect, useState } from 'react'
import { animate } from 'motion/mini'
import './journey.css'

const chapters = [
  { id: 'home-results', label: 'Results' },
  { id: 'home-range', label: 'Delivery' },
  { id: 'home-approach', label: 'Systems' },
  { id: 'home-contact', label: 'About' },
]

export default function HomeJourney({ storyRef }) {
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    const root = storyRef.current
    const view = root?.ownerDocument.defaultView
    if (!root || typeof view?.IntersectionObserver !== 'function') return

    const sections = chapters
      .map((chapter) => root.querySelector(`#${chapter.id}`))
      .filter(Boolean)
    const animations = new Map()
    const revealed = new Set()
    const preference = view.matchMedia?.('(prefers-reduced-motion: reduce)')

    const clearAnimation = (section) => {
      const animation = animations.get(section)
      if (!animation) return
      animations.delete(section)
      animation.controls.cancel()
      section.style.opacity = animation.opacity
      section.style.transform = animation.transform
    }

    const revealObserver = new view.IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting || revealed.has(target)) return
          revealed.add(target)
          revealObserver.unobserve(target)
          if (
            !preference ||
            preference.matches ||
            typeof target.animate !== 'function' ||
            target.contains(root.ownerDocument.activeElement)
          ) {
            return
          }
          const animation = {
            opacity: target.style.opacity,
            transform: target.style.transform,
            controls: animate(
              target,
              {
                opacity: [0.86, 1],
                transform: ['translateY(18px)', 'translateY(0px)'],
              },
              { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            ),
          }
          animations.set(target, animation)
          animation.controls.then(() => {
            if (animations.get(target) === animation) clearAnimation(target)
          })
        })
      },
      { threshold: 0.08 }
    )

    const updateChapter = () => {
      const readingLine = view.innerHeight * 0.45
      let current = 0
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= readingLine) current = index
      })
      setActiveChapter(current)
    }
    const chapterObserver = new view.IntersectionObserver(updateChapter, {
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0,
    })
    sections.forEach((section) => {
      revealObserver.observe(section)
      chapterObserver.observe(section)
    })

    const onFocus = (event) => {
      sections.forEach((section) => {
        if (section.contains(event.target)) {
          revealed.add(section)
          revealObserver.unobserve(section)
          clearAnimation(section)
        }
      })
    }
    const onPreferenceChange = () => {
      if (!preference.matches) return
      revealObserver.disconnect()
      Array.from(animations.keys()).forEach(clearAnimation)
    }
    let removePreferenceListener = () => {}
    if (typeof preference?.addEventListener === 'function') {
      preference.addEventListener('change', onPreferenceChange)
      removePreferenceListener = () =>
        preference.removeEventListener('change', onPreferenceChange)
    } else if (typeof preference?.addListener === 'function') {
      preference.addListener(onPreferenceChange)
      removePreferenceListener = () => preference.removeListener(onPreferenceChange)
    }
    root.addEventListener('focusin', onFocus)
    updateChapter()

    return () => {
      revealObserver.disconnect()
      chapterObserver.disconnect()
      removePreferenceListener()
      root.removeEventListener('focusin', onFocus)
      Array.from(animations.keys()).forEach(clearAnimation)
    }
  }, [storyRef])

  return (
    <nav className="home-journey" aria-label="Homepage story">
      <p>
        Why hire me
        <span aria-hidden="true">0{activeChapter + 1} / 04</span>
      </p>
      <div className="home-journey-route">
        <span className="home-journey-wire" aria-hidden="true">
          <span style={{ width: `${(activeChapter / 3) * 100}%` }} />
        </span>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id} data-passed={index < activeChapter || undefined}>
              <a
                href={`#${chapter.id}`}
                aria-current={index === activeChapter ? 'location' : undefined}
                onClick={() => setActiveChapter(index)}
              >
                <span className="home-journey-port" aria-hidden="true">
                  0{index + 1}
                </span>
                {chapter.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
