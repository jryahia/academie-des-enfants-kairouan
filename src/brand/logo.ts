/* =========================================================================
  Brand mark: the "origami star".
  A five-armed star folded from paper: every arm is two facets (light and
  shade) in one playground colour, plus a small blue spark. Pure geometry,
  no external assets, so the SAME source renders the React logo and the
  base64 favicon that vite.config.ts injects into index.html.
  Keep this file free of browser/React imports (vite.config.ts imports it).
  ========================================================================= */

export interface Facet {
  points: string
  fill: string
}

const ARMS: Array<[light: string, shade: string]> = [
  ['#FFD21F', '#F2AE00'], // yellow (top)
  ['#FF8A1F', '#E2620A'], // orange
  ['#FF4FA3', '#D9307F'], // pink
  ['#1E63FF', '#1240C2'], // blue
  ['#8CD62B', '#5EA612'], // lime
]

const CX = 32
const CY = 34
const OUTER = 28
const INNER = 12.5

const r2 = (n: number) => Math.round(n * 100) / 100
const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180
  return [r2(CX + r * Math.cos(a)), r2(CY + r * Math.sin(a))]
}

/** Ten triangles: for each arm, centre-to-tip split into a light and a shade facet. */
export const STAR_FACETS: Facet[] = ARMS.flatMap(([light, shade], i) => {
  const tip = polar(OUTER, i * 72)
  const left = polar(INNER, i * 72 - 36)
  const right = polar(INNER, i * 72 + 36)
  const c = `${CX},${CY}`
  return [
    { points: `${c} ${left.join(',')} ${tip.join(',')}`, fill: light },
    { points: `${c} ${tip.join(',')} ${right.join(',')}`, fill: shade },
  ]
})

/** Four-point spark, top right of the star. */
export const SPARK_PATH = 'M54 4.5c.6 3.6 1.9 4.9 5.5 5.5-3.6.6-4.9 1.9-5.5 5.5-.6-3.6-1.9-4.9-5.5-5.5 3.6-.6 4.9-1.9 5.5-5.5z'
export const SPARK_FILL = '#1E63FF'

export const LOGO_VIEWBOX = '0 0 64 64'

/** Standalone SVG markup, used for the favicon. */
export function logoSvgString({ background = true } = {}): string {
  const facets = STAR_FACETS.map(
    (f) => `<polygon points="${f.points}" fill="${f.fill}" stroke="${f.fill}" stroke-width="1.6" stroke-linejoin="round"/>`,
  ).join('')
  const bg = background ? '<rect width="64" height="64" rx="16" fill="#FFF9E8"/>' : ''
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}">` +
    bg +
    facets +
    `<path d="${SPARK_PATH}" fill="${SPARK_FILL}"/>` +
    '</svg>'
  )
}

/** base64 data URI (markup is pure ASCII, so btoa is safe in Node and browsers). */
export function logoDataUri(): string {
  return `data:image/svg+xml;base64,${btoa(logoSvgString())}`
}
