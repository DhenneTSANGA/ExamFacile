import { buildLessonContent, buildQuizQuestions, buildStudyGuideContent } from "@/lib/content-templates";
import { ApiError, apiRequest } from "@/lib/api/client";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Subject = {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  sortOrder: number;
  _count?: { chapters: number };
  chapters?: ChapterSummary[];
};

export type ChapterSummary = {
  id: string;
  subjectId: string;
  title: string;
  duration: number;
  sortOrder: number;
  _count?: { questions: number };
};

export type LessonSection = {
  id: string;
  lessonId: string;
  heading: string;
  body: string;
  sortOrder: number;
};

export type Lesson = {
  id: string;
  chapterId: string;
  readingTime: number;
  intro: string;
  summary: string;
  sections?: LessonSection[];
};

export type StudyGuideDefinition = {
  id: string;
  studyGuideId: string;
  term: string;
  definition: string;
  sortOrder: number;
};

export type StudyGuide = {
  id: string;
  chapterId: string;
  keyConcepts: string[];
  examTips: string[];
  commonMistakes: string[];
  importantFacts: string[];
  definitions?: StudyGuideDefinition[];
};

export type Question = {
  id: string;
  chapterId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder: number;
};

export type ChapterDetail = ChapterSummary & {
  subject: { id: string; name: string };
  lesson: Lesson | null;
  studyGuide: StudyGuide | null;
  questions: Question[];
};

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  sortOrder: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  series: string;
  level: number;
  points: number;
  quizCompleted?: number;
  subscription?: { plan: string } | null;
};

export type AdminStats = {
  subjects: number;
  chapters: number;
  questions: number;
  users: number;
  badges: number;
  attempts: number;
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const [subjects, chapters, questions, users, badges] = await Promise.all([
    apiRequest<Subject[]>("/api/subjects"),
    apiRequest<ChapterSummary[]>("/api/chapters"),
    apiRequest<Question[]>("/api/questions"),
    apiRequest<AdminUser[]>("/api/users"),
    apiRequest<Badge[]>("/api/badges"),
  ]);

  const attempts = users.reduce((sum, u) => sum + (u.quizCompleted ?? 0), 0);

  return {
    subjects: subjects.length,
    chapters: chapters.length,
    questions: questions.length,
    users: users.length,
    badges: badges.length,
    attempts,
  };
}

// ─── Matières ────────────────────────────────────────────────────────────────

export async function listSubjects(): Promise<Subject[]> {
  return apiRequest<Subject[]>("/api/subjects");
}

export async function getSubject(id: string): Promise<Subject | null> {
  try {
    return await apiRequest<Subject>(`/api/subjects/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function getSubjectWithChapters(id: string): Promise<(Subject & { chapters: ChapterSummary[] }) | null> {
  const [subject, chapters] = await Promise.all([
    getSubject(id),
    apiRequest<ChapterSummary[]>(`/api/chapters?subjectId=${encodeURIComponent(id)}`),
  ]);
  if (!subject) return null;
  return { ...subject, chapters };
}

export async function createSubject(data: {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  sortOrder?: number;
}): Promise<Subject> {
  return apiRequest<Subject>("/api/subjects", { method: "POST", json: data });
}

export async function updateSubject(
  id: string,
  data: Partial<Omit<Subject, "id" | "_count" | "chapters">>,
): Promise<Subject> {
  return apiRequest<Subject>(`/api/subjects/${id}`, { method: "PUT", json: data });
}

export async function deleteSubject(id: string): Promise<void> {
  await apiRequest(`/api/subjects/${id}`, { method: "DELETE" });
}

// ─── Chapitres ───────────────────────────────────────────────────────────────

export async function getChapter(id: string): Promise<ChapterDetail | null> {
  try {
    return await apiRequest<ChapterDetail>(`/api/chapters/${id}?include=all`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function createChapter(data: {
  id: string;
  subjectId: string;
  title: string;
  duration: number;
  sortOrder?: number;
  withContent?: boolean;
}): Promise<ChapterSummary> {
  const { withContent, ...chapterData } = data;
  const chapter = await apiRequest<ChapterSummary>("/api/chapters", { method: "POST", json: chapterData });

  if (withContent) {
    await seedChapterContent(chapter.id, chapter.title, chapter.duration);
  }

  return chapter;
}

async function seedChapterContent(chapterId: string, title: string, duration: number) {
  const lessonContent = buildLessonContent(title, duration);
  const guideContent = buildStudyGuideContent(title);
  const quizQuestions = buildQuizQuestions(title);

  const lesson = await apiRequest<Lesson>("/api/lessons", {
    method: "POST",
    json: {
      chapterId,
      readingTime: lessonContent.readingTime,
      intro: lessonContent.intro,
      summary: lessonContent.summary,
    },
  });

  await Promise.all(
    lessonContent.sections.map((s, i) =>
      apiRequest("/api/lesson-sections", {
        method: "POST",
        json: { lessonId: lesson.id, heading: s.heading, body: s.body, sortOrder: s.sortOrder ?? i },
      }),
    ),
  );

  const guide = await apiRequest<StudyGuide>("/api/study-guides", {
    method: "POST",
    json: {
      chapterId,
      keyConcepts: guideContent.keyConcepts,
      examTips: guideContent.examTips,
      commonMistakes: guideContent.commonMistakes,
      importantFacts: guideContent.importantFacts,
    },
  });

  await Promise.all(
    guideContent.definitions.map((d, i) =>
      apiRequest("/api/study-guide-definitions", {
        method: "POST",
        json: { studyGuideId: guide.id, term: d.term, definition: d.definition, sortOrder: d.sortOrder ?? i },
      }),
    ),
  );

  const existing = await apiRequest<Question[]>(`/api/questions?chapterId=${encodeURIComponent(chapterId)}`);
  if (existing.length === 0) {
    await Promise.all(
      quizQuestions.map((q, i) =>
        apiRequest("/api/questions", {
          method: "POST",
          json: { chapterId, ...q, sortOrder: i },
        }),
      ),
    );
  }
}

export async function deleteChapter(id: string): Promise<void> {
  await apiRequest(`/api/chapters/${id}`, { method: "DELETE" });
}

// ─── Leçons ──────────────────────────────────────────────────────────────────

export async function saveLessonWithSections(data: {
  chapterId: string;
  readingTime: number;
  intro: string;
  summary: string;
  sections: { heading: string; body: string; sortOrder?: number }[];
}): Promise<Lesson> {
  const existing = await apiRequest<Lesson[]>(`/api/lessons?chapterId=${encodeURIComponent(data.chapterId)}`);
  const lessonBody = {
    chapterId: data.chapterId,
    readingTime: data.readingTime,
    intro: data.intro,
    summary: data.summary,
  };

  let lesson: Lesson;
  if (existing.length > 0) {
    lesson = await apiRequest<Lesson>(`/api/lessons/${existing[0].id}`, { method: "PUT", json: lessonBody });
  } else {
    lesson = await apiRequest<Lesson>("/api/lessons", { method: "POST", json: lessonBody });
  }

  const oldSections = await apiRequest<LessonSection[]>(
    `/api/lesson-sections?lessonId=${encodeURIComponent(lesson.id)}`,
  );
  await Promise.all(oldSections.map((s) => apiRequest(`/api/lesson-sections/${s.id}`, { method: "DELETE" })));

  const filtered = data.sections.filter((s) => s.heading.trim());
  await Promise.all(
    filtered.map((s, i) =>
      apiRequest("/api/lesson-sections", {
        method: "POST",
        json: { lessonId: lesson.id, heading: s.heading, body: s.body, sortOrder: s.sortOrder ?? i },
      }),
    ),
  );

  return lesson;
}

// ─── Fiches de révision ──────────────────────────────────────────────────────

export async function saveStudyGuideWithDefinitions(data: {
  chapterId: string;
  keyConcepts: string[];
  examTips: string[];
  commonMistakes: string[];
  importantFacts: string[];
  definitions: { term: string; definition: string; sortOrder?: number }[];
}): Promise<StudyGuide> {
  const existing = await apiRequest<StudyGuide[]>(
    `/api/study-guides?chapterId=${encodeURIComponent(data.chapterId)}`,
  );

  const guideBody = {
    chapterId: data.chapterId,
    keyConcepts: data.keyConcepts.filter(Boolean),
    examTips: data.examTips.filter(Boolean),
    commonMistakes: data.commonMistakes.filter(Boolean),
    importantFacts: data.importantFacts.filter(Boolean),
  };

  let guide: StudyGuide;
  if (existing.length > 0) {
    guide = await apiRequest<StudyGuide>(`/api/study-guides/${existing[0].id}`, { method: "PUT", json: guideBody });
  } else {
    guide = await apiRequest<StudyGuide>("/api/study-guides", { method: "POST", json: guideBody });
  }

  const oldDefs = await apiRequest<StudyGuideDefinition[]>(
    `/api/study-guide-definitions?studyGuideId=${encodeURIComponent(guide.id)}`,
  );
  await Promise.all(oldDefs.map((d) => apiRequest(`/api/study-guide-definitions/${d.id}`, { method: "DELETE" })));

  const filtered = data.definitions.filter((d) => d.term.trim());
  await Promise.all(
    filtered.map((d, i) =>
      apiRequest("/api/study-guide-definitions", {
        method: "POST",
        json: { studyGuideId: guide.id, term: d.term, definition: d.definition, sortOrder: d.sortOrder ?? i },
      }),
    ),
  );

  return guide;
}

// ─── Questions ───────────────────────────────────────────────────────────────

export async function createQuestion(data: {
  chapterId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder?: number;
}): Promise<Question> {
  return apiRequest<Question>("/api/questions", { method: "POST", json: data });
}

export async function deleteQuestion(id: string): Promise<void> {
  await apiRequest(`/api/questions/${id}`, { method: "DELETE" });
}

// ─── Badges ──────────────────────────────────────────────────────────────────

export async function listBadges(): Promise<Badge[]> {
  return apiRequest<Badge[]>("/api/badges");
}

export async function createBadge(data: {
  id: string;
  name: string;
  emoji: string;
  description: string;
  sortOrder?: number;
}): Promise<Badge> {
  return apiRequest<Badge>("/api/badges", { method: "POST", json: data });
}

export async function deleteBadge(id: string): Promise<void> {
  await apiRequest(`/api/badges/${id}`, { method: "DELETE" });
}

// ─── Utilisateurs ────────────────────────────────────────────────────────────

export async function listUsers(): Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>("/api/users");
}
