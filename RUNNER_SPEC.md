# INFINITE RUNNER HERO — "Owlie's Playground Run" (Spacetoon-inspired)

## Concept
The hero (Section 1) is an endless runner game scene. **Owlie runs continuously
in one direction along a moving playground ground** (a boucle/loop that repeats
forever). Along the track are **9 stations**, each with its own anime-style
companion in original style-homage form (NOT copyrighted IP). As Owlie passes
each station, the companion pops in playfully and greets him with a **short,
pretty Arabic phrase for kids** (speech bubble). The loop repeats; each cycle
the same 9 greetings. Behind everything, a colorful Spacetoon-inspired candy
world scrolls past. Bright, warm, high-energy, kid-safe.

Colors take inspiration from **SpaceToon** (the beloved Arabic cartoon channel):
vivid yet soft — sunny sky blue background, warm cream clouds, sunny yellow,
mandarin orange, fresh green grass, candy pink accents, soft violet. NEVER harsh
neon; keep it warm and friendly.

## The 9 crew (original style-homages — evocative, not copies)
| # | Theme | Vibes like | Character (original) | Arabic greeting (kids) | FR greeting |
|---|-------|-----------|----------------------|------------------------|-------------|
| 1 | Straw-Hat Rubber Pirate | Luffy vibe | "بُحار" Bahr (rubber-stretch hero) | «أهلاً يا صديقي! أحلامنا بدأت بالبحر الكبير» | "Bienvenue mon ami ! Nos rêves commencent par la mer" |
| 2 | Spiky Energy Martial Kid | Goku vibe | "نجم" Najm (golden energy aura) | «كن قوياً وابتسم، فأنت نجم!» | "Sois fort et souris, tu es une étoile !" |
| 3 | Jungle Fishing Boy | Gon vibe | "غابة" Ghaba (fishing rod + nature) | «الطبيعة صديقة الإنسان، اكتشفها!» | "La nature est ton amie, découvre-la !" |
| 4 | Sunny Square Sponge Kid | SpongeBob vibe | "إسفنج" Isfangeh (square yellow + waves) | «الضحك جميل في حوض المنزل!» | "Le rire est beau sous la mer !" |
| 5 | Watch-Teen Transforming Hero | Ben 10 vibe | "ساعة" Sa'a (special watch, alien silhouettes) | «بالشجاعة تتحقق كل المغامرات» | "Le courage réalise toutes les aventures" |
| 6 | Sci-Fi Space Cat | stylish space friend | "قط" Qott (astronaut cat) | «النجوم تنادي، هيا نسافر!» | "Les étoiles nous appellent, voyageons !" |
| 7 | Candy Fairy / Magic Pencil | whimsical magic | "ريشة" Risha (drawing that comes alive) | «بألوانك ترسم أحلاماً جميلة» | "Avec tes couleurs, dessine de beaux rêves" |
| 8 | Friendly Little Robot | lovable bot | "روبوت" Robot (big heart, gears) | «العلم يبني لنا مستقبل أجمل» | "La science nous construit un plus bel avenir" |
| 9 | Dragon-Star Power Hero | DragonBall energy | "تنّين" Tennin (friendly dragon spark) | «همّتك مثل التنين، لا شيء يوقفك!» | "Ta volonté est un dragon, rien ne t'arrête !" |

Station 9 → wraps back to station 1 (the boucle).

## Runner mechanics
- Owlie reuses his `run` cycle from the character system, running along +X.
- The **ground tiles** scroll continuously (moving the track, Owlie visually
  progresses but stays centered-ish — classic endless runner).
- Each station is placed at an interval along the loop; Owlie passes it, the
  companion does a quick bouncy entrance + waves, a speech bubble appears with
  the Arabic phrase and stays a moment, then fades as he runs on.
- Background parallax: far hills/clouds scroll slower than the midground
  playground, so depth reads.
- On `prefers-reduced-motion` / low-power: static strip with stations standing,
  no endless scroll (calm but complete); speech still shows in sequence.

## 3 signature movements (across the site)
1. **Runner loop** — this hero (section 1).
2. **Scroll transition run** — Owlie (or a crew member) runs across between
   sections during scroll (reuses run cycle).
3. **World diorama** — crew walks through a playground/classroom diorama as the
   user scrolls (GSAP ScrollTrigger scrub).

## Build order
1. candy palette + fonts (tailwind) — DONE
2. design tokens + this spec — here
3. 9 crew character components (src/crew/) 
4. runner ground/background layers
5. RunnerHero component (section 1) — infinite loop + speech bubbles + i18n
6. wire into App as section 1; restyle whole site to candy light theme
7. verify AR+RTL (speech bubbles RTL), FR+LTR, reduced-motion, mobile perf
