import { useEffect, useRef } from 'react'
import { spring } from 'motion'
import { animate } from 'motion/mini'

const settleSpring = { type: spring, duration: 0.54, bounce: 0.16 }
const pressDuration = 0.42
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
            `${baseline} translateY(${pressed ? 2 : -2}px) rotate(${pressed ? 0.7 : -0.7}deg) scale(${pressed ? 0.955 : 1.025})`,
            `${baseline} translateY(0px) rotate(0deg) scale(1)`,
          ],
        },
        { type: spring, duration: pressed ? pressDuration : 0.48, bounce: 0.25 },
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
        {
          opacity: [0.84, 1],
          transform: [
            'perspective(900px) rotateX(4deg) translateY(8px) scale(0.985)',
            'perspective(900px) rotateX(0deg) translateY(0px) scale(1)',
          ],
        },
        {
          transform: settleSpring,
          opacity: { duration: 0.24, ease: 'easeOut' },
        },
        'project'
      )
      animateElement(
        project.querySelector('h2, h3'),
        {
          transform: [
            'translateX(12px) rotate(-0.8deg)',
            'translateX(0px) rotate(0deg)',
          ],
        },
        { ...settleSpring, delay: 0.035 },
        'project'
      )
      animateElement(
        project.querySelector('.home-project-metric'),
        {
          transform: ['rotate(3deg) scale(0.9)', 'rotate(0deg) scale(1)'],
        },
        { type: spring, duration: 0.62, bounce: 0.22, delay: 0.07 },
        'project'
      )
    }

    const revealSection = (section) => {
      if (revealed.has(section) || disposed || !motionAllowed) return
      revealed.add(section)
      observer?.unobserve(section)
      if (section.contains(root.ownerDocument.activeElement)) return
      const isLinks = section.classList.contains('home-links')
      animateElement(
        section,
        {
          transform: isLinks
            ? ['translateX(18px)', 'translateX(0px)']
            : [
                'perspective(1100px) rotateX(3deg) rotate(-1deg) scale(0.98)',
                'perspective(1100px) rotateX(0deg) rotate(0deg) scale(1)',
              ],
        },
        { ...settleSpring, duration: 0.64 }
      )
      if (isLinks) {
        Array.from(section.querySelectorAll('a'))
          .slice(0, 4)
          .forEach((element, index) => {
            animateElement(
              element,
              {
                transform: [
                  `translateY(8px) rotate(${index % 2 ? 2 : -2}deg) scale(0.97)`,
                  'translateY(0px) rotate(0deg) scale(1)',
                ],
              },
              { ...settleSpring, delay: index * 0.05 }
            )
          })
      }
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

    const heroSteps = [
      ['.home-intro h1', 'translateX(-16px) rotate(-1.4deg) scale(0.98)', 0],
      ['.home-role', 'translateX(12px)', 0.055],
      ['.home-description', null, 0.1],
      ['.home-actions', 'translateY(8px) rotate(1.5deg) scaleX(0.95)', 0.14],
      ['.home-stage-top', 'translateX(16px)', 0.09],
      ['.home-scenes', 'rotate(-1deg) scaleY(0.92)', 0.17],
      ['.home-proof-strip', 'translateX(-18px)', 0.23],
    ]
    if (!root.contains(root.ownerDocument.activeElement)) {
      heroSteps.forEach(([selector, transform, delay]) => {
        animateElement(
          root.querySelector(selector),
          {
            opacity: [0.84, 1],
            ...(transform ? { transform: [transform, 'none'] } : {}),
          },
          {
            transform: { ...settleSpring, duration: 0.64, delay },
            opacity: { duration: 0.3, ease: 'easeOut', delay },
          }
        )
      })
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
