import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './../three/ToonMaterial'

/* =========================================================================
   CrewKid — parametric anime-style kid character builder.

   All 9 crew companions are variations of ONE rig (avatar builder): body,
   head, hair, outfit, and an optional accessory (hat / book / wand / rod /
   watch / wings). This keeps the whole crew consistent, cheap to render, and
   easy to extend — no 9 hand-built models.

   Style: Pixar-soft + candy (matches the mascots). Big expressive heads,
   rounded bodies, warm saturated colors, squash-and-stretch on entrance/wave.

   Each kid is self-contained; callers just drop <CrewKid kind="..."/> inside
   a <Canvas> (via the crew config file).
   ========================================================================= */

import type { ReactElement } from 'react'

export interface HairSpec {
  /** base hair color */
  color: string
  /** underlying base hair (usually the crown) */
  base: string
  /** 'spiky' | 'bowl' | 'pixie' | 'curly' | 'flat' | 'slick' */
  style: 'spiky' | 'bowl' | 'pixie' | 'curly' | 'flat' | 'slick'
}

export interface CrewKidSpec {
  name: string
  /** warm skin tone for the face/arms */
  skin: string
  /** outfit shirt color */
  shirt: string
  /** pants/shorts color */
  pants: string
  hair: HairSpec
  /** optional face detail: 'smile' | 'grin' | 'cool' | 'none' */
  mouth: 'smile' | 'grin' | 'cool' | 'none'
  /** optional accessory ReactElement mounted on the wave hand (hat/wand/rod/watch) */
  accessory?: ReactElement | null
}

interface CrewKidProps {
  spec: CrewKidSpec
  position?: [number, number, number]
  scale?: number
  /** entrance bounce on mount; then wave loop while visible */
  entrance?: boolean
  wave?: boolean
  reducedMotion?: boolean
  /** direction the character faces: 1 = +X (right), -1 = +X mirrored (left) */
  facing?: 1 | -1
}

export default function CrewKid({
  spec,
  position = [0, 0, 0],
  scale = 1,
  entrance = true,
  wave = true,
  reducedMotion = false,
  facing = 1,
}: CrewKidProps) {
  const g = useRef<THREE.Group>(null)
  const body = useRef<THREE.Mesh>(null)
  const head = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const eyeL = useRef<THREE.Group>(null)
  const eyeR = useRef<THREE.Group>(null)
  const entranceT = useRef(0)

  // Entrance squash-stretch + settle, then gentle breathing idle
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const gg = g.current
    if (!gg) return

    if (reducedMotion) {
      gg.scale.set(scale, scale, scale)
      return
    }

    // Entrance: bouncy overshoot once, ~1.2s
    if (entrance && entranceT.current < 1.2) {
      entranceT.current += 1 / 60
      const p = entranceT.current / 1.2
      // ease-out back — squash in, stretch out, settle
      const s = 0.6 + 0.55 * (1 - Math.pow(1 - p, 3))
      const stretch = 1 + Math.sin(p * Math.PI) * 0.25
      gg.scale.set(scale * s * (1 - (stretch - 1) * 0.4), scale * s * (1 + (stretch - 1) * 0.4), scale * s)
      // little hop
      gg.position.y = position[1] + Math.sin(Math.min(p * 3, Math.PI)) * 0.15
      return
    }

    // settled: mild breathing bob (nothing static)
    const breathe = Math.sin(t * 2) * 0.02
    gg.position.y = position[1] + breathe
    if (body.current) body.current.scale.set(1 + breathe * 1.2, 1 - breathe * 0.5, 1 + breathe * 1.2)
    if (head.current) head.current.rotation.y = Math.sin(t * 0.4) * 0.12

    // Wave: one arm raises and waves a little (friendly greet)
    if (wave && armR.current) armR.current.rotation.z = -0.4 + Math.sin(t * 5) * 0.12
    else if (armR.current) armR.current.rotation.z = 0.05
    if (armL.current) armL.current.rotation.z = 0.12
  })

  const m = (top: string, bottom: string, fres = 0.45) => (
    <softToonMaterial colorTop={top} colorBottom={bottom} fresnel={fres} />
  )

  return (
    <group ref={g} position={position} scale={scale} rotation={[0, facing > 0 ? 0 : Math.PI, 0]}>
      {/* === BODY (rounded torso) === */}
      <mesh ref={body} position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.34, 6, 14]} />
        {m(spec.shirt, spec.shirt, 0.4)}
      </mesh>

      {/* === ARMS (shoulder-mounted groups for wave) === */}
      <group ref={armL} position={[-0.34, 0.2, 0]}>
        <mesh position={[-0.08, -0.1, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.08, 0.12, 4, 10]} />
          {m(spec.skin, spec.skin, 0.3)}
        </mesh>
      </group>
      <group ref={armR} position={[0.34, 0.2, 0]}>
        <mesh position={[0.08, -0.1, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.08, 0.12, 4, 10]} />
          {m(spec.skin, spec.skin, 0.3)}
        </mesh>
        {/* Accessory mounts on the wave hand (moves with it) */}
        {spec.accessory}
      </group>

      {/* === LEGS (simple rounded) === */}
      <mesh position={[-0.1, -0.52, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 12]} />
        {m(spec.pants, spec.pants, 0.3)}
      </mesh>
      <mesh position={[0.1, -0.52, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 12]} />
        {m(spec.pants, spec.pants, 0.3)}
      </mesh>
      {/* feet */}
      <mesh position={[-0.1, -0.66, 0.02]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        {m(spec.pants, spec.pants, 0.2)}
      </mesh>
      <mesh position={[0.1, -0.66, 0.02]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        {m(spec.pants, spec.pants, 0.2)}
      </mesh>

      {/* === HEAD (big expressive) === */}
      <group ref={head} position={[0, 0.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />
          {m(spec.skin, spec.skin, 0.5)}
        </mesh>

        {/* Hair base (crown shell) */}
        <mesh position={[0, 0.16, 0]} scale={[1.12, 0.85, 1.1]}>
          <sphereGeometry args={[0.3, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.9]} />
          {m(spec.hair.base, spec.hair.base, 0.3)}
        </mesh>

        {/* Hair STYLE variations — distinct silhouettes per crew member */}
        {spec.hair.style === 'spiky' && (
          <group>
            {[-0.16, -0.08, 0, 0.08, 0.16].map((x, i) => (
              <mesh key={i} position={[x, 0.42 + (i % 2) * 0.06, 0]} rotation={[0, 0, -x * 2]}>
                <coneGeometry args={[0.045, 0.16, 8]} />
                {m(spec.hair.color, spec.hair.base, 0.3)}
              </mesh>
            ))}
          </group>
        )}
        {spec.hair.style === 'bowl' && (
          <mesh position={[0, 0.34, 0]} scale={[1.05, 0.5, 1.05]}>
            <sphereGeometry args={[0.3, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            {m(spec.hair.color, spec.hair.base, 0.3)}
          </mesh>
        )}
        {spec.hair.style === 'pixie' && (
          <mesh position={[0, 0.34, 0]} scale={[1.02, 0.5, 1.02]}>
            <sphereGeometry args={[0.3, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            {m(spec.hair.color, spec.hair.base, 0.3)}
          </mesh>
        )}
        {spec.hair.style === 'curly' && (
          <group>
            {[[-0.14, 0.4], [0.14, 0.4], [0, 0.46]].map(([x, y], i) => (
              <mesh key={i} position={[x, y, 0]}>
                <sphereGeometry args={[0.09, 12, 12]} />
                {m(spec.hair.color, spec.hair.base, 0.3)}
              </mesh>
            ))}
          </group>
        )}
        {spec.hair.style === 'flat' && (
          <mesh position={[0, 0.3, 0]} scale={[1.15, 0.25, 1.1]}>
            <sphereGeometry args={[0.3, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            {m(spec.hair.color, spec.hair.base, 0.3)}
          </mesh>
        )}
        {spec.hair.style === 'slick' && (
          <mesh position={[0, 0.3, 0]} scale={[1.08, 0.35, 1.06]} rotation={[0, 0, 0.15]}>
            <sphereGeometry args={[0.3, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            {m(spec.hair.color, spec.hair.base, 0.3)}
          </mesh>
        )}

        {/* Eyes (big friendly) */}
        <mesh position={[-0.12, 0.02, 0.33]}>
          <sphereGeometry args={[0.085, 20, 20]} />
          {m('#ffffff', '#efe9f5', 0.1)}
        </mesh>
        <mesh position={[0.12, 0.02, 0.33]}>
          <sphereGeometry args={[0.085, 20, 20]} />
          {m('#ffffff', '#efe9f5', 0.1)}
        </mesh>
        {/* pupils */}
        <group ref={eyeL} position={[-0.12, 0.02, 0.41]}>
          <mesh>
            <sphereGeometry args={[0.04, 14, 14]} />
            {m(spec.hair.color, '#1b1b1b', 0.2)}
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.012, 10, 10]} />
            {m('#ffffff', '#ffffff', 0)}
          </mesh>
        </group>
        <group ref={eyeR} position={[0.12, 0.02, 0.41]}>
          <mesh>
            <sphereGeometry args={[0.04, 14, 14]} />
            {m(spec.hair.color, '#1b1b1b', 0.2)}
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.012, 10, 10]} />
            {m('#ffffff', '#ffffff', 0)}
          </mesh>
        </group>

        {/* Mouth */}
        <group position={[0, -0.16, 0.35]} rotation={[0, 0, 0]}>
          {spec.mouth === 'grin' && (
            <mesh rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.09, 0.015, 8, 14, Math.PI]} />
              {m('#d94a6b', '#d94a6b', 0.1)}
            </mesh>
          )}
          {spec.mouth === 'smile' && (
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[0.07, 0.015, 8, 14, Math.PI]} />
              {m('#d94a6b', '#d94a6b', 0.1)}
            </mesh>
          )}
          {spec.mouth === 'cool' && (
            <mesh>
              <boxGeometry args={[0.12, 0.02, 0.02]} />
              {m('#2a2e45', '#2a2e45', 0)}
            </mesh>
          )}
        </group>

        {/* Eyebrows (energy: luffy/goku get expressive brows) */}
        <mesh position={[-0.12, 0.14, 0.36]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.09, 0.03, 0.02]} />
          {m(spec.hair.color, '#1b1b1b', 0)}
        </mesh>
        <mesh position={[0.12, 0.14, 0.36]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.09, 0.03, 0.02]} />
          {m(spec.hair.color, '#1b1b1b', 0)}
        </mesh>
      </group>
    </group>
  )
}
