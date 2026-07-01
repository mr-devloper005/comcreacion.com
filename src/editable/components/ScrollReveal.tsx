'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

/*
  Lightweight scroll-in reveal, used across editable pages instead of
  Framer Motion (not installed here). Toggles `.is-visible` via
  IntersectionObserver so premium fade/slide-up motion plays once each
  section enters the viewport. Content renders fully visible with no JS —
  the reveal is progressive enhancement, never a hide-until-loaded gate.
*/
export function ScrollReveal({
  children,
  as: Tag = 'div',
  className = '',
  variant = 'up',
  delayMs = 0,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  variant?: 'up' | 'scale'
  delayMs?: number
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const revealClass = variant === 'scale' ? 'editable-reveal-scale' : 'editable-reveal'

  return (
    <Tag
      ref={ref}
      className={`${revealClass} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
