import { useEffect, useRef } from 'react'
import { spring } from 'motion'
import { animate } from 'motion/mini'

const selectorSpring = {
  type: spring,
  stiffness: 620,
  damping: 32,
  mass: 0.65,
}

const isActivationKey = (event) => event.key === 'Enter' || event.key === ' '

export default function useConsoleMotion(rootRef, selected) {
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
    const buttons = Array.from(
      root.querySelectorAll(
        '.console-selectors button, .console-lab-link, .console-resume-link'
      )
    )
    const states = new Map(
      buttons.map((button) => [
        button,
        {
          hovered: false,
          focused: false,
          pressed: false,
          transform: button.style.transform,
          animation: null,
        },
      ])
    )
    const removeListeners = []
    let screen = null
    let screenAnimation = null
    let screenStyles = null
    let disposed = false
    const detailAnimations = new Map()
    const entranceAnimations = new Map()

    const clearAnimation = (animations, element) => {
      const animation = animations.get(element)
      if (!animation) return
      animations.delete(element)
      animation.controls.cancel()
      Object.entries(animation.styles).forEach(([property, value]) => {
        element.style[property] = value
      })
    }

    const animateElement = (animations, element, keyframes, options) => {
      if (!element || disposed || preference.matches) return
      clearAnimation(animations, element)
      const styles = Object.fromEntries(
        Object.keys(keyframes).map((property) => [
          property,
          element.style[property],
        ])
      )
      const animation = {
        styles,
        controls: animate(element, keyframes, options),
      }
      animations.set(element, animation)
      animation.controls.then(() => {
        if (animations.get(element) === animation)
          clearAnimation(animations, element)
      })
    }

    const listen = (element, event, handler) => {
      element.addEventListener(event, handler)
      removeListeners.push(() => element.removeEventListener(event, handler))
    }

    const resetButton = (button, state) => {
      state.animation?.cancel()
      state.animation = null
      button.style.transform = state.transform
    }

    const moveButton = (button) => {
      const state = states.get(button)
      if (disposed || !state) return
      if (preference.matches) {
        resetButton(button, state)
        return
      }

      state.animation?.stop()
      const selectedOffset =
        button.getAttribute('aria-pressed') === 'true' ? 1 : 0
      const restingOffset =
        selectedOffset - (state.hovered || state.focused ? 0.8 : 0)
      const offset = state.pressed ? 2.5 : restingOffset
      const scale = state.pressed ? 0.985 : 1

      state.animation = animate(
        button,
        { transform: `translateY(${offset}px) scale(${scale})` },
        selectorSpring
      )
    }

    const resetScreen = () => {
      Array.from(detailAnimations.keys()).forEach((element) =>
        clearAnimation(detailAnimations, element)
      )
      screenAnimation?.cancel()
      screenAnimation = null
      if (screen && screenStyles) {
        screen.style.opacity = screenStyles.opacity
        screen.style.transform = screenStyles.transform
      }
      screen = null
      screenStyles = null
    }

    const revealScreen = () => {
      resetScreen()
      if (disposed || preference.matches) return
      screen = root.querySelector('.console-screen-content')
      if (!screen) return
      screenStyles = {
        opacity: screen.style.opacity,
        transform: screen.style.transform,
      }
      screenAnimation = animate(
        screen,
        {
          opacity: [0.65, 1],
          transform: [
            'translateY(10px) scale(0.98)',
            'translateY(0px) scale(1)',
          ],
        },
        {
          duration: 0.46,
          transform: { type: spring, duration: 0.5, bounce: 0.12 },
          opacity: { duration: 0.28, ease: 'easeOut' },
        }
      )

      screen
        .querySelectorAll('.console-gpu-bank i')
        .forEach((element, index) => {
          animateElement(
            detailAnimations,
            element,
            {
              opacity: [0.35, 1],
              transform: [
                'translateY(8px) scaleY(0.7)',
                'translateY(0px) scaleY(1)',
              ],
            },
            {
              duration: 0.46,
              delay: 0.06 + index * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }
          )
        })
      screen
        .querySelectorAll('.console-flow-readout path')
        .forEach((element, index) => {
          if (typeof element.getTotalLength !== 'function') return
          const length = element.getTotalLength()
          const previousDash = element.style.strokeDasharray
          element.style.strokeDasharray = `${length}`
          animateElement(
            detailAnimations,
            element,
            { strokeDashoffset: [`${length}`, '0'] },
            { duration: 0.52, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }
          )
          const animation = detailAnimations.get(element)
          if (animation) animation.styles.strokeDasharray = previousDash
        })
      const result = screen.querySelector(
        '.console-digits > span:last-child, .console-flow-readout strong, .console-inference-readout > span:first-child'
      )
      animateElement(
        detailAnimations,
        result,
        {
          transform: [
            'translateY(6px) scale(0.94)',
            'translateY(0px) scale(1)',
          ],
        },
        { type: spring, duration: 0.55, bounce: 0.13, delay: 0.04 }
      )
    }

    buttons.forEach((button) => {
      const state = states.get(button)

      listen(button, 'pointerenter', (event) => {
        if (event.pointerType === 'touch') return
        state.hovered = true
        moveButton(button)
      })
      listen(button, 'pointerleave', () => {
        state.hovered = false
        state.pressed = false
        moveButton(button)
      })
      listen(button, 'pointerdown', (event) => {
        if (event.button !== 0 || event.isPrimary === false) return
        state.pressed = true
        moveButton(button)
      })
      listen(button, 'focus', () => {
        state.focused = true
        moveButton(button)
      })
      listen(button, 'blur', () => {
        state.focused = false
        state.pressed = false
        moveButton(button)
      })
      listen(button, 'keydown', (event) => {
        if (!isActivationKey(event) || event.repeat) return
        state.pressed = true
        moveButton(button)
      })
      listen(button, 'keyup', (event) => {
        if (!isActivationKey(event)) return
        state.pressed = false
        moveButton(button)
      })
    })

    const releaseButtons = () => {
      states.forEach((state, button) => {
        if (!state.pressed) return
        state.pressed = false
        moveButton(button)
      })
    }

    const clearInteraction = () => {
      states.forEach((state, button) => {
        state.hovered = false
        state.focused = false
        state.pressed = false
        resetButton(button, state)
      })
    }

    listen(view, 'pointerup', releaseButtons)
    listen(view, 'pointercancel', releaseButtons)
    listen(view, 'blur', clearInteraction)
    listen(root, 'focusin', (event) => {
      if (screen?.contains(event.target)) resetScreen()
      Array.from(entranceAnimations.keys()).forEach((element) => {
        if (element.contains(event.target))
          clearAnimation(entranceAnimations, element)
      })
    })

    const updatePreference = () => {
      clearInteraction()
      resetScreen()
      Array.from(entranceAnimations.keys()).forEach((element) =>
        clearAnimation(entranceAnimations, element)
      )
    }

    if (typeof preference.addEventListener === 'function') {
      listen(preference, 'change', updatePreference)
    } else if (typeof preference.addListener === 'function') {
      preference.addListener(updatePreference)
      removeListeners.push(() => preference.removeListener(updatePreference))
    }

    refreshRef.current = () => {
      buttons.forEach(moveButton)
      revealScreen()
    }

    root
      .querySelectorAll(
        '.console-identity h1, .console-role, .console-intro, .console-controls-header, .console-bottom-strip'
      )
      .forEach((element, index) => {
        animateElement(
          entranceAnimations,
          element,
          {
            opacity: [0.8, 1],
            transform: ['translateY(12px)', 'translateY(0px)'],
          },
          { duration: 0.58, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }
        )
      })

    return () => {
      disposed = true
      refreshRef.current = null
      removeListeners.forEach((remove) => remove())
      states.forEach((state, button) => resetButton(button, state))
      resetScreen()
      Array.from(entranceAnimations.keys()).forEach((element) =>
        clearAnimation(entranceAnimations, element)
      )
    }
  }, [rootRef])

  useEffect(() => {
    refreshRef.current?.()
  }, [rootRef, selected])
}
