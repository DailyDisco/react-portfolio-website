import { useEffect } from 'react'
import { animate } from 'motion/mini'

export default function usePageMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    const view = root?.ownerDocument.defaultView

    if (
      !root ||
      !view ||
      typeof view.matchMedia !== 'function' ||
      typeof view.IntersectionObserver !== 'function' ||
      typeof root.animate !== 'function'
    ) {
      return
    }

    const preference = view.matchMedia('(prefers-reduced-motion: reduce)')
    if (!preference || preference.matches) return

    const childPanels = Array.from(root.children).filter((element) =>
      element.classList.contains('page-panel')
    )
    const panels = childPanels.length ? childPanels : [root]
    const revealed = new Set()
    const animations = new Map()
    let observer = null
    let disposed = false
    let motionAllowed = true

    const clearAnimation = (element) => {
      const animation = animations.get(element)
      if (!animation) return
      animations.delete(element)
      animation.controls.cancel()
      element.style.opacity = animation.opacity
      element.style.transform = animation.transform
    }

    const enter = (element, distance, delay = 0) => {
      if (disposed || !motionAllowed) return
      clearAnimation(element)
      const animation = {
        opacity: element.style.opacity,
        transform: element.style.transform,
        controls: animate(
          element,
          {
            opacity: [0.78, 1],
            transform: [`translateY(${distance}px)`, 'translateY(0px)'],
          },
          { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }
        ),
      }
      animations.set(element, animation)
      animation.controls.then(() => {
        if (animations.get(element) === animation) clearAnimation(element)
      })
    }

    const revealPanel = (panel) => {
      if (revealed.has(panel) || disposed || !motionAllowed) return
      revealed.add(panel)
      observer?.unobserve(panel)
      if (panel.contains(root.ownerDocument.activeElement)) return

      enter(panel, 14)
      panel.querySelectorAll('.work-card').forEach((card, index) => {
        enter(card, 8, Math.min(index * 0.04, 0.16))
      })
    }

    const revealAll = () => {
      motionAllowed = false
      observer?.disconnect()
      panels.forEach((panel) => revealed.add(panel))
      Array.from(animations.keys()).forEach(clearAnimation)
    }

    const onPreferenceChange = () => {
      if (preference.matches) revealAll()
    }

    const onFocus = (event) => {
      panels.forEach((panel) => {
        if (panel.contains(event.target)) {
          revealed.add(panel)
          observer?.unobserve(panel)
        }
      })
      Array.from(animations.keys()).forEach((element) => {
        if (element.contains(event.target)) clearAnimation(element)
      })
    }

    let removePreferenceListener
    if (typeof preference.addEventListener === 'function') {
      preference.addEventListener('change', onPreferenceChange)
      removePreferenceListener = () =>
        preference.removeEventListener('change', onPreferenceChange)
    } else if (typeof preference.addListener === 'function') {
      preference.addListener(onPreferenceChange)
      removePreferenceListener = () =>
        preference.removeListener(onPreferenceChange)
    } else {
      return
    }

    root.addEventListener('focusin', onFocus)
    if (panels.length > 1) {
      observer = new view.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
              revealPanel(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      panels.slice(1).forEach((panel) => observer.observe(panel))
    }

    revealPanel(panels[0])

    return () => {
      disposed = true
      revealAll()
      removePreferenceListener()
      root.removeEventListener('focusin', onFocus)
    }
  }, [rootRef])
}
