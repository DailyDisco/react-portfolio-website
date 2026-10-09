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
      root.querySelectorAll('.console-selectors button')
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
          transform: ['translateY(4px)', 'translateY(0px)'],
        },
        {
          duration: 0.3,
          transform: { type: spring, duration: 0.34, bounce: 0.08 },
          opacity: { duration: 0.18, ease: 'easeOut' },
        }
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

    const updatePreference = () => {
      clearInteraction()
      resetScreen()
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

    return () => {
      disposed = true
      refreshRef.current = null
      removeListeners.forEach((remove) => remove())
      states.forEach((state, button) => resetButton(button, state))
      resetScreen()
    }
  }, [rootRef])

  useEffect(() => {
    refreshRef.current?.()
  }, [rootRef, selected])
}
