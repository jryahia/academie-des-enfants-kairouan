/* Real photos of the academy's indoor playground.
 * Originals live in assets-src/photos; `npm run photos` writes WebP copies to
 * public/photos at 1024px (3D textures, phones) and 1920px (journey, lightbox).
 * Ring order interleaves landscape and portrait shots so the 3D ring reads
 * balanced; `alt` indexes into the `playground.alts` locale array. */

export const PLAY_COLORS = {
  yellow: '#FFD21F',
  lime: '#8CD62B',
  orange: '#FF8A1F',
  blue: '#1E63FF',
  pink: '#FF4FA3',
} as const

const FRAME_CYCLE = [PLAY_COLORS.yellow, PLAY_COLORS.blue, PLAY_COLORS.lime, PLAY_COLORS.orange]

export const PHOTO_SIZES = [1024, 1920] as const

export interface PlaygroundPhoto {
  /** file stem, e.g. `playground-07` */
  name: string
  /** 1024px WebP: 3D textures and thumbnails */
  src: string
  /** responsive set for large <img> usage */
  srcSet: string
  /** width / height */
  aspect: number
  frame: string
  alt: number
}

const PORTRAIT = 912 / 1974
const LANDSCAPE = 2048 / 946

const ORDER: Array<[number, number]> = [
  [7, LANDSCAPE],
  [2, PORTRAIT],
  [8, LANDSCAPE],
  [3, PORTRAIT],
  [9, LANDSCAPE],
  [4, PORTRAIT],
  [10, LANDSCAPE],
  [5, PORTRAIT],
  [11, LANDSCAPE],
  [6, PORTRAIT],
]

// BASE_URL keeps photos working when the site is served from a sub-path
// (GitHub Pages: /repo-name/), and is '/' everywhere else.
const photoUrl = (name: string, size: number) => `${import.meta.env.BASE_URL}photos/${name}-${size}.webp`

export const PLAYGROUND_PHOTOS: PlaygroundPhoto[] = ORDER.map(([n, aspect], i) => {
  const name = `playground-${String(n).padStart(2, '0')}`
  return {
    name,
    src: photoUrl(name, 1024),
    srcSet: PHOTO_SIZES.map((s) => `${photoUrl(name, s)} ${aspect >= 1 ? s : Math.round(s * aspect)}w`).join(', '),
    aspect,
    frame: FRAME_CYCLE[i % FRAME_CYCLE.length],
    alt: n - 2,
  }
})

/** Look a photo up by its original number (2 to 11). */
export const photoByNumber = (n: number) =>
  PLAYGROUND_PHOTOS.find((p) => p.name === `playground-${String(n).padStart(2, '0')}`)!
