/**
 * useRunCycle — reusable run/walk cycle phase values.
 *
 * Returns per-frame limb/body phase values for a bouncy cartoon run:
 *   - frontLeg / backLeg  : alternating lift height (0 = planted, ±1 = max lift)
 *   - bodyBob             : vertical body bounce
 *   - bodyRock            : forward/reverse pitch rocking
 *   - wingFlap            : paired wing up/down (0..1)
 *   - headBob             : counter-bob for the head
 *
 * `speed` scales stride rate; `phaseOffset` lets multiple characters desync so
 * they don't all run in lockstep.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export interface RunPhase {
  frontLeft: number
  frontRight: number
  backLeft: number
  backRight: number
  bodyBob: number
  bodyRock: number
  wingFlap: number
  headBob: number
}

interface Opts {
  /** running speed multiplier (1 default); 0 = static */
  speed?: number
  /** radians to offset the cycle so characters desync */
  phaseOffset?: number
  reducedMotion?: boolean
}

export function useRunCycle(
  { speed = 1, phaseOffset = 0, reducedMotion = false }: Opts = {},
) {
  const phaseRef = useRef(phaseOffset)
  const lastTime = useRef(0)
  const phase = useRef<RunPhase>({
    frontLeft: 0, frontRight: 0, backLeft: 0, backRight: 0,
    bodyBob: 0, bodyRock: 0, wingFlap: 0, headBob: 0,
  })

  useFrame((state) => {
    const now = state.clock.elapsedTime
    const dt = Math.min(now - lastTime.current, 0.05)
    lastTime.current = now
    phaseRef.current += dt * speed
    const t = phaseRef.current

    if (reducedMotion || speed === 0) {
      // Static calm stance
      phase.current.frontLeft = 0
      phase.current.frontRight = 0
      phase.current.backLeft = 0
      phase.current.backRight = 0
      phase.current.bodyBob = 0
      phase.current.bodyRock = 0
      phase.current.wingFlap = 0
      phase.current.headBob = 0
      return
    }

    // Diagonal gait: front/back on opposite sides alternate with each other.
    // Feet go up (sin positive) then down; body bounces on the downbeat.
    phase.current.frontLeft = Math.sin(t * 2) * 0.5 + 0.5
    phase.current.backRight = Math.sin(t * 2) * 0.5 + 0.5   // same side pair
    phase.current.frontRight = Math.sin(t * 2 + Math.PI) * 0.5 + 0.5
    phase.current.backLeft = Math.sin(t * 2 + Math.PI) * 0.5 + 0.5

    // Body bob: dips on leg strikes (every π)
    phase.current.bodyBob = -Math.abs(Math.sin(t * 2)) * 0.12
    // Rock forward/back slightly (pitch) — bobbing thrust
    phase.current.bodyRock = Math.sin(t * 2 + Math.PI * 0.5) * 0.08
    // Wings flap opposite the bob
    phase.current.wingFlap = (Math.sin(t * 4) + 1) * 0.5 * 0.6
    // Head counter-bobs lightly so it looks alive, not rigid
    phase.current.headBob = -Math.sin(t * 2 + Math.PI * 0.25) * 0.04
  })

  return phase
}

export type { Opts as RunCycleOpts }
