import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import '../three/ToonMaterial'

/* =========================================================================
  PhotoFrame — a floating "memory photo" card in 3D.

  The real academy photos are applied as textures on rounded candy-framed
  planes that gently bob and tilt (parallax), drifting so the scene is never
  static even at reduced motion. Used by PhotoCarousel in the World diorama
  so the site weaves the real photos into the 3D world (2D + 3D).
  ========================================================================= */

export interface PhotoFrameProps {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  /** base idle drift amplitude — 0 for reduced-motion still */
  drift?: number
  /** random-ish phase so frames don't bob in sync */
  seed?: number
  frameColor?: string
  /** optional polaroid tape accent */
  tapeColor?: string
}

export function PhotoFrame({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 1.6,
  drift = 0.2,
  seed = 0,
  frameColor = '#ffffff',
  tapeColor,
}: PhotoFrameProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const texture = useTexture(url)

  // aspect-aware plane height from the loaded image
  const [w, h] = useMemo(() => {
    const img = texture.image as { width?: number; height?: number }
    const iw = img?.width ?? width
    const ih = img?.height ?? width // fallback square
    const aspect = iw / ih
    return [width, width / aspect] as const
  }, [texture, width])

  // candy rounded frame = slightly larger solid plane behind the photo,
  // with rounded-corner mask approximated by a plane + border via a second
  // inflated mesh. Simple + reliable: white/colored backing card.
  const phase = useMemo(() => seed * 2.13, [seed])

  useFrame((state) => {
    const el = mesh.current
    if (!el) return
    const t = state.clock.elapsedTime
    const amp = drift
    // slow float + gentle yaw so the photo feels alive, never static
    el.position.y = Math.sin(t * 0.7 + phase) * amp * 0.35
    el.rotation.z = Math.sin(t * 0.5 + phase * 1.7) * amp * 0.08
    el.rotation.y += Math.sin(t * 0.3 + phase) * amp * 0.002
  })

  return (
    <group position={position} rotation={rotation}>
      {/* backing card (candy frame) */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[w + 0.16, h + 0.16]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* the photo */}
      <mesh ref={mesh}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          ref={mat}
          map={texture}
          toneMapped={false}
        />
      </mesh>
      {/* optional tape strip (polaroid) on top */}
      {tapeColor && (
        <mesh position={[0, h / 2 + 0.05, 0.01]} rotation={[0, 0, -0.15]}>
          <planeGeometry args={[Math.min(w * 0.55, 0.9), 0.14]} />
          <meshStandardMaterial color={tapeColor} transparent opacity={0.92} roughness={0.8} />
        </mesh>
      )}
    </group>
  )
}

export const PHOTOS_3D = [
  '/images/_3d/playtime.webp',
  '/images/_3d/storytime.webp',
  '/images/_3d/music-lesson.webp',
  '/images/_3d/circle-time.webp',
  '/images/_3d/art-class.webp',
  '/images/_3d/outdoor-play.webp',
]
