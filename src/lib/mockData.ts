import { BookOpen, Brain, Languages, Globe2, type LucideIcon } from "lucide-react";

export type User = {
  name: string;
  email: string;
  level: number;
  series: string;
  points: number;
  streak: number;
  quizCompleted: number;
  avatar: string;
};

export const mockUser: User = {
  name: "Dhenne",
  email: "dhenne@examfacile.ga",
  level: 15,
  series: "A1",
  points: 4250,
  streak: 12,
  quizCompleted: 87,
  avatar: "D",
};

export type Subject = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  progress: number;
  chaptersCount: number;
  description: string;
};

export const subjects: Subject[] = [
  { id: "math", name: "Mathématiques", icon: Brain, color: "#2563EB", gradient: "from-blue-500 to-indigo-600", progress: 68, chaptersCount: 10, description: "Maîtrisez nombres, logique et résolution de problèmes." },
  { id: "philo", name: "Philosophie", icon: BookOpen, color: "#7C3AED", gradient: "from-purple-500 to-fuchsia-600", progress: 42, chaptersCount: 8, description: "Explorez les grandes idées et la pensée critique." },
  { id: "french", name: "Français", icon: Languages, color: "#10B981", gradient: "from-emerald-500 to-teal-600", progress: 75, chaptersCount: 12, description: "Littérature, grammaire et expression écrite." },
  { id: "hg", name: "Histoire-Géographie", icon: Globe2, color: "#F59E0B", gradient: "from-amber-500 to-orange-600", progress: 30, chaptersCount: 9, description: "Comprenez le monde, hier et aujourd'hui." },
];

export type Chapter = {
  id: string;
  subjectId: string;
  title: string;
  duration: number;
  progress: number;
  completed: boolean;
};

const mathChapters = [
  "Suites", "Fonctions", "Probabilités", "Géométrie", "Dérivées",
  "Statistiques", "Limites", "Algèbre", "Vecteurs", "Équations",
];

export const chapters: Record<string, Chapter[]> = {
  math: mathChapters.map((title, i) => ({
    id: `math-${i + 1}`,
    subjectId: "math",
    title,
    duration: 15 + (i % 4) * 5,
    progress: i < 4 ? 100 : i < 6 ? 60 : i < 8 ? 25 : 0,
    completed: i < 4,
  })),
  philo: ["La conscience", "La liberté", "La vérité", "La justice", "L'art", "La religion", "Le langage", "Le bonheur"].map((title, i) => ({
    id: `philo-${i + 1}`, subjectId: "philo", title, duration: 20, progress: i < 3 ? 100 : i < 5 ? 40 : 0, completed: i < 3,
  })),
  french: ["Le Romantisme", "Le Réalisme", "La Poésie", "Le Théâtre", "Le Roman", "L'Essai", "Grammaire", "Dissertation", "Commentaire composé", "Vocabulaire", "Syntaxe", "Auteurs gabonais"].map((title, i) => ({
    id: `french-${i + 1}`, subjectId: "french", title, duration: 18, progress: i < 8 ? 100 : i < 10 ? 50 : 0, completed: i < 8,
  })),
  hg: ["Première Guerre mondiale", "Seconde Guerre mondiale", "Guerre froide", "Décolonisation de l'Afrique", "Mondialisation", "Climat & environnement", "Géographie urbaine", "L'Afrique centrale", "Le Gabon"].map((title, i) => ({
    id: `hg-${i + 1}`, subjectId: "hg", title, duration: 22, progress: i < 3 ? 100 : i < 4 ? 30 : 0, completed: i < 3,
  })),
};

export const getChapter = (id: string): Chapter | undefined => {
  for (const list of Object.values(chapters)) {
    const found = list.find((c) => c.id === id);
    if (found) return found;
  }
  return undefined;
};

export type LessonSection = { heading: string; body: string };
export type Lesson = { title: string; readingTime: number; intro: string; sections: LessonSection[]; summary: string };
export const lessonContent = (chapter: Chapter): Lesson => ({
  title: chapter.title,
  readingTime: Math.round(chapter.duration / 2),
  intro: `Bienvenue dans le chapitre « ${chapter.title} ». Dans cette leçon, nous explorerons les notions fondamentales qui vous aideront à maîtriser ce thème pour votre baccalauréat.`,
  sections: [
    { heading: "Introduction", body: `« ${chapter.title} » est l'un des thèmes les plus importants du programme. Bien le comprendre vous donnera une base solide pour aborder les épreuves du bac avec confiance.` },
    { heading: "Notions clés", body: `Les principes essentiels de « ${chapter.title} » s'articulent autour de trois idées : la définition, l'application et le raisonnement. Nous verrons des exemples clairs et des exercices résolus pour relier la théorie à la pratique.` },
    { heading: "Exemple résolu", body: `Prenons un problème type : identifiez la structure, appliquez la formule ou la méthode adaptée, puis vérifiez le résultat. Cette démarche en 3 étapes fonctionne pour presque toutes les questions du bac sur « ${chapter.title} ».` },
    { heading: "Pièges fréquents", body: "Les élèves vont souvent trop vite à la mise en équation et perdent des points sur de petites erreurs. Prenez votre temps, rédigez chaque étape et vérifiez signes, unités et hypothèses." },
  ],
  summary: `« ${chapter.title} » devient simple une fois la méthode bien assimilée. 5 questions de quiz par jour pendant une semaine et vous verrez une nette progression.`,
});

export type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const generateQuiz = (chapter: Chapter): Question[] =>
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `Question ${i + 1} : quelle affirmation sur « ${chapter.title} » est correcte ?`,
    options: [
      `${chapter.title} — option A : une définition précise`,
      `${chapter.title} — option B : une vérité partielle`,
      `${chapter.title} — option C : une erreur fréquente`,
      `${chapter.title} — option D : une idée hors-sujet`,
    ],
    correct: i % 4,
    explanation: `La bonne réponse illustre le principe fondamental de « ${chapter.title} ». Les autres options sont des distracteurs courants liés à une compréhension partielle.`,
  }));

export type LeaderEntry = {
  rank: number;
  name: string;
  series: string;
  points: number;
  isUser?: boolean;
};

export const leaderboard: LeaderEntry[] = [
  { rank: 1, name: "Amina K.", series: "C", points: 8920 },
  { rank: 2, name: "Jules M.", series: "A1", points: 7610 },
  { rank: 3, name: "Sara D.", series: "D", points: 6480 },
  { rank: 4, name: "Kevin O.", series: "A1", points: 5320 },
  { rank: 5, name: "Dhenne", series: "A1", points: 4250, isUser: true },
  { rank: 6, name: "Marie T.", series: "C", points: 4100 },
  { rank: 7, name: "Paul N.", series: "D", points: 3890 },
  { rank: 8, name: "Linda B.", series: "A1", points: 3540 },
  { rank: 9, name: "Eric F.", series: "C", points: 3210 },
  { rank: 10, name: "Nina S.", series: "A1", points: 2980 },
];

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
};

export const badges: Badge[] = [
  { id: "1", name: "Motivé", emoji: "🔥", description: "7 jours consécutifs de révision", unlocked: true, progress: 100 },
  { id: "2", name: "Expert", emoji: "🏅", description: "Plus de 90 % à 5 quiz", unlocked: true, progress: 100 },
  { id: "3", name: "Studieux", emoji: "📚", description: "Terminer 50 leçons", unlocked: true, progress: 100 },
  { id: "4", name: "Élite", emoji: "👑", description: "Atteindre le top 10 national", unlocked: true, progress: 100 },
  { id: "5", name: "Marathon", emoji: "⚡", description: "30 jours consécutifs", unlocked: false, progress: 40 },
  { id: "6", name: "Perfectionniste", emoji: "💎", description: "100 % à 10 quiz", unlocked: false, progress: 65 },
  { id: "7", name: "Érudit", emoji: "🎓", description: "Terminer tous les chapitres", unlocked: false, progress: 55 },
  { id: "8", name: "Légende", emoji: "🌟", description: "Atteindre le niveau 30", unlocked: false, progress: 50 },
];

export const weeklyProgress = [
  { day: "Lun", points: 320, minutes: 45 },
  { day: "Mar", points: 480, minutes: 60 },
  { day: "Mer", points: 290, minutes: 30 },
  { day: "Jeu", points: 620, minutes: 75 },
  { day: "Ven", points: 410, minutes: 50 },
  { day: "Sam", points: 780, minutes: 90 },
  { day: "Dim", points: 350, minutes: 40 },
];

export const recentActivity = [
  { id: 1, type: "quiz", title: "Quiz Fonctions", score: "9/10", time: "il y a 2 h", icon: "🎯" },
  { id: 2, type: "lesson", title: "Terminé : Suites", score: "+50 XP", time: "il y a 5 h", icon: "📖" },
  { id: 3, type: "badge", title: "Débloqué : Expert", score: "🏅", time: "il y a 1 j", icon: "🏆" },
  { id: 4, type: "quiz", title: "Quiz Probabilités", score: "8/10", time: "il y a 2 j", icon: "🎯" },
];

export const levelName = (level: number) => {
  if (level >= 30) return "Légende";
  if (level >= 20) return "Champion";
  if (level >= 10) return "Expert";
  if (level >= 5) return "Apprenant";
  return "Débutant";
};

export type StudyGuide = {
  keyConcepts: string[];
  definitions: { term: string; def: string }[];
  examTips: string[];
  commonMistakes: string[];
  importantFacts: string[];
};
export const studyGuide = (chapter: Chapter): StudyGuide => ({
  keyConcepts: [
    `« ${chapter.title} » se définit comme une démarche structurée de résolution de problèmes.`,
    `Formule ou principe central : s'applique à 90 % des questions classiques du bac.`,
    `Les variantes de « ${chapter.title} » apparaissent dans plusieurs matières.`,
  ],
  definitions: [
    { term: chapter.title, def: `L'étude systématique et l'application des principes de « ${chapter.title.toLowerCase()} ».` },
    { term: "Méthode", def: "Un processus reproductible, étape par étape, pour parvenir à la bonne réponse." },
    { term: "Application", def: "Usage concret de la notion dans des problèmes et exercices." },
  ],
  examTips: [
    "Lisez chaque énoncé deux fois avant de commencer.",
    "Accordez 1 à 2 minutes par question à choix multiple.",
    "Éliminez d'abord les options manifestement fausses.",
    "Vérifiez toujours votre réponse finale.",
  ],
  commonMistakes: [
    "Sauter l'étape de mise en équation pour foncer sur la formule.",
    "Confondre des définitions proches mais distinctes.",
    "Ignorer les unités, les signes ou les contraintes de l'énoncé.",
  ],
  importantFacts: [
    `« ${chapter.title} » apparaît généralement dans 2 à 3 questions du bac national.`,
    "La maîtrise vient d'une pratique quotidienne régulière, pas du bachotage de dernière minute.",
    "La plupart des élèves perdent des points sur la présentation, pas sur la méthode.",
  ],
});
