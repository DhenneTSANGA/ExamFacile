export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "USER" | "ADMIN";
  series: string;
  level: number;
  points: number;
  streak: number;
  quizCompleted: number;
  plan: "FREE" | "PREMIUM";
};

export type SubjectView = {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  progress: number;
  chaptersCount: number;
};

export type ChapterView = {
  id: string;
  subjectId: string;
  title: string;
  duration: number;
  progress: number;
  completed: boolean;
};

export type LessonView = {
  title: string;
  readingTime: number;
  intro: string;
  sections: { heading: string; body: string }[];
  summary: string;
};

export type StudyGuideView = {
  keyConcepts: string[];
  definitions: { term: string; def: string }[];
  examTips: string[];
  commonMistakes: string[];
  importantFacts: string[];
};

export type QuestionView = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type LeaderEntry = {
  rank: number;
  name: string;
  series: string;
  points: number;
  isUser?: boolean;
};

export type BadgeView = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
};

export type ActivityView = {
  id: string;
  type: string;
  title: string;
  score: string;
  time: string;
  icon: string;
};

export type WeeklyStatView = {
  day: string;
  points: number;
  minutes: number;
};

export type QuizResultView = {
  attemptId: string;
  chapterId: string;
  chapterTitle: string;
  score: number;
  total: number;
  time: number;
  answers: number[];
  questions: QuestionView[];
};
