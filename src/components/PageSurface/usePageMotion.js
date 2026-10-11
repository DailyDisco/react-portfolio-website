import { useEffect } from 'react'
import { animate } from 'motion/mini'

const pressDuration = 0.34

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
      element.style.opacity = animation.opacity
      element.style.transform = animation.transform
    }

    const runAnimation = (element, keyframes, options) => {
      if (disposed || !motionAllowed || typeof element.animate !== 'function') {
        return
      }
      clearAnimation(element)
      const animation = {
        opacity: element.style.opacity,
        transform: element.style.transform,
        controls: animate(element, keyframes, options),
      }
      animations.set(element, animation)
      animation.controls.then(() => {
        if (animations.get(element) === animation) clearAnimation(element)
      })
    }

    const enter = (
      element,
      { distance, scale = 1, rotation = 0, delay = 0, duration = 0.48 }
    ) => {
      runAnimation(
        element,
        {
          opacity: [0.86, 1],
          transform: [
            `translateY(${distance}px) rotate(${rotation}deg) scale(${scale})`,
            'translateY(0px) rotate(0deg) scale(1)',
          ],
        },
        { duration, delay, ease: [0.16, 1, 0.3, 1] }
      )
    }

    const getControl = (target) => {
      const control = target?.closest?.('.button, .next-chapter')
      return control && root.contains(control) ? control : null
    }

    const getControlElement = (control) =>
      control.classList.contains('next-chapter')
        ? control.querySelector('.next-chapter-arrow')
        : control

    const animateControl = (control, pressed = false) => {
      const element = getControlElement(control)
      if (!element || disposed || !motionAllowed) return
      clearAnimation(element)
      const currentTransform = view.getComputedStyle(element).transform
      const baseline = currentTransform === 'none' ? '' : currentTransform
      const isArrow = control.classList.contains('next-chapter')
      runAnimation(
        element,
        {
          transform: pressed
            ? [
                `${baseline} scale(1)`,
                `${baseline} translateX(${isArrow ? 7 : 0}px) scale(0.955)`,
                `${baseline} translateX(${isArrow ? -2 : 0}px) scale(1.015)`,
                `${baseline} scale(1)`,
              ]
            : [
                `${baseline} scale(1)`,
                `${baseline} translateX(${isArrow ? 5 : 0}px) scale(1.035)`,
                `${baseline} scale(1)`,
              ],
        },
        {
          duration: pressed ? pressDuration : 0.42,
          ease: [0.22, 1, 0.36, 1],
        }
      )
    }

    const revealPanel = (panel) => {
      if (revealed.has(panel) || disposed || !motionAllowed) return
      revealed.add(panel)
      observer?.unobserve(panel)
      if (panel.contains(root.ownerDocument.activeElement)) return

      enter(panel, { distance: 18, scale: 0.985, duration: 0.58 })
      const heading = panel.querySelector('.page-heading')
      if (heading) enter(heading, { distance: 12, delay: 0.06 })
      Array.from(
        panel.querySelectorAll(
          '.work-card, .experience-panel, .project-figure, .lab-explorer, .contact-details, .contact-form, .about-study'
        )
      )
        .slice(0, 6)
        .forEach((element, index) => {
          enter(element, {
            distance: 10,
            scale: 0.975,
            rotation: index % 2 ? 1.8 : -1.8,
            delay: 0.1 + Math.min(index * 0.06, 0.24),
          })
        })
    }

    const revealAll = () => {
      motionAllowed = false
      clearPointerGuard()
      observer?.disconnect()
      panels.forEach((panel) => revealed.add(panel))
      Array.from(animations.keys()).forEach(clearAnimation)
    }

    const onPreferenceChange = () => {
      if (preference.matches) revealAll()
    }

    const onFocus = (event) => {
      const focusedPanel = panels.find((panel) => panel.contains(event.target))
      const pressedElement =
        pointerPress?.control === getControl(event.target)
          ? getControlElement(pointerPress.control)
          : null
      panels.forEach((panel) => {
        if (panel.contains(event.target)) {
          revealed.add(panel)
          observer?.unobserve(panel)
        }
      })
      Array.from(animations.keys()).forEach((element) => {
        if (element === pressedElement) return
        if (
          focusedPanel?.contains(element) ||
          element.contains(event.target) ||
          event.target.contains?.(element)
        ) {
          clearAnimation(element)
        }
      })
    }

    const onPointerOver = (event) => {
      if (event.pointerType === 'touch') return
      const control = getControl(event.target)
      if (!control || control.contains(event.relatedTarget)) return
      animateControl(control)
    }

    const onPointerOut = (event) => {
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
      if (
        pointerPress?.control === control &&
        pointerPress.pointerId === event.pointerId
      ) {
        clearPointerGuard()
      }
      const element = getControlElement(control)
      if (element) clearAnimation(element)
    }

    const onPointerDown = (event) => {
      if (event.button !== 0 || event.isPrimary === false) return
      const control = getControl(event.target)
      clearPointerGuard()
      pointerPress = control
        ? { control, pointerId: event.pointerId, released: false }
        : null
      if (control) animateControl(control, true)
    }

    const onPointerEnd = (event) => {
      if (pointerPress?.pointerId !== event.pointerId) return
      if (event.type === 'pointercancel') {
        const element = getControlElement(pointerPress.control)
        clearPointerGuard()
        if (element) clearAnimation(element)
        return
      }
      pointerPress.released = true
      // Touch emits an automatic out before its compatibility focus and click.
      pointerReleaseTimeout = view.setTimeout(
        clearPointerGuard,
        pressDuration * 1000
      )
    }

    const onClick = (event) => {
      if (
        pointerPress?.released &&
        pointerPress.control === getControl(event.target)
      ) {
        clearPointerGuard()
      }
    }

    const clearPointerPress = () => {
      const control =
        pointerPress?.control || getControl(root.ownerDocument.activeElement)
      clearPointerGuard()
      if (control) {
        const element = getControlElement(control)
        if (element) clearAnimation(element)
      }
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
    root.addEventListener('pointerover', onPointerOver)
    root.addEventListener('pointerout', onPointerOut)
    root.addEventListener('pointerdown', onPointerDown)
    root.addEventListener('click', onClick)
    view.addEventListener('pointerup', onPointerEnd)
    view.addEventListener('pointercancel', onPointerEnd)
    view.addEventListener('keydown', clearPointerPress)
    view.addEventListener('blur', clearPointerPress)
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
      root.removeEventListener('pointerover', onPointerOver)
      root.removeEventListener('pointerout', onPointerOut)
      root.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('click', onClick)
      view.removeEventListener('pointerup', onPointerEnd)
      view.removeEventListener('pointercancel', onPointerEnd)
      view.removeEventListener('keydown', clearPointerPress)
      view.removeEventListener('blur', clearPointerPress)
    }
  }, [rootRef])
}
