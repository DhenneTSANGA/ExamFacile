export function buildLessonContent(title: string, duration: number) {
  return {
    readingTime: Math.round(duration / 2),
    intro: `Bienvenue dans le chapitre « ${title} ». Dans cette leçon, nous explorerons les notions fondamentales qui vous aideront à maîtriser ce thème pour votre baccalauréat.`,
    sections: [
      {
        heading: "Introduction",
        body: `« ${title} » est l'un des thèmes les plus importants du programme. Bien le comprendre vous donnera une base solide pour aborder les épreuves du bac avec confiance.`,
        sortOrder: 0,
      },
      {
        heading: "Notions clés",
        body: `Les principes essentiels de « ${title} » s'articulent autour de trois idées : la définition, l'application et le raisonnement.`,
        sortOrder: 1,
      },
      {
        heading: "Exemple résolu",
        body: `Prenons un problème type : identifiez la structure, appliquez la méthode adaptée, puis vérifiez le résultat.`,
        sortOrder: 2,
      },
      {
        heading: "Pièges fréquents",
        body: "Les élèves vont souvent trop vite et perdent des points sur de petites erreurs. Prenez votre temps et vérifiez chaque étape.",
        sortOrder: 3,
      },
    ],
    summary: `« ${title} » devient simple une fois la méthode bien assimilée. 5 questions de quiz par jour pendant une semaine et vous verrez une nette progression.`,
  };
}

export function buildStudyGuideContent(title: string) {
  return {
    keyConcepts: [
      `« ${title} » se définit comme une démarche structurée de résolution de problèmes.`,
      `Formule ou principe central : s'applique à 90 % des questions classiques du bac.`,
      `Les variantes de « ${title} » apparaissent dans plusieurs matières.`,
    ],
    examTips: [
      "Lisez chaque énoncé deux fois avant de commencer.",
      "Accordez 1 à 2 minutes par question à choix multiple.",
      "Éliminez d'abord les options manifestement fausses.",
    ],
    commonMistakes: [
      "Sauter l'étape de mise en équation pour foncer sur la formule.",
      "Confondre des définitions proches mais distinctes.",
    ],
    importantFacts: [
      `« ${title} » apparaît généralement dans 2 à 3 questions du bac national.`,
      "La maîtrise vient d'une pratique quotidienne régulière.",
    ],
    definitions: [
      { term: title, definition: `L'étude systématique et l'application des principes de « ${title.toLowerCase()} ».`, sortOrder: 0 },
      { term: "Méthode", definition: "Un processus reproductible, étape par étape, pour parvenir à la bonne réponse.", sortOrder: 1 },
    ],
  };
}

export function buildQuizQuestions(title: string) {
  return Array.from({ length: 10 }, (_, i) => ({
    question: `Question ${i + 1} : quelle affirmation sur « ${title} » est correcte ?`,
    options: [
      `${title} — option A : une définition précise`,
      `${title} — option B : une vérité partielle`,
      `${title} — option C : une erreur fréquente`,
      `${title} — option D : une idée hors-sujet`,
    ],
    correctIndex: i % 4,
    explanation: `La bonne réponse illustre le principe fondamental de « ${title} ».`,
    sortOrder: i,
  }));
}
