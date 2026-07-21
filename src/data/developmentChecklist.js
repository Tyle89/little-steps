// Référentiel des jalons de développement, organisé par tranche d'âge.
// minDays/maxDays permettent de repérer automatiquement la tranche
// correspondant à l'âge actuel de l'enfant.

export const developmentChecklist = [
  {
    id: '0-3m',
    label: '0 à 3 mois',
    minDays: 0,
    maxDays: 91,
    categories: {
      motricite: [
        'Soulève brièvement la tête en position sur le ventre',
        'Bouge bras et jambes de façon assez symétrique',
        'Serre un doigt ou un petit objet placé dans sa main'
      ],
      langage: [
        'Réagit aux voix et aux bruits familiers',
        'Pleure différemment selon ses besoins (faim, fatigue...)',
        'Produit de petits sons (gazouillis, roucoulements)'
      ],
      physique: [
        'Suit un visage ou un objet du regard',
        'Porte ses mains à sa bouche',
        'Réagit à la lumière et aux contrastes'
      ],
      social: [
        'Fixe les visages, surtout celui d’un parent',
        'Sourit en réponse à un sourire (sourire social)',
        'Se calme au son d’une voix connue'
      ]
    }
  },
  {
    id: '3-6m',
    label: '3 à 6 mois',
    minDays: 91,
    maxDays: 182,
    categories: {
      motricite: [
        'Tient sa tête droite sans soutien',
        'Se retourne du ventre vers le dos (ou l’inverse)',
        'Attrape volontairement un objet à sa portée'
      ],
      langage: [
        'Rit aux éclats',
        'Babille avec des sons répétés (« ba-ba », « da-da »)',
        'Tourne la tête vers une source de son'
      ],
      physique: [
        'Porte les objets à sa bouche pour les explorer',
        'Pousse sur ses jambes en position debout soutenue',
        'Commence à s’asseoir avec appui'
      ],
      social: [
        'Reconnaît les visages familiers',
        'Manifeste de la joie à l’arrivée d’un parent',
        'Aime les jeux simples type coucou-caché'
      ]
    }
  },
  {
    id: '6-12m',
    label: '6 à 12 mois',
    minDays: 182,
    maxDays: 365,
    categories: {
      motricite: [
        'S’assoit seul sans appui',
        'Se déplace à quatre pattes ou en rampant',
        'Se met debout en s’aidant d’un meuble'
      ],
      langage: [
        'Comprend son prénom',
        'Prononce une ou deux « premières syllabes » avec sens (« maman »)',
        'Réagit à des mots simples comme « non »'
      ],
      physique: [
        'Utilise la pince pouce-index pour saisir un petit objet',
        'Mange des morceaux avec les doigts',
        'Passe un objet d’une main à l’autre'
      ],
      social: [
        'Manifeste une angoisse face aux inconnus',
        'Joue à donner/reprendre un objet',
        'Imite des gestes simples (au revoir, applaudir)'
      ]
    }
  },
  {
    id: '1-2a',
    label: '1 à 2 ans',
    minDays: 365,
    maxDays: 730,
    categories: {
      motricite: [
        'Marche seul',
        'Monte des escaliers en se tenant à la rampe',
        'Empile 2 à 3 cubes'
      ],
      langage: [
        'Dit une dizaine de mots ou plus',
        'Associe deux mots ensemble ("encore lait")',
        'Montre du doigt ce qu’il désire'
      ],
      physique: [
        'Boit seul dans un verre',
        'Commence à utiliser une cuillère',
        'Gribouille avec un crayon'
      ],
      social: [
        'Imite les activités des adultes (balayer, téléphoner)',
        'Montre de l’affection spontanément',
        'Commence à jouer à côté d’autres enfants (jeu parallèle)'
      ]
    }
  },
  {
    id: '2-3a',
    label: '2 à 3 ans',
    minDays: 730,
    maxDays: 1095,
    categories: {
      motricite: [
        'Court sans trop de difficulté',
        'Tape dans un ballon',
        'Monte et descend les escaliers seul, marche après marche'
      ],
      langage: [
        'Fait des phrases de 2-3 mots',
        'Se fait comprendre par des proches',
        'Pose des questions simples ("Où ?")'
      ],
      physique: [
        'Se lave et s’essuie les mains avec de l’aide',
        'Enfile des vêtements simples',
        'Tourne les pages d’un livre une par une'
      ],
      social: [
        'Commence à jouer avec d’autres enfants, pas juste à côté',
        'Exprime un large éventail d’émotions',
        'Traverse des phases d’opposition ("non !")'
      ]
    }
  },
  {
    id: '3-4a',
    label: '3 à 4 ans',
    minDays: 1095,
    maxDays: 1460,
    categories: {
      motricite: [
        'Pédale sur un tricycle',
        'Saute à pieds joints',
        'Attrape une grosse balle avec les deux bras'
      ],
      langage: [
        'Raconte une histoire simple',
        'Utilise des phrases de 4-5 mots',
        'Est compris par des personnes extérieures à la famille'
      ],
      physique: [
        'S’habille presque seul',
        'Utilise des ciseaux à bouts ronds',
        'Dessine un cercle'
      ],
      social: [
        'Joue à des jeux de rôle et d’imagination',
        'Négocie et partage parfois avec d’autres enfants',
        'Comprend et suit des règles simples'
      ]
    }
  },
  {
    id: '4-5a',
    label: '4 à 5 ans',
    minDays: 1460,
    maxDays: 1825,
    categories: {
      motricite: [
        'Saute à cloche-pied',
        'Fait du vélo avec petites roues',
        'Attrape une balle rebondie'
      ],
      langage: [
        'Raconte une histoire avec un début et une fin',
        'Connaît son nom complet et son âge',
        'Pose beaucoup de « pourquoi »'
      ],
      physique: [
        'S’habille et se déshabille seul',
        'Dessine une personne avec plusieurs parties du corps',
        'Utilise correctement une fourchette'
      ],
      social: [
        'Préfère jouer avec d’autres enfants plutôt que seul',
        'Comprend et respecte son tour dans un jeu',
        'Montre de l’empathie envers un enfant qui pleure'
      ]
    }
  },
  {
    id: '5-6a',
    label: '5 à 6 ans',
    minDays: 1825,
    maxDays: 2190,
    categories: {
      motricite: [
        'Fait du vélo sans petites roues (ou est en apprentissage)',
        'Saute à la corde',
        'Grimpe avec aisance sur des structures de jeu'
      ],
      langage: [
        'Construit des phrases complexes',
        'Reconnaît certaines lettres ou son prénom écrit',
        'Raconte un évènement récent de façon cohérente'
      ],
      physique: [
        'S’habille complètement seul, y compris les boutons',
        'Écrit certaines lettres de son prénom',
        'Utilise correctement des couverts'
      ],
      social: [
        'Joue selon des règles avec d’autres enfants',
        'Gère mieux la frustration',
        'Montre de l’autonomie dans les tâches simples du quotidien'
      ]
    }
  }
]