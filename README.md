# Académie des Enfants Kairouan

Bilingual (Arabic / French) website for a children's academy and indoor playground in Kairouan, Tunisia. The real playground photos are the star: they float on a 3D ring, lead a scroll-driven tour, and the enrollment flow opens like a magical admission letter.

**Live demo:** https://jryahia.github.io/academie-des-enfants-kairouan/

## Stack

| Layer | Tools |
| --- | --- |
| App | React 18, TypeScript, Vite 5 |
| 3D | Three.js, `@react-three/fiber`, `@react-three/drei` |
| Motion | Framer Motion (scroll-linked scenes, springs, 3D card flips), Lenis smooth scrolling, `canvas-confetti` |
| Styling | Tailwind CSS 3 with a glassmorphism layer (frosted cards over animated colour blobs) |
| i18n | i18next + react-i18next, Arabic (RTL) and French (LTR), document-level `dir` switching |
| Images | sharp (build-time WebP generation) |
| Deploy | GitHub Pages via `gh-pages` |

## Page flow

1. **3D hero**: ten real playground photos in chunky candy-coloured frames ride a ring that spins with scroll and tilts with the pointer, in front of a floating "ball pit" of glossy instanced spheres. Click any frame to open the lightbox.
2. **Playground tour** (`#world`): a sticky, scroll-driven tour in seven scenes. Each photo pops in as a card with a slow Ken Burns zoom while the copy card springs in; side dots jump between scenes.
3. **Programs** and **Values**: frosted-glass cards with icon blobs and spring entrances.
4. **Invitation** (`#contact`): opens the Magic enrollment.
5. **Footer**.

### Magic enrollment

Every "Enroll" button opens a fullscreen night-sky overlay with a floating sealed envelope. Tapping the wax seal folds the flap open in 3D, the letter rises out and unfolds into a gold-foil admission ticket (the form), which greets the child by name as the parent types. On submit the ticket flips over to a welcome card and confetti bursts.

## Brand

- **Logo**: the origami star, five folded arms in the playground colours plus a blue spark. Geometry lives in `src/brand/logo.ts`; the same source renders the React `<LogoMark />` and the base64 SVG favicon that a small Vite plugin injects into `index.html`.
- **Palette**: yellow `#FFD21F`, lime `#8CD62B`, orange `#FF8A1F`, primary blue `#1E63FF`, pink `#FF4FA3`, on cream `#FFF9E8` with navy ink `#13235B`.
- **Type**: Baloo 2 / Baloo Bhaijaan 2 (display, Latin / Arabic), Inter and Cairo (body).
- **Icons**: inline SVG only (`src/components/Icon.tsx`).

## Project structure

```
assets-src/photos/      full-resolution originals (not deployed)
public/photos/          generated WebP (1024px for 3D textures, 1920px for the tour and lightbox)
scripts/                optimize-photos.mjs
src/brand/              logo geometry (shared by React and the favicon plugin)
src/three/              PlaygroundScene: the WebGL photo ring and ball pit (code-split)
src/components/         sections, SiteNav, GlowButton, PhotoLightbox, MagicEnrollment
src/data/               photo list, contact links
src/lib/                smooth scroll, enrollment submission
src/i18n/locales/       ar.ts, fr.ts (French mirrors the Arabic structure exactly)
backend/                optional enrollment API (FastAPI)
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173/academie-des-enfants-kairouan/
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Adding or replacing a photo: drop the original into `assets-src/photos/`, then run `npm run photos` to regenerate the WebP files in `public/photos/`.

## Deploy (GitHub Pages)

```bash
npm run deploy     # builds, then publishes dist/ to the gh-pages branch
```

In the repository settings, set **Pages > Source** to the `gh-pages` branch. The site is served from `/academie-des-enfants-kairouan/`, set by `base` in `vite.config.ts`. To host at a domain root instead, set `base: '/'`.

## Enrollment backend

The form POSTs to `/api/enrollments`. If the API is unreachable, the submission is kept in the visitor's browser (`localStorage` key `academie-pending`) and the parent still sees the success screen.

- **GitHub Pages demo**: static hosting, so there is no API and submissions stay local. The full visual flow works.
- **Production**: run `backend/main.py` (FastAPI, port 8425). It fans each submission out to every configured channel (Google Sheets and Gmail through an Apps Script web app, Notion, any JSON webhook) and always appends a local JSONL log. Copy `backend/.env.example` to `backend/.env` to configure. In development, Vite proxies `/api` to the backend.

## Accessibility and performance

- Full RTL mirroring in Arabic, including motion direction, lightbox arrows and layout.
- `prefers-reduced-motion`: no smooth scrolling, no ring or confetti; a static photo mosaic replaces the 3D hero.
- WebGL unavailable or crashing: the same mosaic fallback via an error boundary.
- The WebGL bundle is lazy-loaded and its render loop pauses offscreen and while overlays are open.
- Touch targets are at least 44px, with no horizontal overflow from 320px up.
- Strict Content-Security-Policy in `public/_headers` (for hosts that read it, such as Cloudflare Pages).

## Content note

The program age groups, activity lists, value descriptions and the safety wording in the tour are draft copy, to be confirmed with the academy's management before launch.
