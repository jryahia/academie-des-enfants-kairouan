import type { ReactElement } from 'react'
import type { CrewKidSpec } from './CrewKid'
import './../three/ToonMaterial'

/* =========================================================================
   9 CREW COMPANIONS — original style-homages (evocative, NOT copyrighted IP)
   Each: a parametric CrewKid spec + accessories + Arabic/French greeting.
   ========================================================================= */

// Small helpers to build accessory meshes (mounted on the wave hand)
const Mat = ({
  top,
  bottom,
  fres = 0.3,
}: {
  top: string
  bottom: string
  fres?: number
}) => <softToonMaterial colorTop={top} colorBottom={bottom} fresnel={fres} />

function strawHat(): ReactElement {
  return (
    <group position={[0.09, -0.12, 0]}>
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.16, 0.07, 14, 1, false, 0, Math.PI]} />
        <Mat top="#f2a33c" bottom="#c67a1e" />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <torusGeometry args={[0.16, 0.03, 10, 20]} />
        <Mat top="#e8a13a" bottom="#b26e1c" />
      </mesh>
    </group>
  )
}

function fishingRod(): ReactElement {
  return (
    <group position={[0.2, -0.1, 0]} rotation={[0, 0, -0.5]}>
      <mesh position={[0.1, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <Mat top="#8a6a3a" bottom="#6b4f26" />
      </mesh>
      <mesh position={[-0.02, 0.05, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <Mat top="#c9a85c" bottom="#a0833f" />
      </mesh>
    </group>
  )
}

function magicPencil(): ReactElement {
  return (
    <group position={[0.12, -0.06, 0]} rotation={[0, 0, 0.3]}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.025, 0.45, 8]} />
        <Mat top="#f5c518" bottom="#e0a91c" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.02, 0.09, 8]} />
        <Mat top="#ff7bb0" bottom="#d9558a" />
      </mesh>
      <mesh position={[0.02, 0.12, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <Mat top="#b07bf0" bottom="#8a5ad4" />
      </mesh>
      {/* sparkle */}
      <mesh position={[0.06, 0.16, 0]}>
        <octahedronGeometry args={[0.06]} />
        <Mat top="#ffd23f" bottom="#f0a91c" fres={0.4} />
      </mesh>
    </group>
  )
}

function spyWatch(): ReactElement {
  return (
    <group position={[0.02, -0.02, 0]}>
      <mesh>
        <torusGeometry args={[0.06, 0.025, 8, 16]} />
        <Mat top="#2fbfb0" bottom="#1f8f84" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
        <Mat top="#4be0a2" bottom="#2aa86f" />
      </mesh>
    </group>
  )
}

function rocketGadget(): ReactElement {
  return (
    <group position={[0.06, -0.04, 0]} rotation={[0, 0, -0.4]}>
      <mesh>
        <coneGeometry args={[0.03, 0.16, 8]} />
        <Mat top="#f4793a" bottom="#c2502a" />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.1, 8]} />
        <Mat top="#8a96c2" bottom="#6a75a0" />
      </mesh>
      {/* flame */}
      <mesh position={[0, -0.17, 0]}>
        <coneGeometry args={[0.02, 0.09, 6]} />
        <Mat top="#ffd23f" bottom="#ff9a3c" fres={0.4} />
      </mesh>
    </group>
  )
}

function bookGadget(): ReactElement {
  return (
    <group position={[0.06, -0.04, 0]} rotation={[0, 0, 0.1]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.16]} />
        <Mat top="#e5744f" bottom="#a8432b" />
      </mesh>
    </group>
  )
}

// =========================================================================
//  THE 9
// =========================================================================

export interface CrewMember {
  key: string
  name: string
  labelAr: string
  labelFr: string
  greetingAr: string
  greetingFr: string
  spec: CrewKidSpec
}

export const CREW: CrewMember[] = [
  {
    key: 'bahr',
    name: 'Bahr',
    labelAr: 'بحّار',
    labelFr: 'Bahr',
    greetingAr: 'أهلاً يا صديقي! أحلامنا تبدأ بالبحر الكبير',
    greetingFr: 'Bienvenue ami ! Nos rêves commencent par la mer',
    spec: {
      name: 'bahr',
      skin: '#f2c89a',
      shirt: '#e0513f',
      pants: '#3a6fa8',
      hair: { color: '#2e2a26', base: '#1e1a18', style: 'slick' },
      mouth: 'grin',
      accessory: strawHat(),
    },
  },
  {
    key: 'najm',
    name: 'Najm',
    labelAr: 'نجم',
    labelFr: 'Najm',
    greetingAr: 'كن قوياً وابتسم، فأنت نجم!',
    greetingFr: 'Sois fort et souris, tu es une étoile !',
    spec: {
      name: 'najm',
      skin: '#f2c89a',
      shirt: '#f5c518',
      pants: '#f4793a',
      hair: { color: '#f5c518', base: '#d9a814', style: 'spiky' },
      mouth: 'grin',
    },
  },
  {
    key: 'ghaba',
    name: 'Ghaba',
    labelAr: 'غابة',
    labelFr: 'Ghaba',
    greetingAr: 'الطبيعة صديقة الإنسان، اكتشفها!',
    greetingFr: 'La nature est ton amie, découvre-la !',
    spec: {
      name: 'ghaba',
      skin: '#eabf8e',
      shirt: '#3fbf77',
      pants: '#2e9a5d',
      hair: { color: '#2e2a26', base: '#1e1a18', style: 'pixie' },
      mouth: 'smile',
      accessory: fishingRod(),
    },
  },
  {
    key: 'isfangeh',
    name: 'Isfangeh',
    labelAr: 'إسفنجة',
    labelFr: 'Isfangeh',
    greetingAr: 'الضحك جميل في أعماق البحر!',
    greetingFr: 'Le rire est beau au fond de la mer !',
    spec: {
      name: 'isfangeh',
      skin: '#ffd93d',
      shirt: '#ffffff',
      pants: '#c9a227',
      hair: { color: '#e6b800', base: '#c9a227', style: 'flat' },
      mouth: 'grin',
    },
  },
  {
    key: 'saa',
    name: 'Sa\u02bda',
    labelAr: 'ساعة',
    labelFr: 'Sa\u02bda',
    greetingAr: 'بالشجاعة تتحقق كل المغامرات',
    greetingFr: 'Le courage réalise toutes les aventures',
    spec: {
      name: 'saa',
      skin: '#f2c89a',
      shirt: '#3a4a8f',
      pants: '#2fbfb0',
      hair: { color: '#3a2f4a', base: '#2a203a', style: 'bowl' },
      mouth: 'cool',
      accessory: spyWatch(),
    },
  },
  {
    key: 'qott',
    name: 'Qott',
    labelAr: 'قطّ',
    labelFr: 'Qott',
    greetingAr: 'النجوم تنادي، هيا نسافر!',
    greetingFr: "Les étoiles nous appellent, voyageons !",
    spec: {
      name: 'qott',
      skin: '#f4cba0',
      shirt: '#4a8fe7',
      pants: '#8a96c2',
      hair: { color: '#4a8fe7', base: '#3a74c5', style: 'bowl' },
      mouth: 'smile',
      accessory: rocketGadget(),
    },
  },
  {
    key: 'risha',
    name: 'Risha',
    labelAr: 'ريشة',
    labelFr: 'Risha',
    greetingAr: 'بألوانك ترسم أحلاماً جميلة',
    greetingFr: 'Avec tes couleurs, dessine de beaux rêves',
    spec: {
      name: 'risha',
      skin: '#f2c89a',
      shirt: '#ff7bb0',
      pants: '#b07bf0',
      hair: { color: '#f5c518', base: '#e0a91c', style: 'curly' },
      mouth: 'smile',
      accessory: magicPencil(),
    },
  },
  {
    key: 'robotik',
    name: 'Robotik',
    labelAr: 'روبوت',
    labelFr: 'Robotik',
    greetingAr: 'العلم يبني لنا مستقبل أجمل',
    greetingFr: 'La science nous construit un plus bel avenir',
    spec: {
      name: 'robotik',
      skin: '#8a96c2',
      shirt: '#5a6a96',
      pants: '#4a5a86',
      hair: { color: '#8a96c2', base: '#6a75a0', style: 'bowl' },
      mouth: 'cool',
      accessory: bookGadget(),
    },
  },
  {
    key: 'tennin',
    name: 'Tennin',
    labelAr: 'تنّين',
    labelFr: 'Tennin',
    greetingAr: 'همّتك مثل التنين، لا شيء يوقفك!',
    greetingFr: "Ta volonté est un dragon, rien ne t'arrête !",
    spec: {
      name: 'tennin',
      skin: '#f2c89a',
      shirt: '#f4793a',
      pants: '#c2502a',
      hair: { color: '#f4793a', base: '#c2502a', style: 'spiky' },
      mouth: 'grin',
    },
  },
]

export const STATION_COUNT = CREW.length // 9
