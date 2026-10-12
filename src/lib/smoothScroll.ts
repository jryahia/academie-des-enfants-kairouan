import Lenis from 'lenis'

/* Buttery wheel/trackpad scrolling via Lenis (touch stays native).
 * Lenis drives the real window scroll position, so framer-motion's useScroll,
 * position: sticky and IntersectionObservers keep working unchanged.
 * Skipped entirely for prefers-reduced-motion. */

let lenis: Lenis | null = null
let locks = 0

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // Sections carry scroll-mt-20, which Lenis honours: no extra offset here.
    anchors: true,
  })
  const raf = (time: number) => {
    lenis?.raf(time)
    if (lenis) requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

/** Smoothly scroll to a y position or element (falls back to native). */
export function scrollToTarget(target: number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset })
    return
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'smooth' })
}

/** Freeze page scrolling while a modal is open. Ref-counted for nested modals. */
export function lockScroll() {
  locks += 1
  if (locks > 1) return
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  document.documentElement.style.overflow = ''
  lenis?.start()
}
