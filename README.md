# Académie des Enfants Kairouan — 3D + Real Photos Website

Premium, animation-driven marketing site for a children's academy in Kairouan, Tunisia.
3D (r3f) + 2D illustration ORIGINAL visuals AND now the real academy photos
(as of the photo-integration round — the old "no real photos" rule is superseded
by Yahya's explicit instruction to use the added photos).

## Stack (locked)
- React 18 + Vite + TypeScript (not Next.js — static SPA is fine)
- @react-three/fiber + drei (all 3D)
- Framer Motion (UI animation)
- GSAP + ScrollTrigger (scroll-driven 3D diorama camera/character movement)
- Tailwind CSS (layout)
- lottie-react (2D fallback/secondary animation layer)
- react-i18next (AR/FR, document-level dir switching)

## i18n & RTL (foundation done)
- Two first-class locales: **ar** (RTL) and **fr** (LTR). French is not an afterthought.
- Document `dir`/`lang` set at boot from persisted choice or browser detection.
- Language switcher flips dir + content together with a crossfade (no layout snap).
- All 3D UI overlays, icons, and motion direction must mirror in RTL — not just text.

## Visual identity
Dark warm palette — indigo/violet/blue core (#6C5CE7 / #5B8DEF / #3DDC97), sunny
accent (#FFB86B), coral (#FF6B6B). Fonts: **Baloo 2** (display/Latin) + **Cairo**
(Arabic) + **Nunito** (body/Latin). Rounded, candy-bubbly Pixar-soft style — no
low-poly/angular.

## Mascot cast (2–3 recurring 3D characters — client confirmed direction in brief)
1. **Owlie** (guide) — soft round curious owl, leads hero + scroll transitions,
   owns the signature run/walk cycle.
2. **Blobby** (energy) — bouncy candy star-blob, squash/stretch on hover, celebration
   on form submit.
3. *(optional)* **Pip** — small flying book or pencil companion, independent background beat.

## Sections (proposed order)
Hero → About → Programs → World (scroll-driven diorama) → Values/WhyUs → Testimonials
→ Enrollment/Contact → Footer.

## OPEN ITEMS — confirm with client BEFORE implementation briefs
1. Section list/order lock.
2. Real testimonial text? (anonymized OK) or placeholder-only.
3. Contact channel(s): form only / WhatsApp / phone / all three.
4. Brand colors from the Facebook page, or open creative palette?
5. Hosting/domain target.

## Content rule
NO fabricated academy details (staff names, programs, pricing, quotes tied to real
people). Placeholder copy is explicitly marked `[…]` / "pending" — never invented
specifics. Program names, staff, pricing come from the client.

## Build state
- **Enrollment API (this round):** `backend/main.py` (FastAPI + uvicorn on
  :8425) fans each form submission out to every configured channel and always
  keeps a durable JSONL log (`backend/enrollments.log`). A failing/missing
  channel never fails the request. Channels (env vars in `backend/.env`,
  template in `backend/.env.example`):
  - **Google Sheets + Gmail** — one Apps Script web app (`backend/appsscript.gs`)
    appends the row AND emails the owner (NOTIFY_EMAIL script property). Zero
    API keys; deploy is a paste + copy-URL.
  - **Notion** — creates a page in `NOTION_DATABASE_ID` via the Notion API
    (integration token `NOTION_API_KEY`).
  - **Generic webhook** (`WEBHOOK_URL`) — Slack/Discord/Make/Zapier/Telegram.
  - Frontend (`Enrollment.tsx`) POSTs `/api/enrollments` (Vite dev proxy →
    :8425). Success shows instantly; if the API is unreachable the lead is
    queued in localStorage (`academie-pending`) for retry.
  - Notion MCP installed in the Hermes profile (catalog: notion) for
    creating/managing the inquiries database in-session.
- **Dark theme (Batman Studio, this round):** near-black `#0a0a0c` + gold
  `#e5b63e`/`#f0c75e`, Playfair Display display face + Inter/Cairo body,
  cinematic vignette over the photos, gold CTAs/nav/route, dark glass cards
  for the enrollment form. Per-scene accents are gold-family
  (`ScrollWorldFlight.tsx` ACCENTS).
- Foundation committed (main): chunked Vite build, i18n/RTL dir switch, section
  shells with translated placeholder content, lazy-loaded 3D sections.
- **3D built (all original r3f, no photos/video):**
  - Mascot cast (Owlie/Blobby/Pip) + 9-crew parametric builder (`src/crew/`).
  - Hero (Section 1): infinite-runner "Owlie's Playground Run" with the full
    run cycle, 9 greeting stations + RTL Arabic speech bubbles
    (`src/components/RunnerHero.tsx`).
  - World diorama (Section 4): GSAP ScrollTrigger-pinned scroll-driven 3D scene —
    camera dolly, Owlie runs across, crew walk through the park, Blobby/Pip
    background beats, RTL mirroring (`src/components/WorldDiorama.tsx` +
    `src/three/worldState.ts`). Wrapped in an ErrorBoundary so a WebGL failure
    shows the headline + copy, never a blank section.
  - `typecheck` fixed: `tsc --noEmit` (the old `tsc -b --noEmit` threw TS6310).
- **Photo integration (photo round):** real academy photos added by Yahya, edge
  caption/watermark bands auto-trimmed → WebP in `public/images/` + 640px
  versions in `public/images/_3d/` (GPU-cheap for three.js).
  - 2D: new `Gallery` section (all photos, candy polaroid masonry + lightbox,
    AR/FR labels) + About feature photo.
  - 3D: `src/three/PhotoFrame.tsx` + `src/three/PhotoCarousel.tsx` — the photos
    as a slowly rotating ring of floating memory-frames behind the WorldDiorama,
    RTL-aware via `worldScroll.facing`.
- **Scroll-world flight (this round):** THE ENTIRE SITE is now the scroll-world
  flight (github.com/oso95/scroll-world, MIT — vendored at
  `src/vendor/scrub-engine.js`): a scroll-scrubbed camera flight through 7 REAL
  academy photos (one per scene) as the full-viewport landing, with scene copy
  overlays, route dots, topbar nav, topbar CTA + finale CTA → the enrollment
  form (`#contact`). Only Enrollment + Footer follow the flight; About/Programs/
  Gallery/Values/Testimonials components remain in the repo (unreferenced, not
  deleted) for a future multi-section layout.
  - `src/components/ScrollWorldFlight.tsx` mounts the engine (vanilla, drops
    into React via ref), gates its fixed layers to the section (Intersection-
    Observer → `body.sw-flight-active` hides the site header), re-syncs copy/
    nav on language change + re-measures the flight offset (engine `relayout()`),
    and portals the React LanguageSwitcher into the engine topbar.
  - Dive clips: ffmpeg Ken-Burns zoom (1.0→1.22, 6.5 s, 720p H.264 crf24 g8
    faststart, no audio) from each photo → `public/world/vid/dive_N.mp4`
    (7 clips ≈ 17 MB). Reduced-motion: engine skips clips, cross-dissolves stills.
  - Scene copy: `world.scenes` in `src/i18n/locales/{ar,fr}.ts` (7 scenes,
    factual activity labels — no invented claims per the content rule).
- Build policy (locked): Claude Code FORBIDDEN. All 3D coding direct (r3f/three).
- Verification: hands-on render check in AR+FR, RTL+LTR, reduced-motion, mobile
  perf (the headless browser can't paint WebGL — confirm the animation visually
  in a real browser).
