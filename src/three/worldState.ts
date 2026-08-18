/**
 * shareState — a tiny mutable bridge between GSAP ScrollTrigger and the r3f
 * scene, so the DOM scroll position and the WebGL world coordinate without
 * fighting over the frame clock.
 *
 * GSAP writes `progress` (0..1) and `playback` (1 = forward, -1 = reverse,
 * 0 = reduced-motion/static) on scroll. The r3f useFrame reads it each frame
 * to drive camera dolly + character movement.
 */
export const worldScroll = {
  /** 0..1 — how far the user has scrolled through the pinned diorama */
  progress: 0,
  /** 1 = animating with scroll, 0 = frozen calm pose (reduced motion / not begun) */
  playback: 0,
  /** direction the scene faces: 1 = LTR (right), -1 = RTL (mirrored) */
  facing: 1,
}
