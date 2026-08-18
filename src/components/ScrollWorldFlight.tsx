import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { mountScrollWorld } from '../vendor/scrub-engine'
import type { ScrollWorldSection } from '../vendor/scrub-engine'
import LanguageSwitcher from './LanguageSwitcher'

/* =========================================================================
  ScrollWorldFlight — the scroll-world photo flight (vendored scrub engine,
  https://github.com/oso95/scroll-world, MIT).

  The engine is vanilla JS and builds its own fixed-viewport layers into the
  container. This wrapper:
    - mounts it once (React 18 StrictMode-safe via mountedRef guard),
    - gates the fixed layers with an IntersectionObserver: the flight only
      exists while its section is on screen (body gets `sw-flight-active`,
      which hides the site header), so the rest of the page flows normally,
    - re-syncs copy/nav/route text on language change (the engine's DOM is
      static after mount — we rewrite the text nodes, not the structure),
    - portals the React LanguageSwitcher into the engine's topbar.

  Real academy photos (public/images/*.webp) are the scene stills; ffmpeg
  Ken-Burns "dive" clips (public/world/vid/dive_N.mp4) give the scroll-scrubbed
  camera motion. Under prefers-reduced-motion the engine skips clips entirely
  and cross-dissolves the stills — calm but complete.
  ========================================================================= */

const SCENE_PHOTOS = [
  'classroom-group',
  'playtime',
  'storytime',
  'music-lesson',
  'art-class',
  'reading',
  'smiling-student',
]

// Batman-gold accents — subtle per-scene variation, all gold-family so the
// cinematic near-black + gold identity holds across every scene.
const ACCENTS = ['#e5b63e', '#f0c75e', '#d9a62e', '#f2d27a', '#c99a2e', '#e5b63e', '#f0c75e']

const pad = (n: number) => String(n).padStart(2, '0')
const esc = (s: string) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

interface SceneCopy {
  label: string
  eyebrow: string
  title: string
  body: string
  tags: string[]
}

function buildSections(t: TFunction): ScrollWorldSection[] {
  const scenes = t('world.scenes', { returnObjects: true }) as unknown as SceneCopy[]
  const N = SCENE_PHOTOS.length
  return scenes.map((s, i) => {
    const section: ScrollWorldSection = {
      id: `sw-${i}`,
      label: s.label,
      still: `/images/${SCENE_PHOTOS[i]}.webp`,
      clip: `/world/vid/dive_${i}.mp4`,
      accent: ACCENTS[i % ACCENTS.length],
      eyebrow: s.eyebrow,
      title: s.title,
      body: s.body,
      tags: s.tags,
    }
    // Finale scene carries the CTA (single primary — the site is the flight,
    // so "inscrire" is the one conversion action).
    if (i === N - 1) {
      section.cta = {
        primary: { label: String(t('cta.enroll')), href: '#contact' },
      }
    }
    return section
  })
}

export default function ScrollWorldFlight() {
  const { t, i18n } = useTranslation()
  const hostRef = useRef<HTMLDivElement>(null)
  const [langHost, setLangHost] = useState<HTMLDivElement | null>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host || mounted.current) return
    mounted.current = true

    const N = SCENE_PHOTOS.length

    // --- mount the vanilla engine ---
    const engine = mountScrollWorld(host, {
      brand: { name: String(t('hero.tagline')), href: '#top' },
      cta: { label: String(t('cta.enroll')), href: '#contact' },
      hint: String(t('world.hint')),
      diveScroll: 1.3,
      crossfade: 0.14,
      sections: buildSections(t),
    })

    // --- sync static engine text on language change (structure is kept) ---
    const sync = () => {
      const sects = buildSections(t)
      host.querySelectorAll<HTMLElement>('.sw-copy').forEach((c, i) => {
        const s = sects[i]
        if (!s) return
        c.innerHTML =
          `<span class="sw-copy__num">${pad(i + 1)} / ${pad(N)}</span>` +
          (s.eyebrow ? `<span class="sw-copy__eyebrow">${esc(s.eyebrow)}</span>` : '') +
          (s.title ? `<h2 class="sw-copy__title">${esc(s.title)}</h2>` : '') +
          (s.body ? `<p class="sw-copy__body">${esc(s.body)}</p>` : '') +
          (s.tags && s.tags.length
            ? `<ul class="sw-copy__tags">${s.tags.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
            : '') +
          (s.cta
            ? `<div class="sw-copy__cta">${
                s.cta.primary ? `<a class="sw-btn sw-btn--primary" href="${esc(s.cta.primary.href)}">${esc(s.cta.primary.label)}</a>` : ''
              }${
                s.cta.secondary ? `<a class="sw-btn sw-btn--ghost" href="${esc(s.cta.secondary.href)}">${esc(s.cta.secondary.label)}</a>` : ''
              }</div>`
            : '')
      })
      host.querySelectorAll<HTMLElement>('.sw-nav__item').forEach((b, i) => {
        b.textContent = sects[i]?.label ?? ''
      })
      host.querySelectorAll<HTMLElement>('.sw-route__label').forEach((l, i) => {
        l.textContent = sects[i]?.label ?? ''
      })
      const brand = host.querySelector<HTMLElement>('.sw-brand__name')
      if (brand) brand.textContent = String(t('hero.tagline'))
      const hint = host.querySelector<HTMLElement>('.sw-hint span')
      if (hint) hint.textContent = String(t('world.hint'))
      // Text reflow above the flight changes its page offset — re-measure.
      engine.relayout()
    }

    // --- portal the React language switcher into the engine's topbar ---
    const topbar = host.querySelector<HTMLElement>('.sw-topbar')
    if (topbar) {
      const div = document.createElement('div')
      div.className = 'sw-lang'
      topbar.appendChild(div)
      setLangHost(div)
    }

    // --- gate the fixed layers to the section's scroll range ---
    // The flight is the landing section: start ACTIVE (visible at load) and
    // let the observer turn it off once scrolled past into contact/footer.
    const body = document.body
    host.classList.add('sw-active')
    body.classList.add('sw-flight-active')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const on = e.isIntersecting
          host.classList.toggle('sw-active', on)
          body.classList.toggle('sw-flight-active', on)
          if (on) sync()
        }
      },
      { rootMargin: '-6% 0px -6% 0px', threshold: 0 },
    )
    io.observe(host)

    i18n.on('languageChanged', sync)

    return () => {
      io.disconnect()
      body.classList.remove('sw-flight-active')
      i18n.off('languageChanged', sync)
      setLangHost(null)
      host.innerHTML = ''
      const style = document.getElementById('sw-css')
      if (style) style.remove()
      mounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={hostRef} className="sw-flight" aria-label={String(t('world.title'))}>
      {langHost && createPortal(<LanguageSwitcher />, langHost)}
    </div>
  )
}
