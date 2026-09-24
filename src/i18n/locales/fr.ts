import type { Translation } from './ar'

// French is a first-class locale, not an afterthought.
// Mirrors the FULL Arabic structure exactly; never partial.
export const FR: Translation = {
  nav: {
    home: 'Accueil',
    about: 'À propos',
    programs: 'Programmes',
    world: 'Notre monde',
    values: 'Nos valeurs',
    gallery: 'Nos photos',
    testimonials: 'Témoignages',
    contact: 'Inscription & contact',
  },
  cta: {
    enroll: "Inscrire mon enfant",
    enrollSub: 'سجّل طفلك',
    learnMore: 'En savoir plus',
    whatsapp: "Écrivez-nous sur WhatsApp",
    phone: "Appelez-nous",
  },
  hero: {
    tagline: 'Académie des Enfants Kairouan',
    title1: "Là où l'imagination",
    title2: 'rencontre',
    title3: "l'apprentissage",
    subtitle:
      "Un environnement chaleureux et sûr qui éveille la curiosité et la créativité de votre enfant par le jeu, la découverte et des activités amusantes.",
    scrollHint: 'Faites défiler pour explorer',
  },
  about: {
    title: 'À propos',
    body: "L'Académie des Enfants Kairouan est un espace éducatif qui célèbre l'enfance de chaque enfant. Nous croyons que le vrai apprentissage naît de la curiosité et grandit par le jeu, l'expérience et la chaleur du partage.",
    badgeValue: '☺',
    chip: 'Des sourires, chaque jour',
  },
  programs: {
    title: 'Nos programmes',
    subtitle: 'Des programmes pensés pour chaque tranche d’âge, chacun son petit monde',
    discover: 'Découvrir le programme',
    comingSoon: 'Détails à venir de la direction',
  },
  world: {
    title: 'Le monde de nos héros',
    subtitle: 'Cours de récréation, coin lecture, atelier dessin — suivez les héros qui se déplacent',
    hint: 'Faites défiler pour explorer',
    scenes: [
      {
        label: 'Bienvenue',
        eyebrow: 'Académie des Enfants Kairouan',
        title: 'Un monde pensé pour eux',
        body: "Chaque jour, les enfants grandissent dans un cadre chaleureux et sûr, au cœur de Kairouan.",
        tags: [],
      },
      {
        label: 'Récréation',
        eyebrow: 'La récréation',
        title: 'Jouer, c\u2019est apprendre',
        body: 'Cours de récréation et jeux en plein air : le mouvement fait partie du programme.',
        tags: ['Jeu', 'Plein air'],
      },
      {
        label: 'Histoires',
        eyebrow: 'L\u2019heure du conte',
        title: 'Des histoires qui ouvrent l\u2019esprit',
        body: 'Écouter, imaginer, raconter : un rendez-vous quotidien au coin lecture.',
        tags: ['Lecture', 'Imagination'],
      },
      {
        label: 'Musique',
        eyebrow: 'Éveil musical',
        title: 'La musique fait vibrer la classe',
        body: 'Chansons et rythmes pour éveiller l\u2019oreille et la sensibilité de chaque enfant.',
        tags: ['Musique', 'Éveil'],
      },
      {
        label: 'Arts',
        eyebrow: 'Arts plastiques',
        title: 'Chaque enfant est un artiste',
        body: 'Peinture, dessin, bricolage : la créativité s\u2019exprime à pleines mains.',
        tags: ['Créativité', 'Couleurs'],
      },
      {
        label: 'Bibliothèque',
        eyebrow: 'La bibliothèque',
        title: 'Le goût de la lecture',
        body: 'Un coin calme pour découvrir les livres et grandir à son propre rythme.',
        tags: ['Calme', 'Livres'],
      },
      {
        label: 'Inscription',
        eyebrow: 'Et maintenant ?',
        title: 'Votre enfant a sa place ici',
        body: 'Visitez l\u2019Académie, rencontrez l\u2019équipe et faites connaissance.',
        tags: [],
      },
    ],
  },
  gallery: {
    title: 'Nos photos',
    subtitle: 'Un aperçu de la vie à l’Académie',
    memory: 'Souvenir',
    open: "Agrandir la photo",
    close: 'Fermer',
    lightbox: 'Photo agrandie',
  },
  values: {
    title: 'Pourquoi nous ?',
    items: {
      joy: 'Joie',
      safety: 'Sécurité',
      creativity: 'Créativité',
      growth: 'Épanouissement',
      community: 'Communauté',
      languages: 'Langues',
    },
  },
  testimonials: {
    title: 'Ils en parlent',
    pending: 'En attente de vrais témoignages des familles',
    placeholder:
      "Nous publierons ici les avis réels des parents dès leur arrivée. En attendant, voici des exemples illustrés à titre indicatif.",
  },
  contact: {
    title: 'Inscrire mon enfant',
    subtitle: "Remplissez le formulaire et nous vous contacterons, ou écrivez-nous directement sur WhatsApp",
    form: {
      name: 'Nom du parent',
      childName: "Nom de l'enfant",
      age: 'Tranche d’âge',
      phone: 'Numéro de téléphone',
      message: 'Votre message (optionnel)',
      submit: 'Envoyer la demande',
      success: "Merci ! Nous avons bien reçu votre demande.",
      required: 'Ce champ est obligatoire',
      invalidPhone: 'Veuillez saisir un numéro valide',
    },
  },
  footer: {
    tagline: "Académie des Enfants Kairouan — semons la joie, récoltons l'excellence",
    location: 'Kairouan, Tunisie',
    quickLinks: 'Liens rapides',
    contactUs: 'Contactez-nous',
    rights: 'Tous droits réservés',
  },
}
