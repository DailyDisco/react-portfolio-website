import { useRef } from 'react'
import usePageMotion from './usePageMotion'

export default function PageSurface({
  as: Element = 'div',
  children,
  ...props
}) {
  const root = useRef(null)
  usePageMotion(root)
  return (
    <Element ref={root} {...props}>
      {children}
    </Element>
  )
}
