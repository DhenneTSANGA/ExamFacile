import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma.server";
import { requireSessionUserId } from "@/lib/session.server";
import type { ChapterView, LessonView, QuestionView, StudyGuideView, SubjectView } from "@/types/app";

async function subjectProgress(userId: string, subjectId: string, chapterCount: number): Promise<number> {
  if (chapterCount === 0) return 0;
  const rows = await prisma.chapterProgress.findMany({
    where: { userId, chapter: { subjectId } },
  });
  const total = rows.reduce((sum, r) => sum + r.progress, 0);
  return Math.round(total / chapterCount);
}

export const getSubjectsFn = createServerFn({ method: "GET" }).handler(async () => {
  const userId = requireSessionUserId();
  const subjects = await prisma.subject.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { chapters: true } } },
  });

  return Promise.all(
    subjects.map(async (s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      color: s.color,
      gradient: s.gradient,
      description: s.description,
      chaptersCount: s._count.chapters,
      progress: await subjectProgress(userId, s.id, s._count.chapters),
    })),
  );
});

export const getSubjectChaptersFn = createServerFn({ method: "GET" })
  .validator((data: { subjectId: string }) => data)
  .handler(async ({ data }) => {
    const userId = requireSessionUserId();
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
      include: { chapters: { orderBy: { sortOrder: "asc" } }, _count: { select: { chapters: true } } },
    });
    if (!subject) return null;

    const progressRows = await prisma.chapterProgress.findMany({
      where: { userId, chapterId: { in: subject.chapters.map((c) => c.id) } },
    });
    const progressMap = new Map(progressRows.map((p) => [p.chapterId, p]));

    const chapters: ChapterView[] = subject.chapters.map((c) => {
      const p = progressMap.get(c.id);
      return {
        id: c.id,
        subjectId: c.subjectId,
        title: c.title,
        duration: c.duration,
        progress: p?.progress ?? 0,
        completed: p?.completed ?? false,
      };
    });

    const subjectView: SubjectView = {
      id: subject.id,
      name: subject.name,
      icon: subject.icon,
      color: subject.color,
      gradient: subject.gradient,
      description: subject.description,
      chaptersCount: subject._count.chapters,
      progress: await subjectProgress(userId, subject.id, subject._count.chapters),
    };

    return { subject: subjectView, chapters };
  });

export const getChapterLessonFn = createServerFn({ method: "GET" })
  .validator((data: { chapterId: string }) => data)
  .handler(async ({ data }) => {
    requireSessionUserId();
    const chapter = await prisma.chapter.findUnique({
      where: { id: data.chapterId },
      include: { lesson: { include: { sections: { orderBy: { sortOrder: "asc" } } } } },
    });
    if (!chapter?.lesson) return null;

    return {
      chapter: { id: chapter.id, subjectId: chapter.subjectId, title: chapter.title, duration: chapter.duration, progress: 0, completed: false },
      subjectId: chapter.subjectId,
      lesson: {
        title: chapter.title,
        readingTime: chapter.lesson.readingTime,
        intro: chapter.lesson.intro,
        summary: chapter.lesson.summary,
        sections: chapter.lesson.sections.map((s) => ({ heading: s.heading, body: s.body })),
      } satisfies LessonView,
    };
  });

export const getStudyGuideFn = createServerFn({ method: "GET" })
  .validator((data: { chapterId: string }) => data)
  .handler(async ({ data }) => {
    requireSessionUserId();
    const chapter = await prisma.chapter.findUnique({
      where: { id: data.chapterId },
      include: {
        studyGuide: { include: { definitions: { orderBy: { sortOrder: "asc" } } } },
      },
    });
    if (!chapter?.studyGuide) return null;

    const g = chapter.studyGuide;
    return {
      chapter: { id: chapter.id, subjectId: chapter.subjectId, title: chapter.title, duration: chapter.duration, progress: 0, completed: false },
      guide: {
        keyConcepts: g.keyConcepts as string[],
        examTips: g.examTips as string[],
        commonMistakes: g.commonMistakes as string[],
        importantFacts: g.importantFacts as string[],
        definitions: g.definitions.map((d) => ({ term: d.term, def: d.definition })),
      } satisfies StudyGuideView,
    };
  });

export const getQuizQuestionsFn = createServerFn({ method: "GET" })
  .validator((data: { chapterId: string }) => data)
  .handler(async ({ data }) => {
    requireSessionUserId();
    const chapter = await prisma.chapter.findUnique({
      where: { id: data.chapterId },
      include: { questions: { orderBy: { sortOrder: "asc" } } },
    });
    if (!chapter || chapter.questions.length === 0) return null;

    return {
      chapter: { id: chapter.id, subjectId: chapter.subjectId, title: chapter.title, duration: chapter.duration, progress: 0, completed: false },
      questions: chapter.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options as string[],
        correct: q.correctIndex,
        explanation: q.explanation,
      })) satisfies QuestionView[],
    };
  });
