import { useTranslation } from 'react-i18next'

// Signature scroll-driven 3D diorama (GSAP ScrollTrigger + camera/character
// movement) is a later build. This is the scaffold shell (candy themed).
export default function WorldExperience() {
  const { t } = useTranslation()
  return (
    <section id="world" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient">
          {t('world.title')}
        </h2>
        <p className="mt-3 text-candy-ink/60">{t('world.subtitle')}</p>
      </div>
      {/* GSAP ScrollTrigger pins/stages the 3D world here */}
      <div
        className="mt-10 aspect-[16/9] max-w-5xl mx-auto glass rounded-3xl overflow-hidden"
        data-scroll-world
        aria-label="3D diorama"
      >
        <div className="h-full w-full flex items-center justify-center text-6xl" aria-hidden>
          🌍
        </div>
      </div>
    </section>
  )
}
