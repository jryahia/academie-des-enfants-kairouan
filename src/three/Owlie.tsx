import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRunCycle } from './useRunCycle'
import './ToonMaterial' // registers <softToonMaterial>

export interface OwlieProps {
  position?: [number, number, number]
  scale?: number
  /** 'breathing' = calm idle | 'run' = full run cycle | 'still' = frozen */
  idle?: 'breathing' | 'run' | 'still'
  /** faces/speed of run; negative reverses direction (RTL-friendly). 0 = windmilling stop */
  runSpeed?: number
  /** target point the eyes/head subtly track (optional) */
  lookAt?: THREE.Vector3
  colorTop?: string
  colorBottom?: string
  reducedMotion?: boolean
}

/**
 * Owlie — the guide owl mascot. Soft, round, warm; big blinking eyes, gentle
 * breathing idle, and a bouncy cartoon run/walk cycle (the site's signature
 * moment). Built from primitives, all sharing one <softToonMaterial> for the
 * Pixar-soft look.
 *
 * The whole model lives in one group so callers can move "Owlie" as a unit and
 * the animation works regardless of parent transform.
 */
export default function Owlie({
  position = [0, 0, 0],
  scale = 1,
  idle = 'breathing',
  runSpeed = 0,
  lookAt,
  colorTop = '#c98a4b',
  colorBottom = '#8a5a2b',
  reducedMotion = false,
}: OwlieProps) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Mesh>(null)
  const head = useRef<THREE.Group>(null)
  const leftEye = useRef<THREE.Group>(null)
  const rightEye = useRef<THREE.Group>(null)
  const leftWing = useRef<THREE.Group>(null)
  const rightWing = useRef<THREE.Group>(null)
  const leftFoot = useRef<THREE.Mesh>(null)
  const rightFoot = useRef<THREE.Mesh>(null)
  const blinkPhase = useRef(Math.random() * 4)
  const lastBlink = useRef(0)
  const run = useRunCycle({ speed: runSpeed, phaseOffset: Math.random() * 6, reducedMotion })

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = group.current
    const headNode = head.current
    if (!g) return

    // Optional subtle tracking toward a target point (eyes/head lean)
    let lookLean = 0
    if (lookAt && headNode) {
      const dx = lookAt.x - g.position.x
      lookLean = THREE.MathUtils.clamp(dx * 0.05, -0.15, 0.15)
    }

    // Breathing / run bob applied to whole group
    if (idle === 'still' || reducedMotion) {
      g.position.y = 0
      if (headNode) headNode.rotation.x = 0
      return
    }

    if (idle === 'run') {
      // Run bob + forward rock
      g.position.y = run.current.bodyBob
      if (body.current) {
        body.current.rotation.x = run.current.bodyRock
      }
      // Feet stride
      if (leftFoot.current) leftFoot.current.position.y = run.current.frontLeft * 0.18
      if (rightFoot.current) rightFoot.current.position.y = run.current.frontRight * 0.18
      // Wings flap
      if (leftWing.current) leftWing.current.rotation.z = -0.5 - run.current.wingFlap * 0.5
      if (rightWing.current) rightWing.current.rotation.z = 0.5 + run.current.wingFlap * 0.5
      // Head counter-bob + lean
      if (headNode) headNode.rotation.x = run.current.headBob + lookLean
      // Eye pupils dart forward (direction of motion)
      const lookX = runSpeed >= 0 ? 0.04 : -0.04
      if (leftEye.current) leftEye.current.position.x = lookX
      if (rightEye.current) rightEye.current.position.x = lookX
      return
    }

    // 'breathing' idle
    const breathe = Math.sin(t * 1.6) * 0.03
    g.position.y = breathe * 0.5
    if (body.current) {
      // gentle scale pulse = breathing
      body.current.scale.set(1 + breathe * 0.6, 1 - breathe * 0.3, 1 + breathe * 0.6)
    }
    if (headNode) {
      // slow curious look around
      headNode.rotation.y = Math.sin(t * 0.5) * 0.25
      headNode.rotation.z = Math.sin(t * 0.4) * 0.03
      headNode.rotation.x = lookLean
    }
    // Wings rest slightly
    if (leftWing.current) leftWing.current.rotation.z = -0.85 + Math.sin(t * 1.6) * 0.04
    if (rightWing.current) rightWing.current.rotation.z = 0.85 - Math.sin(t * 1.6) * 0.04
  })

  // Blink: pupils scale Y-axis every ~3s (double blink)
  useFrame((state) => {
    if (reducedMotion) return
    const now = state.clock.elapsedTime
    const dt = Math.min(now - lastBlink.current, 0.05)
    lastBlink.current = now
    blinkPhase.current -= dt
    const close = Math.max(0, Math.min(1, -Math.abs(blinkPhase.current) * 1.2 + 1))
    const scaleY = 1 - close * 0.9
    if (leftEye.current) leftEye.current.scale.y = scaleY
    if (rightEye.current) rightEye.current.scale.y = scaleY
    if (blinkPhase.current <= -0.12) blinkPhase.current = 2.8 + Math.random() * 1.2
  })

  /* Material colors — body warm brown, belly cream, face cream patches */
  const bodyTop = colorTop
  const bodyBottom = colorBottom
  const faceColor = '#f7ead6' // warm cream
  const beakColor = '#e8a13a' // amber
  const pupilColor = '#2b1b12' // deep brown

  return (
    <group ref={group} position={position} scale={scale}>
      {/* === BODY === */}
      <mesh ref={body} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <softToonMaterial colorTop={bodyTop} colorBottom={bodyBottom} fresnel={0.5} />
      </mesh>

      {/* Belly patch */}
      <mesh position={[0, -0.08, 0.28]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <softToonMaterial colorTop={faceColor} colorBottom="#e7d2b4" fresnel={0.2} />
      </mesh>

      {/* === HEAD (separate group for look-around) === */}
      <group ref={head} position={[0, 0.5, 0]}>
        {/* Head sphere */}
        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />
          <softToonMaterial colorTop={bodyTop} colorBottom={bodyBottom} fresnel={0.5} />
        </mesh>

        {/* Feather tufts */}
        <mesh position={[-0.14, 0.32, 0]} rotation={[0, 0, -0.7]}>
          <coneGeometry args={[0.05, 0.16, 12]} />
          <softToonMaterial colorTop={bodyBottom} colorBottom={bodyBottom} />
        </mesh>
        <mesh position={[0.14, 0.32, 0]} rotation={[0, 0, 0.7]}>
          <coneGeometry args={[0.05, 0.16, 12]} />
          <softToonMaterial colorTop={bodyBottom} colorBottom={bodyBottom} />
        </mesh>

        {/* Left eye patch + pupil */}
        <mesh position={[-0.14, 0.04, 0.32]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <softToonMaterial colorTop={faceColor} colorBottom="#f0dcc0" fresnel={0.2} />
        </mesh>
        <group ref={leftEye} position={[-0.14, 0.04, 0.46]}>
          <mesh>
            <sphereGeometry args={[0.075, 20, 20]} />
            <softToonMaterial colorTop={pupilColor} colorBottom="#000000" fresnel={0.1} />
          </mesh>
        </group>

        {/* Right eye patch + pupil */}
        <mesh position={[0.14, 0.04, 0.32]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <softToonMaterial colorTop={faceColor} colorBottom="#f0dcc0" fresnel={0.2} />
        </mesh>
        <group ref={rightEye} position={[0.14, 0.04, 0.46]}>
          <mesh>
            <sphereGeometry args={[0.075, 20, 20]} />
            <softToonMaterial colorTop={pupilColor} colorBottom="#000000" fresnel={0.1} />
          </mesh>
        </group>

        {/* Beak */}
        <mesh position={[0, -0.1, 0.4]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.06, 0.1, 14]} />
          <softToonMaterial colorTop={beakColor} colorBottom="#c67a1e" fresnel={0.3} />
        </mesh>
      </group>

      {/* === WINGS (flap on run / breath on idle) === */}
      <group ref={leftWing} position={[-0.48, 0.05, 0]} rotation={[0, 0, -0.85]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 20, 20]} />
          <softToonMaterial colorTop={bodyBottom} colorBottom="#6f4520" fresnel={0.3} />
        </mesh>
      </group>
      <group ref={rightWing} position={[0.48, 0.05, 0]} rotation={[0, 0, 0.85]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 20, 20]} />
          <softToonMaterial colorTop={bodyBottom} colorBottom="#6f4520" fresnel={0.3} />
        </mesh>
      </group>

      {/* === FEET (stride on run) === */}
      <mesh ref={leftFoot} position={[-0.14, -0.5, 0.02]}>
        <cylinderGeometry args={[0.04, 0.06, 0.1, 10]} />
        <softToonMaterial colorTop="#e8a13a" colorBottom="#c67a1e" fresnel={0.2} />
      </mesh>
      <mesh ref={rightFoot} position={[0.14, -0.5, 0.02]}>
        <cylinderGeometry args={[0.04, 0.06, 0.1, 10]} />
        <softToonMaterial colorTop="#e8a13a" colorBottom="#c67a1e" fresnel={0.2} />
      </mesh>
    </group>
  )
}
