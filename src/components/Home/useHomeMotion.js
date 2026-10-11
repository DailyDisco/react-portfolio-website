import { useEffect, useRef } from 'react'
import { animate } from 'motion/mini'

const settleTransition = { duration: 0.3, ease: 'easeOut' }
const pressDuration = 0.2
const controlSelector = '.home-scenes button, .home-replay, .home-motion-toggle'

export default function useHomeMotion(rootRef, selected) {
  const refreshRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const view = root?.ownerDocument.defaultView
    if (
      !root ||
      !view ||
      typeof view.matchMedia !== 'function' ||
      typeof root.animate !== 'function'
    ) {
      return
    }

    const preference = view.matchMedia('(prefers-reduced-motion: reduce)')
    if (!preference || preference.matches) return

    const animations = new Map()
    const revealed = new Set()
    const lowerSections = Array.from(
      root.querySelectorAll('.home-workbench, .home-links')
    )
    const removeListeners = []
    let observer = null
    let disposed = false
    let motionAllowed = true
    let pointerPress = null
    let pointerReleaseTimeout = null

    const clearPointerGuard = () => {
      if (pointerReleaseTimeout !== null) {
        view.clearTimeout(pointerReleaseTimeout)
        pointerReleaseTimeout = null
      }
      pointerPress = null
    }

    const clearAnimation = (element) => {
      const animation = animations.get(element)
      if (!animation) return
      animations.delete(element)
      animation.controls.cancel()
      Object.entries(animation.styles).forEach(([property, value]) => {
        element.style[property] = value
      })
    }

    const animateElement = (element, keyframes, options, kind = 'entrance') => {
      if (
        !element ||
        disposed ||
        !motionAllowed ||
        preference.matches ||
        typeof element.animate !== 'function'
      ) {
        return
      }
      clearAnimation(element)
      const animation = {
        kind,
        styles: Object.fromEntries(
          Object.keys(keyframes).map((property) => [
            property,
            element.style[property],
          ])
        ),
        controls: animate(element, keyframes, options),
      }
      animations.set(element, animation)
      animation.controls.then(() => {
        if (animations.get(element) === animation) clearAnimation(element)
      })
    }

    const listen = (element, event, handler) => {
      element.addEventListener(event, handler)
      removeListeners.push(() => element.removeEventListener(event, handler))
    }

    const getControl = (target) => {
      const control = target?.closest?.(controlSelector)
      return control && root.contains(control) ? control : null
    }

    const pulseControl = (control, pressed = false) => {
      clearAnimation(control)
      const transform = view.getComputedStyle(control).transform
      const baseline = transform === 'none' ? '' : transform
      animateElement(
        control,
        {
          transform: [
            `${baseline} scale(${pressed ? 0.985 : 1.01})`,
            `${baseline} scale(1)`,
          ],
        },
        { duration: pressed ? pressDuration : 0.18, ease: 'easeOut' },
        'control'
      )
    }

    const revealProject = () => {
      Array.from(animations.entries()).forEach(([element, animation]) => {
        if (animation.kind === 'project') clearAnimation(element)
      })
      const project = root.querySelector('.home-project-content')
      if (!project || project.contains(root.ownerDocument.activeElement)) return

      animateElement(
        project,
        { opacity: [0.92, 1] },
        { duration: 0.18, ease: 'easeOut' },
        'project'
      )
    }

    const revealSection = (section) => {
      if (revealed.has(section) || disposed || !motionAllowed) return
      revealed.add(section)
      observer?.unobserve(section)
      if (section.contains(root.ownerDocument.activeElement)) return
      animateElement(
        section,
        {
          opacity: [0.92, 1],
          transform: ['translateY(6px)', 'translateY(0px)'],
        },
        settleTransition
      )
    }

    const settleAll = () => {
      clearPointerGuard()
      observer?.disconnect()
      lowerSections.forEach((section) => revealed.add(section))
      Array.from(animations.keys()).forEach(clearAnimation)
    }

    const onFocus = (event) => {
      const control = getControl(event.target)
      const pressedControl = pointerPress?.control === control ? control : null
      const focusedSection = lowerSections.find((section) =>
        section.contains(event.target)
      )
      const project = root.querySelector('.home-project-content')
      const focusedProject = project?.contains(event.target)
      if (focusedSection) {
        revealed.add(focusedSection)
        observer?.unobserve(focusedSection)
      }
      Array.from(animations.entries()).forEach(([element, animation]) => {
        if (element === pressedControl) return
        if (
          (focusedProject && animation.kind === 'project') ||
          focusedSection?.contains(element) ||
          element.contains(event.target) ||
          event.target.contains?.(element)
        ) {
          clearAnimation(element)
        }
      })
    }

    const clearPointerPress = () => {
      const control =
        pointerPress?.control || getControl(root.ownerDocument.activeElement)
      clearPointerGuard()
      if (control) clearAnimation(control)
    }

    listen(root, 'focusin', onFocus)
    listen(root, 'pointerover', (event) => {
      const control = getControl(event.target)
      if (
        event.pointerType !== 'touch' &&
        control &&
        !control.contains(event.relatedTarget)
      ) {
        pulseControl(control)
      }
    })
    listen(root, 'pointerout', (event) => {
      const control = getControl(event.target)
      if (!control || control.contains(event.relatedTarget)) return
      if (
        event.pointerType === 'touch' &&
        !event.relatedTarget &&
        pointerPress?.control === control &&
        pointerPress.pointerId === event.pointerId &&
        pointerPress.released
      ) {
        return
      }
      if (pointerPress?.control === control) clearPointerGuard()
      clearAnimation(control)
    })
    listen(root, 'pointerdown', (event) => {
      if (event.button !== 0 || event.isPrimary === false) return
      const control = getControl(event.target)
      clearPointerGuard()
      pointerPress = control
        ? { control, pointerId: event.pointerId, released: false }
        : null
      if (control) pulseControl(control, true)
    })
    const endPointerPress = (event) => {
      if (pointerPress?.pointerId !== event.pointerId) return
      if (event.type === 'pointercancel') {
        const control = pointerPress.control
        clearPointerGuard()
        clearAnimation(control)
        return
      }
      pointerPress.released = true
      // Touch emits an automatic out before its compatibility focus and click.
      pointerReleaseTimeout = view.setTimeout(
        clearPointerGuard,
        pressDuration * 1000
      )
    }
    listen(root, 'click', (event) => {
      if (
        pointerPress?.released &&
        pointerPress.control === getControl(event.target)
      ) {
        clearPointerGuard()
      }
    })
    listen(view, 'pointerup', endPointerPress)
    listen(view, 'pointercancel', endPointerPress)
    listen(view, 'keydown', clearPointerPress)
    listen(view, 'blur', clearPointerPress)

    const onPreferenceChange = () => {
      if (!preference.matches) return
      motionAllowed = false
      settleAll()
    }
    if (typeof preference.addEventListener === 'function') {
      listen(preference, 'change', onPreferenceChange)
    } else if (typeof preference.addListener === 'function') {
      preference.addListener(onPreferenceChange)
      removeListeners.push(() => preference.removeListener(onPreferenceChange))
    }

    const intro = root.querySelector('.home-intro')
    if (!root.contains(root.ownerDocument.activeElement)) {
      animateElement(
        intro,
        {
          opacity: [0.92, 1],
          transform: ['translateY(6px)', 'translateY(0px)'],
        },
        settleTransition
      )
    }

    if (typeof view.IntersectionObserver === 'function') {
      observer = new view.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
              revealSection(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      lowerSections.forEach((section) => observer.observe(section))
    }
    refreshRef.current = revealProject

    return () => {
      disposed = true
      refreshRef.current = null
      settleAll()
      removeListeners.forEach((remove) => remove())
    }
  }, [rootRef])

  useEffect(() => {
    refreshRef.current?.()
  }, [rootRef, selected])
}
