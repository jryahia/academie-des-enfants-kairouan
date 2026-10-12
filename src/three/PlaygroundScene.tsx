import { Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { PLAYGROUND_PHOTOS, PLAY_COLORS, type PlaygroundPhoto } from '../data/playgroundPhotos'

/* =========================================================================
  PlaygroundScene — the 3D hero.
    - 10 real playground photos ride a slowly spinning ring of chunky,
      candy-coloured frames. Scroll turns the ring; the pointer tilts it.
    - A "ball pit" of glossy instanced spheres drifts upward behind it.
  Everything animated is read from refs / MotionValues inside useFrame, so
  scrolling never triggers a React render. Only CSP-safe drei helpers are
  used (no remote HDRIs, fonts or decoders): text lives in the DOM.
  ========================================================================= */

const TAU = Math.PI * 2
const N = PLAYGROUND_PHOTOS.length
const STEP = TAU / N
const RADIUS = 5.4
const PORTRAIT_H = 2.9
const LANDSCAPE_W = 3.25
const BORDER = 0.26

interface SceneProps {
  progress: MotionValue<number>
  rtl: boolean
  onSelect: (index: number) => void
  onFocusChange: (index: number) => void
}

function frameSize(p: PlaygroundPhoto): [number, number] {
  return p.aspect < 1 ? [PORTRAIT_H * p.aspect, PORTRAIT_H] : [LANDSCAPE_W, LANDSCAPE_W / p.aspect]
}

function PhotoFrame({
  photo,
  texture,
  index,
  onSelect,
}: {
  photo: PlaygroundPhoto
  texture: THREE.Texture
  index: number
  onSelect: (index: number) => void
}) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [w, h] = frameSize(photo)
  const angle = index * STEP
  const phase = index * 1.7

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    // Gentle independent bob so the ring feels alive, not mechanical.
    g.position.y = Math.sin(t * 0.9 + phase) * 0.12 + (index % 2 ? 0.25 : -0.2)
    g.rotation.z = Math.sin(t * 0.6 + phase) * 0.035
    const s = THREE.MathUtils.damp(g.scale.x, hovered ? 1.1 : 1, 8, dt)
    g.scale.setScalar(s)
  })

  return (
    <group rotation={[0, angle, 0]}>
      <group
        ref={group}
        position={[0, 0, RADIUS]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          // The lightbox covers the canvas, so pointerout never fires.
          document.body.style.cursor = ''
          onSelect(index)
        }}
      >
        <RoundedBox args={[w + BORDER, h + BORDER, 0.14]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={photo.frame} roughness={0.3} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0, 0.075]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        {/* Playful "pin" bead on top of each frame */}
        <mesh position={[0, h / 2 + BORDER / 2 + 0.1, 0.05]}>
          <sphereGeometry args={[0.14, 24, 16]} />
          <meshStandardMaterial
            color={photo.frame === PLAY_COLORS.orange ? PLAY_COLORS.blue : PLAY_COLORS.orange}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  )
}

function PhotoRing({ progress, rtl, onSelect, onFocusChange }: SceneProps) {
  const ring = useRef<THREE.Group>(null)
  // 1024px WebP copies keep GPU memory low enough for phones.
  const textures = useTexture(PLAYGROUND_PHOTOS.map((p) => p.src))
  const gl = useThree((s) => s.gl)
  const focused = useRef(-1)

  useLayoutEffect(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy())
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = aniso
      tex.needsUpdate = true
    })
  }, [textures, gl])

  useFrame((state, dt) => {
    const g = ring.current
    if (!g) return
    const p = progress.get()
    const { pointer, viewport } = state
    const wide = viewport.aspect > 1.1

    // Scroll spins the ring through every photo; idle drift keeps it moving.
    const dirSign = rtl ? -1 : 1
    const targetRot = dirSign * -p * TAU * ((N - 1) / N) + state.clock.elapsedTime * 0.02 * dirSign
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRot, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.08 + 0.04, 3, dt)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, pointer.x * 0.04, 3, dt)

    // On wide screens the ring starts beside the headline, then glides to
    // centre stage as the headline scrolls away. Mirrored in RTL.
    const side = wide ? (rtl ? -1 : 1) * 3.4 * (1 - Math.min(1, p * 4)) : 0
    const lift = wide ? 0 : -2.1 + Math.min(1, p * 4) * 2.1
    g.position.x = THREE.MathUtils.damp(g.position.x, side, 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, lift, 4, dt)

    // Report which frame faces the camera (only when it changes).
    const idx = (((Math.round(-g.rotation.y / STEP) % N) + N) % N) as number
    if (idx !== focused.current) {
      focused.current = idx
      onFocusChange(idx)
    }
  })

  return (
    <group ref={ring}>
      {PLAYGROUND_PHOTOS.map((photo, i) => (
        <PhotoFrame key={photo.src} photo={photo} texture={textures[i]} index={i} onSelect={onSelect} />
      ))}
    </group>
  )
}

const BALL_COLORS = [PLAY_COLORS.yellow, PLAY_COLORS.lime, PLAY_COLORS.orange, PLAY_COLORS.blue, PLAY_COLORS.pink]

function BallPit({ progress, count }: { progress: MotionValue<number>; count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const balls = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 22,
        y: (Math.random() - 0.5) * 14,
        z: -4 - Math.random() * 10,
        r: 0.14 + Math.random() * 0.34,
        speed: 0.15 + Math.random() * 0.35,
        wobble: Math.random() * TAU,
        color: BALL_COLORS[i % BALL_COLORS.length],
      })),
    [count],
  )

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    const c = new THREE.Color()
    balls.forEach((b, i) => m.setColorAt(i, c.set(b.color)))
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [balls])

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime
    const parallax = progress.get() * 4
    balls.forEach((b, i) => {
      b.y += b.speed * dt
      if (b.y > 7.5) b.y = -7.5
      dummy.position.set(b.x + Math.sin(t * 0.5 + b.wobble) * 0.4, b.y + parallax, b.z)
      dummy.scale.setScalar(b.r)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 28, 18]} />
      <meshStandardMaterial roughness={0.22} metalness={0} />
    </instancedMesh>
  )
}

function CameraRig() {
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.viewport.aspect)
  useFrame((state, dt) => {
    // Narrow screens pull the camera back so a full frame stays in view.
    const z = aspect < 0.8 ? RADIUS + 10.5 : RADIUS + 7.4
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3, dt)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.35, 2, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.4 + state.pointer.y * 0.2, 2, dt)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function PlaygroundScene({ active, ...props }: SceneProps & { active: boolean }) {
  const small = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, small ? 1.5 : 2]}
      flat
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 40, position: [0, 0.4, RADIUS + 6.6], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => {
        document.body.style.cursor = ''
      }}
    >
      <hemisphereLight args={['#fff6d6', '#8CD62B', 0.9]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 7]} intensity={1.8} />
      <directionalLight position={[-6, -2, 4]} intensity={0.5} color={PLAY_COLORS.blue} />
      <CameraRig />
      <BallPit progress={props.progress} count={small ? 36 : 70} />
      {/* Balls render at once; the ring pops in when its textures land */}
      <Suspense fallback={null}>
        <PhotoRing {...props} />
      </Suspense>
    </Canvas>
  )
}
