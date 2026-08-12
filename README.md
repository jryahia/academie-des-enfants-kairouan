# Académie des Enfants Kairouan — 100% Animated 3D Website

Premium, animation-driven marketing site for a children's academy in Kairouan, Tunisia.
**No real photos/video anywhere** — every visual is original 3D (r3f) or 2D
illustration/Lottie/CSS animation.

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
- Foundation committed (main): chunked Vite build, i18n/RTL dir switch, section
  shells with translated placeholder content, useDeviceQuality hook
  (reduced-motion + low-power fallback), lazy-loaded 3D sections.
- **Build policy (locked): Claude Code is FORBIDDEN. OpenCode is on hold
  (0 credentials, no DeepSeek key handy). All 3D coding is done directly
  (r3f/three) by Codex.** Build only with a tool Yahya explicitly approves at
  build time.
- Next: build 3D character system (Owlie, Blobby, Pip), then Hero scene,
  World diorama, programs icons, values, testimonial avatars, enrollment
  celebration.
- Verification: hands-on render check in AR+FR, RTL+LTR, reduced-motion, mobile perf.
