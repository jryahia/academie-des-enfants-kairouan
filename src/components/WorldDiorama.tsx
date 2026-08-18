import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Owlie, Blobby, Pip } from '../three'
import { CrewKid } from '../crew'
import { CREW } from '../crew'
import { worldScroll } from '../three/worldState'
import { PhotoCarousel } from '../three/PhotoCarousel'
import '../three/ToonMaterial'
import type { DeviceQuality } from '../hooks/useDeviceQuality'

/* =========================================================================
   WorldDiorama — scroll-driven 3D diorama (signature movement #3).

   As the user scrolls the pinned section, GSAP writes worldScroll.progress
   (0..1). Each frame this scene maps that to:
     - camera dolly across the playground (dir-aware),
     - Owlie running along the ground, full run cycle,
     - crew kids walking at staggered depths past the playground props,
     - Blobby + Pip as background beats,
     - parallax clouds drifting (base idle animation so it's never static).

   Reduced-motion: playback is forced 0 → characters hold a calm standing
   pose, no scroll-driven dolly, but clouds still breathe gently. Never blank.
   ========================================================================= */

const TRACK_LEN = 30 // world units Owlie runs across
const GROUND_Y = -1.35

/* ---- soft toon material helper ---- */
const M = ({ top, bottom, fres = 0.4 }: { top: string; bottom: string; fres?: number }) => (
  <softToonMaterial colorTop={top} colorBottom={bottom} fresnel={fres} />
)

/* ---- ground + path ---- */
function Ground() {
  return (
    <group>
      <mesh position={[0, GROUND_Y, 0]} receiveShadow>
        <planeGeometry args={[TRACK_LEN * 2.4, 11]} />
        <M top="#58C778" bottom="#3fa059" fres={0.25} />
      </mesh>
      {/* running path strip */}
      <mesh position={[0, GROUND_Y + 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRACK_LEN * 2.4, 1.6]} />
        <M top="#f2e6c9" bottom="#e2d3ab" fres={0.1} />
      </mesh>
    </group>
  )
}

/* ---- a simple bush/tree for scenery ---- */
function Bush({ position, s = 1, color = '#3FBF77' }: { position: [number, number, number]; s?: number; color?: string }) {
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.45, 20, 20]} />
        <M top={color} bottom="#2e9a5d" fres={0.5} />
      </mesh>
      <mesh position={[0.35, 0.15, 0.1]}>
        <sphereGeometry args={[0.28, 18, 18]} />
        <M top={color} bottom="#2e9a5d" fres={0.5} />
      </mesh>
    </group>
  )
}

/* ---- reading-corner arch ---- */
function ReadingArch({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* arch legs */}
      <mesh position={[-0.9, GROUND_Y + 0.55, 0]}>
        <boxGeometry args={[0.22, 1.1, 0.22]} />
        <M top="#b07bf0" bottom="#8a5ad4" fres={0.4} />
      </mesh>
      <mesh position={[0.9, GROUND_Y + 0.55, 0]}>
        <boxGeometry args={[0.22, 1.1, 0.22]} />
        <M top="#b07bf0" bottom="#8a5ad4" fres={0.4} />
      </mesh>
      {/* arch top */}
      <mesh position={[0, GROUND_Y + 1.15, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.9, 0.11, 10, 24, Math.PI]} />
        <M top="#b07bf0" bottom="#8a5ad4" fres={0.5} />
      </mesh>
      {/* little book stack inside */}
      <mesh position={[0, GROUND_Y + 0.18, 0.15]}>
        <boxGeometry args={[0.5, 0.14, 0.35]} />
        <M top="#e5744f" bottom="#a8432b" fres={0.3} />
      </mesh>
      <mesh position={[0, GROUND_Y + 0.33, 0.15]}>
        <boxGeometry args={[0.42, 0.12, 0.3]} />
        <M top="#4a8fe7" bottom="#3a74c5" fres={0.3} />
      </mesh>
    </group>
  )
}

/* ---- drawing-workshop easel ---- */
function Easel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, GROUND_Y + 0.65, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.05, 1.3, 0.05]} />
        <M top="#8a6a3a" bottom="#6b4f26" fres={0.3} />
      </mesh>
      <mesh position={[0.05, GROUND_Y + 0.4, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.05, 1.1, 0.05]} />
        <M top="#8a6a3a" bottom="#6b4f26" fres={0.3} />
      </mesh>
      {/* canvas */}
      <mesh position={[0.18, GROUND_Y + 0.68, 0]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.85, 0.6, 0.04]} />
        <M top="#ffffff" bottom="#eef0f8" fres={0.2} />
      </mesh>
      {/* paint splotch */}
      <mesh position={[0.18, GROUND_Y + 0.72, 0.04]}>
        <sphereGeometry args={[0.16, 14, 14]} />
        <M top="#ff7bb0" bottom="#d9558a" fres={0.4} />
      </mesh>
    </group>
  )
}

/* ---- playground slide ---- */
function Slide({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* ladder */}
      <mesh position={[-0.7, GROUND_Y + 0.7, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.08, 1.4, 0.08]} />
        <M top="#ff9a3c" bottom="#e07d22" fres={0.3} />
      </mesh>
      <mesh position={[-0.4, GROUND_Y + 0.95, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.08, 1.4, 0.08]} />
        <M top="#ff9a3c" bottom="#e07d22" fres={0.3} />
      </mesh>
      {/* slide chute */}
      <mesh position={[0.45, GROUND_Y + 0.28, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[1.2, 0.1, 0.5]} />
        <M top="#f4793a" bottom="#c2502a" fres={0.35} />
      </mesh>
      <mesh position={[0.72, GROUND_Y - 0.08, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.9, 0.1, 0.5]} />
        <M top="#f4793a" bottom="#c2502a" fres={0.35} />
      </mesh>
    </group>
  )
}

/* ---- the characters, driven by scroll ---- */
function OwlieRunner({ frozen }: { frozen: boolean }) {
  const g = useRef<THREE.Group>(null)
  // Owlie runs from one end of the track to the other as progress goes 0..1
  useFrame(() => {
    const el = g.current
    if (!el) return
    const p = frozen ? 0.5 : worldScroll.progress
    const x = -TRACK_LEN / 2 + p * TRACK_LEN
    el.position.x = x * worldScroll.facing
    el.position.y = GROUND_Y + 0.55
  })
  return (
    <group ref={g} position={[0, GROUND_Y + 0.55, -1.6]} scale={0.85}>
      <Owlie idle={frozen ? 'still' : 'run'} runSpeed={1.4} reducedMotion={frozen} />
    </group>
  )
}

function CrewWalkers({ frozen }: { frozen: boolean }) {
  const refs = useRef<(THREE.Group | null)[]>([])
  // stable walker formation: some crew members walk along the path at depths
  const walkers = useMemo(
    () =>
      [0, 2, 4, 6].map((i) => ({
        idx: i,
        z: [0.4, 1.6, -0.6, -2.4][i % 4],
        off: i * 3.4, // stagger them
        facing: (i % 2 === 0 ? 1 : -1) as 1 | -1,
      })),
    [],
  )
  useFrame(() => {
    const p = frozen ? 0 : worldScroll.progress
    refs.current.forEach((el, i) => {
      const w = walkers[i]
      if (!el || !w) return
      // each walker advances across the diorama as scroll grows
      const walkX = ((w.off - p * 18) % 30 + 30) % 30 - 15
      el.position.x = walkX * worldScroll.facing
    })
  })
  return (
    <group>
      {walkers.map((w, i) => (
        <group key={w.idx} position={[0, GROUND_Y, w.z]}>
          <group ref={(n) => { refs.current[i] = n }} position={[0, 0, 0]}>
            <CrewKid
              spec={CREW[w.idx].spec}
              scale={0.55}
              facing={w.facing}
              entrance={!frozen}
              wave={!frozen}
              reducedMotion={frozen}
            />
          </group>
        </group>
      ))}
    </group>
  )
}

function Ambient({ frozen }: { frozen: boolean }) {
  const cloud = useRef<THREE.Group>(null)
  const clouds = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({
        baseX: i * 8 - 12,
        baseY: 2.2 + (i % 3) * 0.9,
        s: 0.7 + (i % 3) * 0.4,
      })),
    [],
  )
  useFrame((state) => {
    const c = cloud.current
    if (!c) return
    // idle drift so the scene breathes even when scroll is static/reduced
    const t = state.clock.elapsedTime
    const speed = frozen ? 0.1 : 0.25
    c.children.forEach((k, i) => {
      const m = k as THREE.Group
      m.position.x = ((clouds[i].baseX - speed * t + i * 8) % 30 + 30) % 30 - 15
      m.position.y = clouds[i].baseY + Math.sin(t * 0.6 + i) * 0.1
    })
  })
  return (
    <group ref={cloud}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.baseX, c.baseY, -6]} scale={c.s}>
          <mesh>
            <sphereGeometry args={[0.9, 16, 16]} />
            <M top="#ffffff" bottom="#eef0f8" fres={0.3} />
          </mesh>
          <mesh position={[1.1, -0.2, 0]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <M top="#ffffff" bottom="#eef0f8" fres={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ---- live-pos shift so background beats mirror when language flips ---- */
function FacingPivot({ x, y, z, children }: { x: number; y: number; z: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    const el = ref.current
    if (el) el.position.set(x * worldScroll.facing, y, z)
  })
  return <group ref={ref} position={[x, y, z]}>{children}</group>
}

/* ---- the whole scene ---- */
export default function WorldDiorama({ deviceQuality }: { deviceQuality: DeviceQuality }) {
  const frozen = deviceQuality.reducedMotion || !deviceQuality.can3D
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const { camera } = useThree()

  // dolly camera across the diorama as the user scrolls (dir-aware)
  useFrame(() => {
    const cam = cameraRef.current ?? (camera as THREE.PerspectiveCamera)
    const p = frozen ? 0 : worldScroll.progress
    const cx = 0 - p * 7 * worldScroll.facing
    cam.position.set(cx, 2.2, 7.5)
    cam.lookAt(cx * 0.6, 0.2, 0)
  })

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 9, 6]} intensity={1.4} />
      <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#bdd7ff" />

      <Ambient frozen={frozen} />

      {/* sun */}
      <FacingPivot x={12} y={5.2} z={-10}>
        <mesh>
          <sphereGeometry args={[1.6, 24, 24]} />
          <M top="#FFD23F" bottom="#f0a91c" fres={0.7} />
        </mesh>
      </FacingPivot>

      <Ground />

      {/* diorama props across the park */}
      <ReadingArch position={[-8, 0, 2.4]} />
      <ReadingArch position={[6, 0, -2]} />
      <Easel position={[9, 0, 1.6]} />
      <Slide position={[-4, 0, 3.2]} />
      <Bush position={[-11, 0, 1]} s={1.1} />
      <Bush position={[3, 0, -3]} s={0.9} color="#4BE0A2" />
      <Bush position={[12, 0, 2]} s={1.2} color="#3FBF77" />

      {/* characters */}
      <OwlieRunner frozen={frozen} />
      <CrewWalkers frozen={frozen} />

      {/* background companions */}
      <FacingPivot x={7} y={2.2} z={-4}>
        <Blobby reducedMotion={frozen} pulse scale={0.7} />
      </FacingPivot>
      <FacingPivot x={-7} y={2.6} z={-5}>
        <Pip reducedMotion={frozen} orbitRadius={0.5} speed={1.1} scale={1.1} />
      </FacingPivot>

      {/* real academy photos drifting as a rotating memory-ring in the 3D world */}
      <FacingPivot x={0} y={2.6} z={-6} >
        <PhotoCarousel frozen={frozen} radius={8.5} y={0} />
      </FacingPivot>
    </>
  )
}
