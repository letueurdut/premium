export interface CatalogTask {
  id: string;
  title: string;
  description: string;
  type: 'regular' | 'punishment';
  category: string;
  icon: string;
}

export const catalogTasks: CatalogTask[] = [
  {
    id: 'cat-1',
    title: '100 lignes de discipline',
    description: 'Copie 100 fois la phrase imposée à la main, sans ratures. Photo de chaque page remplie exigée. Écriture soignée obligatoire — toute faute annule la ligne.',
    type: 'punishment',
    category: 'Écriture',
    icon: '📝',
  },
  {
    id: 'cat-2',
    title: 'Photo en position de soumission',
    description: 'Prends 3 photos dans la position dictée. Tenue imposée, cadrage précis, expression neutre. Les photos floues ou mal cadrées seront refusées.',
    type: 'regular',
    category: 'Photo',
    icon: '📸',
  },
  {
    id: 'cat-3',
    title: 'Rapport vocal de 3 minutes',
    description: 'Enregistre-toi en train d\'expliquer pourquoi tu mérites ta punition. Voix claire, pas d\'hésitation, 3 minutes minimum. Débit lent et articulé.',
    type: 'punishment',
    category: 'Audio',
    icon: '🎙️',
  },
  {
    id: 'cat-4',
    title: 'Session sportive extrême',
    description: '200 squats + 100 pompes + 50 burpees. Vidéo complète sans coupure exigée. Le chronomètre doit être visible à l\'écran.',
    type: 'punishment',
    category: 'Physique',
    icon: '💪',
  },
  {
    id: 'cat-5',
    title: 'Ménage intégral — inspection',
    description: 'Nettoie la pièce désignée de fond en comble. 10 photos détaillées sous tous les angles. La poussière, les traces ou le désordre = tâche échouée.',
    type: 'regular',
    category: 'Tâche',
    icon: '🧹',
  },
  {
    id: 'cat-6',
    title: 'Tenue imposée — défilé photo',
    description: 'Porte la tenue dictée. 5 photos : face, profil, dos, gros plan, posture libre. Aucun vêtement supplémentaire autorisé.',
    type: 'regular',
    category: 'Photo',
    icon: '👗',
  },
  {
    id: 'cat-7',
    title: 'Privation numérique',
    description: 'Pas d\'écran, pas de réseau social, pas de jeu vidéo pendant la durée imposée. Un selfie toutes les heures pour prouver que tu es loin de tout écran.',
    type: 'punishment',
    category: 'Restriction',
    icon: '🚫',
  },
  {
    id: 'cat-8',
    title: 'Essai de réflexion personnelle',
    description: 'Rédige 1000 mots sur le thème imposé. Structure : introduction, développement en 3 parties, conclusion. Orthographe et grammaire irréprochables.',
    type: 'regular',
    category: 'Écriture',
    icon: '✍️',
  },
  {
    id: 'cat-9',
    title: 'Check-in horaire — 6 heures',
    description: 'Envoie un selfie + localisation + phrase de soumission toutes les heures pendant 6 heures. Tout retard de plus de 5 minutes = tâche échouée.',
    type: 'punishment',
    category: 'Check-in',
    icon: '⏰',
  },
  {
    id: 'cat-10',
    title: 'Recherche et rapport détaillé',
    description: 'Effectue une recherche approfondie sur le sujet imposé. Rapport de 1500 mots avec sources. Présentation soignée, format PDF. Délai : 48h.',
    type: 'regular',
    category: 'Recherche',
    icon: '🔍',
  },
];

export const categories = catalogTasks.map(t => t.category).filter((v, i, a) => a.indexOf(v) === i);