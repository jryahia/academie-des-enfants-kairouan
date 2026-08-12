import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSquashStretch } from './useSquashStretch'
import './ToonMaterial' // registers <softToonMaterial>

export interface BlobbyProps {
  position?: [number, number, number]
  scale?: number
  /** sets off squash-and-stretch "pulse" (on hover/press/celebration) */
  pulse?: boolean
  /** true to force-rest on the calm pose (e.g. reduced motion) */
  still?: boolean
  colorTop?: string
  colorBottom?: string
  reducedMotion?: boolean
}

const WOBBLE = 0.06

/**
 * Blobby — the bouncy candy star-blob. A sphere whose vertices wobble gently
 * (organic "live jelly" look), floating/bobbing idle, and a strong
 * squash-and-stretch pulse when `pulse` toggles. Warm candy colors, shares the
 * soft toon material.
 */
export default function Blobby({
  position = [0, 0, 0],
  scale = 1,
  pulse = false,
  still = false,
  colorTop = '#f062c0', // candy pink
  colorBottom = '#a13d8f',
  reducedMotion = false,
}: BlobbyProps) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const { ref: squashRef, trigger } = useSquashStretch({ scale, intensity: 1.3, reducedMotion })

  // Store base position + a seeded random per vertex (so wobble is organic, not uniform)
  const verts = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.5, 48, 32)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const seeds = new Float32Array(pos.count)
    for (let i = 0; i < pos.count; i++) seeds[i] = Math.random() * Math.PI * 2
    return { geo, seeds }
  }, [])

  // Fire pulse when prop flips true
  const prevPulse = useRef(false)
  if (pulse && !prevPulse.current) {
    trigger()
  }
  prevPulse.current = pulse

  // Wobble the sphere vertices each frame
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const m = mesh.current
    if (!m) return
    const geo = verts.geo
    const pos = geo.attributes.position as THREE.BufferAttribute
    const seeds = verts.seeds
    const amp = reducedMotion || still ? 0 : WOBBLE

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      // Per-vertex seeded wobble — organic jelly, cheap
      const wob = Math.sin(t * 2.2 + seeds[i]) * amp
      const radial = 1 + wob
      pos.setXYZ(i, x * radial, y * radial, z * radial)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  // Idle float + gentle scale breathing (skip when still/reduced)
  useFrame((state) => {
    if (reducedMotion || still) return
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.08
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.2
    }
  })

  return (
    <group ref={group} position={position} scale={scale}>
      <group ref={squashRef}>
        <mesh ref={mesh} geometry={verts.geo} castShadow>
          <softToonMaterial colorTop={colorTop} colorBottom={colorBottom} fresnel={0.55} />
        </mesh>
        {/* Two little sparkle eyes so it reads as friendly */}
        <mesh position={[-0.16, 0.1, 0.46]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <softToonMaterial colorTop="#2b1b12" colorBottom="#000000" fresnel={0.1} />
        </mesh>
        <mesh position={[0.16, 0.1, 0.46]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <softToonMaterial colorTop="#2b1b12" colorBottom="#000000" fresnel={0.1} />
        </mesh>
        {/* Tiny smile — a small torus arc */}
        <mesh position={[0, -0.05, 0.5]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.09, 0.018, 12, 24, Math.PI]} />
          <softToonMaterial colorTop="#2b1b12" colorBottom="#2b1b12" fresnel={0} />
        </mesh>
      </group>
    </group>
  )
}
