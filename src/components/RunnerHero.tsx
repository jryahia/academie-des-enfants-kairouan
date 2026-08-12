import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'
import { Owlie } from './../three'
import { CrewKid } from './../crew'
import { CREW } from './../crew'
import './../three/ToonMaterial'
import type { DeviceQuality } from './../hooks/useDeviceQuality'

/* =========================================================================
   RunnerHero — "Owlie's Playground Run" (infinite runner, Section 1).

   Owlie runs continuously along +X through a scrolling candy playground.
   9 stations spaced around the loop each hold a CrewKid companion. As Owlie
   passes a station, the companion does its entrance + wave and a speech bubble
   shows the greeting (Arabic in RTL, French in LTR — DOM overlay for crisp
   text). The loop repeats forever. Full 3D; reduced-motion swaps to a calm
   static strip (no endless scroll) with the crew standing and speech still
   cycling.
   ========================================================================= */

const LOOP_LENGTH = 36 // world units around the loop before Owlie wraps
const STATION_SPACING = LOOP_LENGTH / CREW.length
const GROUND_SPEED = 3 // base world units/sec

/* ---- scrolling candy ground (repeats) ---- */
function ScrollingGround({ speed, frozen }: { speed: number; frozen: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const offset = useRef(0)
  // 9 ground tiles spread along the loop; scroll +X
  const tiles = useMemo(
    () => Array.from({ length: CREW.length }, (_, i) => ({ id: i, x: (i - CREW.length / 2) * STATION_SPACING })),
    [],
  )

  useFrame((_, delta) => {
    if (frozen) return
    offset.current += delta * speed
    const g = ref.current
    if (g) g.position.x = (offset.current % STATION_SPACING)
  })

  return (
    <group ref={ref}>
      {tiles.map((t) => (
        <group key={t.id} position={[t.x, 0, 0]}>
          {/* green ground slab */}
          <mesh position={[0, -1.4, 0]}>
            <boxGeometry args={[STATION_SPACING, 0.4, 6]} />
            <softToonMaterial colorTop="#58C778" colorBottom="#3fa059" fresnel={0.15} />
          </mesh>
          {/* top grass strip */}
          <mesh position={[0, -1.15, 0]}>
            <boxGeometry args={[STATION_SPACING, 0.12, 6.05]} />
            <softToonMaterial colorTop="#4BE0A2" colorBottom="#2bb07c" fresnel={0.1} />
          </mesh>
          {/* little flower/speck deco per tile base */}
          <mesh position={[STATION_SPACING / 4, -1.0, 1.4]}>
            <coneGeometry args={[0.1, 0.25, 6]} />
            <softToonMaterial colorTop="#FFD23F" colorBottom="#e0a91c" fresnel={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ---- parallax far background (clouds/hills/sun), scrolls slower ---- */
function ParallaxBackground({ frozen }: { frozen: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const offset = useRef(0)
  const clouds = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ id: i, x: (i - 3) * 12, y: 1.5 + (i % 3) * 0.7, s: 0.8 + (i % 3) * 0.3 })),
    [],
  )
  useFrame((_, delta) => {
    if (frozen) return
    offset.current += delta * GROUND_SPEED * 0.35 // clouds slower than ground
    const g = ref.current
    if (g) g.children.forEach((c, i) => { c.position.x = ((clouds[i].x - offset.current) % 72 + 72) % 72 - 36 })
  })
  return (
    <group ref={ref}>
      {/* sun */}
      <mesh position={[10, 4.5, -10]}>
        <sphereGeometry args={[1.4, 24, 24]} />
        <softToonMaterial colorTop="#FFD23F" colorBottom="#f0a91c" fresnel={0.6} />
      </mesh>
      {clouds.map((c) => (
        <group key={c.id} position={[c.x, c.y, -8]} scale={c.s}>
          <mesh>
            <sphereGeometry args={[0.9, 16, 16]} />
            <softToonMaterial colorTop="#FFFFFF" colorBottom="#eef0f8" fresnel={0.3} />
          </mesh>
          <mesh position={[1.1, -0.2, 0]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <softToonMaterial colorTop="#FFFFFF" colorBottom="#eef0f8" fresnel={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ---- one station: a platform + its crew member ---- */
function Station({
  index,
  x,
  active,
  reducedMotion,
}: {
  index: number
  x: number
  active: boolean
  reducedMotion: boolean
}) {
  const m = CREW[index]
  return (
    <group position={[x, 0, 0]}>
      {/* station pad */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[1.15, 1.3, 0.2, 24]} />
        <softToonMaterial colorTop="#FFFFFF" colorBottom="#e0e4f0" fresnel={0.15} />
      </mesh>
      {/* small flag marker */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
        <softToonMaterial colorTop="#8A96C2" colorBottom="#6a75a0" fresnel={0.1} />
      </mesh>
      <mesh position={[0.12, 2.8, 0]}>
        <boxGeometry args={[0.7, 0.45, 0.05]} />
        <softToonMaterial colorTop={m.spec.hair.color} colorBottom={m.spec.hair.base} fresnel={0.2} />
      </mesh>

      {/* crew member standing on the pad, waves when active */}
      <group position={[0, -0.4, 0]}>
        <CrewKid spec={m.spec} scale={0.8} entrance={active} wave={active} reducedMotion={reducedMotion} />
      </group>
    </group>
  )
}

/* ---- speech bubble overlay (DOM, RTL-aware, crisp Arabic) ---- */
function SpeechBubble({ text }: { text: string | null }) {
  const { i18n } = useTranslation()
  if (!text) return null
  return (
    <div
      className="absolute left-1/2 top-[18%] -translate-x-1/2 z-20 pointer-events-none"
      style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="relative rounded-3xl bg-white border-4 border-candy-navy/20 px-6 py-3 shadow-xl shadow-black/10 max-w-[min(80vw,26rem)]">
        <p className="text-candy-ink text-lg sm:text-xl font-bold leading-snug text-center">{text}</p>
        {/* tail */}
        <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-white" />
      </div>
    </div>
  )
}

/* ---- the runner world that drives loop progress, stations, Owlie ---- */
function RunnerWorld({ reducedMotion, onGreet }: { reducedMotion: boolean; onGreet: (idx: number) => void }) {
  const loopTime = useRef(0)
  const lastWrap = useRef(0)
  const lastIdx = useRef(-1)
  const { camera } = useThree()

  // camera fixed, Owlie runs "in place" while ground scrolls (endless runner look)
  useEffect(() => {
    camera.position.set(0, 2.2, 9)
    camera.lookAt(0, 0.6, 0)
  }, [camera])

  // drive Owlie's run + track which station he's crossing, fire greeting
  useFrame((_, delta) => {
    if (reducedMotion) return
    loopTime.current += delta * GROUND_SPEED
    // which station index he's currently beside (0..8)
    const pos = loopTime.current % LOOP_LENGTH
    const idx = Math.floor(pos / STATION_SPACING)
    if (idx !== lastIdx.current) {
      lastIdx.current = idx
      onGreet(idx)
    }
    // note a full wrap (boucle)
    if (loopTime.current - lastWrap.current >= LOOP_LENGTH) {
      lastWrap.current = loopTime.current
    }
  })

  return (
    <>
      <ScrollingGround speed={GROUND_SPEED} frozen={reducedMotion} />
      <ParallaxBackground frozen={reducedMotion} />

      {/* Owlie runs in place (bob + run cycle), facing +X */}
      <group position={[0, 0.35, 0]} scale={1.1}>
        <Owlie idle={reducedMotion ? 'still' : 'run'} runSpeed={1} reducedMotion={reducedMotion} />
      </group>
      {/* run dust puffs */}
      {!reducedMotion && <RunDust />}

      {/* 9 stations around the loop */}
      {CREW.map((_, i) => (
        <Station key={i} index={i} x={(i - CREW.length / 2) * STATION_SPACING} active={!reducedMotion} reducedMotion={reducedMotion} />
      ))}
    </>
  )
}

function RunDust() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    const g = ref.current
    if (!g) return
    g.children.forEach((c, i) => {
      const m = c as THREE.Mesh
      const ph = (state.clock.elapsedTime * 2 + i * 0.17) % 1
      m.visible = true
      m.position.set(-0.4 + ph * 0.8, 0.1 + ph * 0.5, 0)
      m.scale.setScalar(0.2 + ph * 0.35)
      ;(m.material as THREE.Material).opacity = 1 - ph
    })
  })
  return (
    <group ref={ref}>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} color="#e8f7ea" />
        </mesh>
      ))}
    </group>
  )
}

/* =========================================================================
   Public RunnerHero component
   ========================================================================= */
export default function RunnerHero({ deviceQuality }: { deviceQuality: DeviceQuality }) {
  const { t, i18n } = useTranslation()
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const isRtl = i18n.language === 'ar'
  const quality = deviceQuality
  const reduced = quality.reducedMotion || !quality.can3D

  // pick greeting phrase (AR or FR)
  const currentGreeting =
    activeIdx === null ? null : isRtl ? CREW[activeIdx].greetingAr : CREW[activeIdx].greetingFr

  return (
    <section id="top" className="relative w-full h-[100dvh] overflow-hidden" style={{ background: 'linear-gradient(#8FE3FA 0%, #CDEFFD 45%, #FFF6E9 100%)' }}>
      {/* 3D canvas — mounted once for the scene's lifetime (no key remount) */}
      <Canvas
        camera={{ position: [0, 2.2, 9], fov: 45 }}
        dpr={quality.isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={1.3} />
        <RunnerWorld reducedMotion={reduced} onGreet={setActiveIdx} />
      </Canvas>

      {/* speech bubble overlay */}
      <SpeechBubble text={currentGreeting} />

      {/* headline + CTA overlay over the scene */}
      <div className="absolute top-20 inset-x-0 flex flex-col items-center text-center px-4 z-10 pointer-events-none">
        <p className="text-candy-navy/80 text-sm font-bold tracking-widest uppercase">
          {t('hero.tagline')}
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-candy-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.7)] mt-2">
          <span className="block">{t('hero.title1')}</span>
          <span className="block text-candy-orange">{t('hero.title2')}</span>
        </h1>
      </div>

      {/* CTA buttons */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center gap-3 px-4 z-10">
        <a
          href="#contact"
          className="rounded-full bg-candy-coral text-white px-7 py-3 font-bold text-lg shadow-lg shadow-candy-coral/40 hover:scale-105 active:scale-95 transition-transform"
        >
          {t('cta.enroll')}
        </a>
        <a
          href="#about"
          className="rounded-full bg-white text-candy-navy px-7 py-3 font-bold text-lg shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-transform"
        >
          {t('cta.learnMore')}
        </a>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-24 inset-x-0 text-center text-candy-navy/60 text-sm z-10 animate-bounce">
        {t('hero.scrollHint')}
      </div>
    </section>
  )
}
