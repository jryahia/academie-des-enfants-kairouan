import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './ToonMaterial'

export interface PipProps {
  position?: [number, number, number]
  scale?: number
  /** horizontal orbit radius */
  orbitRadius?: number
  /** orbit + flap speed */
  speed?: number
  reducedMotion?: boolean
}

/**
 * Pip — a small flying book with tiny fluttering wings. Loops a gentle orbit with
 * bobbing; the "learning" companion that animates independently in background
 * layers. Cheap and self-contained.
 */
export default function Pip({
  position = [0, 0, 0],
  scale = 1,
  orbitRadius = 0,
  speed = 1,
  reducedMotion = false,
}: PipProps) {
  const group = useRef<THREE.Group>(null)
  const lRef = useRef<THREE.Group>(null)
  const rRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    const g = group.current
    if (!g) return
    if (reducedMotion) {
      // calm hover, no flap
      return
    }

    // Orbit around the anchor position
    if (orbitRadius > 0) {
      g.position.set(
        position[0] + Math.cos(t) * orbitRadius,
        position[1] + Math.sin(t * 1.3) * 0.15,
        position[2] + Math.sin(t) * orbitRadius,
      )
      g.rotation.y = -t
    }

    // Gentle bob
    g.position.y += Math.sin(t * 2) * 0.01

    // Wing flutter
    const flap = Math.sin(t * 14) * 0.6
    if (lRef.current) lRef.current.rotation.z = flap
    if (rRef.current) rRef.current.rotation.z = -flap
  })

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Book body (closed book, spine up) */}
      <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.2]} />
        <softToonMaterial colorTop="#e5744f" colorBottom="#a8432b" fresnel={0.3} />
      </mesh>
      {/* Page edge (cream) */}
      <mesh position={[0, 0.0, 0.095]}>
        <boxGeometry args={[0.27, 0.02, 0.02]} />
        <softToonMaterial colorTop="#f5efe0" colorBottom="#e2d8c2" fresnel={0.1} />
      </mesh>
      {/* Spine */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[0.05, 0.06, 0.02]} />
        <softToonMaterial colorTop="#a8432b" colorBottom="#7a2e1d" fresnel={0.2} />
      </mesh>

      {/* Wings */}
      <group ref={lRef} position={[-0.16, 0.02, 0]}>
        <mesh rotation={[0.8, 0, 0]}>
          <coneGeometry args={[0.05, 0.14, 10]} />
          <softToonMaterial colorTop="#ffd166" colorBottom="#e8a13a" fresnel={0.2} />
        </mesh>
      </group>
      <group ref={rRef} position={[0.16, 0.02, 0]}>
        <mesh rotation={[0.8, 0, 0]}>
          <coneGeometry args={[0.05, 0.14, 10]} />
          <softToonMaterial colorTop="#ffd166" colorBottom="#e8a13a" fresnel={0.2} />
        </mesh>
      </group>
    </group>
  )
}
