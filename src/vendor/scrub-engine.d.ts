/* Minimal types for the vendored scroll-world scrub engine (vanilla JS;
   appended ESM export: `export { mountScrollWorld }`). */
export interface ScrollWorldCtaBtn {
  label: string
  href: string
}
export interface ScrollWorldSection {
  id: string
  label: string
  still?: string
  stillMobile?: string
  clip?: string
  clipMobile?: string
  accent?: string
  scroll?: number
  linger?: number
  eyebrow?: string
  title?: string
  body?: string
  tags?: string[]
  cta?: { primary?: ScrollWorldCtaBtn; secondary?: ScrollWorldCtaBtn }
}
export interface ScrollWorldConfig {
  brand?: { name: string; href?: string }
  cta?: ScrollWorldCtaBtn
  hint?: string
  nav?: boolean
  atmosphere?: boolean
  diveScroll?: number
  connScroll?: number
  crossfade?: number
  sections: ScrollWorldSection[]
  connectors?: (string | null)[]
  connectorsMobile?: (string | null)[]
}
export declare function mountScrollWorld(
  container: HTMLElement,
  config: ScrollWorldConfig,
): { relayout(): void; destroy(): void }
