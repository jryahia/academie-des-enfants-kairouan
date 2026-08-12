import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * useSquashStretch — squash-and-stretch scale animation with overshoot.
 * Classic cartoon: on a "pulse"/impact, first squash (scale down Y, up XZ),
 * then stretch (up Y, down XZ) with a spring-y overshoot, then relax.
 *
 * Returns a ref you attach to a group/mesh, plus a `trigger()` you call on
 * impact/hover/press. scaleY is the resting scale multiplier (1 = identity).
 */
export function useSquashStretch(opts: {
  /** base uniform scale multiplier */
  scale?: number
  /** squash depth, 1 = full compress to ~0.5 */
  intensity?: number
  reducedMotion?: boolean
} = {}) {
  const { scale = 1, intensity = 1, reducedMotion = false } = opts
  const ref = useRef<THREE.Group>(null)
  const impulse = useRef(0)

  const trigger = () => {
    impulse.current = 1
  }

  useFrame(() => {
    if (reducedMotion) return
    const g = ref.current
    if (!g) return
    // Move impulse toward 0 with damping; when impulse active, animate.
    impulse.current *= 0.88
    const s = impulse.current
    // Squash: Y shrinks, X/Z grow; then overshoot stretch.
    const squashY = 1 - s * 0.35 * intensity
    const stretchY = 1 + s * 0.25 * intensity
    // Blend: first half squash, second half stretch, relaxed tail
    const y = s > 0.35 ? stretchY : squashY
    const side = 1 / Math.sqrt(Math.max(y, 0.01))
    const sway = Math.sin(impulse.current * Math.PI) * 0.1
    g.scale.set(scale * side * (1 + sway * 0.05), scale * y, scale * side * (1 + sway * 0.05))
  })

  return { ref, trigger }
}
