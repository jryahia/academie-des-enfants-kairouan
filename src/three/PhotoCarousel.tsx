import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PhotoFrame } from './PhotoFrame'
import '../three/ToonMaterial'

/* =========================================================================
  PhotoCarousel — the academy photos as a slowly rotating ring of floating
  memory-frames floating behind the diorama. Gives the "real photos in 3D"
  feel without replacing the committed character cast — they drift behind as
  background beats, RTL-aware via worldScroll.facing.
  ========================================================================= */

export function PhotoCarousel({ frozen = false, radius = 9, y = 2.6 }: { frozen?: boolean; radius?: number; y?: number }) {
  const group = useRef<THREE.Group>(null)

  const frames = useMemo(
    () =>
      [
        { url: '/images/_3d/playtime.webp', frameColor: '#7cc4ff', tapeColor: '#ffd27a', seed: 0 },
        { url: '/images/_3d/storytime.webp', frameColor: '#8fd0ff', tapeColor: '#9fe0a8' },
        { url: '/images/_3d/music-lesson.webp', frameColor: '#7cc4ff', tapeColor: '#ffb3c8' },
        { url: '/images/_3d/circle-time.webp', frameColor: '#8fd0ff', tapeColor: '#ffd27a' },
        { url: '/images/_3d/art-class.webp', frameColor: '#7cc4ff', tapeColor: '#c9a8ff' },
        { url: '/images/_3d/outdoor-play.webp', frameColor: '#8fd0ff', tapeColor: '#8fe0e0' },
      ].map((c, i) => {
        const angle = (i / 6) * Math.PI * 2
        return {
          ...c,
          angle,
          pos: [
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius * 0.45 - 4,
          ] as [number, number, number],
          rotY: -angle,
        }
      }),
    [radius],
  )

  // slow ring rotation when moving; near-still at reduced motion
  useFrame((_state, delta) => {
    const el = group.current
    if (!el) return
    const speed = frozen ? 0.03 : 0.12
    el.rotation.y += delta * speed
  })

  return (
    <group ref={group} position={[0, y, 0]}>
      {frames.map((f, i) => (
        <PhotoFrame
          key={i}
          url={f.url}
          position={f.pos}
          rotation={[0, f.rotY, 0]}
          width={1.5}
          drift={frozen ? 0.03 : 0.2}
          seed={f.seed ?? i}
          frameColor={f.frameColor}
          tapeColor={f.tapeColor}
        />
      ))}
    </group>
  )
}
