import "dotenv/config";
import { prisma } from "../src/lib/prisma.server";
import { hashPassword } from "../src/lib/password.server";
import { buildLessonContent, buildQuizQuestions, buildStudyGuideContent } from "../src/lib/content-templates";

const subjects = [
  { id: "math", name: "Mathématiques", icon: "Brain", color: "#2563EB", gradient: "from-blue-500 to-indigo-600", description: "Maîtrisez nombres, logique et résolution de problèmes.", sortOrder: 0 },
  { id: "philo", name: "Philosophie", icon: "BookOpen", color: "#7C3AED", gradient: "from-purple-500 to-fuchsia-600", description: "Explorez les grandes idées et la pensée critique.", sortOrder: 1 },
  { id: "french", name: "Français", icon: "Languages", color: "#10B981", gradient: "from-emerald-500 to-teal-600", description: "Littérature, grammaire et expression écrite.", sortOrder: 2 },
  { id: "hg", name: "Histoire-Géographie", icon: "Globe2", color: "#F59E0B", gradient: "from-amber-500 to-orange-600", description: "Comprenez le monde, hier et aujourd'hui.", sortOrder: 3 },
];

const chapterTitles: Record<string, string[]> = {
  math: ["Suites", "Fonctions", "Probabilités", "Géométrie", "Dérivées", "Statistiques", "Limites", "Algèbre", "Vecteurs", "Équations"],
  philo: ["La conscience", "La liberté", "La vérité", "La justice", "L'art", "La religion", "Le langage", "Le bonheur"],
  french: ["Le Romantisme", "Le Réalisme", "La Poésie", "Le Théâtre", "Le Roman", "L'Essai", "Grammaire", "Dissertation", "Commentaire composé", "Vocabulaire", "Syntaxe", "Auteurs gabonais"],
  hg: ["Première Guerre mondiale", "Seconde Guerre mondiale", "Guerre froide", "Décolonisation de l'Afrique", "Mondialisation", "Climat & environnement", "Géographie urbaine", "L'Afrique centrale", "Le Gabon"],
};

const badges = [
  { id: "motivated", name: "Motivé", emoji: "🔥", description: "7 jours consécutifs de révision", sortOrder: 0 },
  { id: "expert", name: "Expert", emoji: "🏅", description: "Plus de 90 % à 5 quiz", sortOrder: 1 },
  { id: "studious", name: "Studieux", emoji: "📚", description: "Terminer 50 leçons", sortOrder: 2 },
  { id: "elite", name: "Élite", emoji: "👑", description: "Atteindre le top 10 national", sortOrder: 3 },
  { id: "marathon", name: "Marathon", emoji: "⚡", description: "30 jours consécutifs", sortOrder: 4 },
  { id: "perfectionist", name: "Perfectionniste", emoji: "💎", description: "100 % à 10 quiz", sortOrder: 5 },
  { id: "scholar", name: "Érudit", emoji: "🎓", description: "Terminer tous les chapitres", sortOrder: 6 },
  { id: "legend", name: "Légende", emoji: "🌟", description: "Atteindre le niveau 30", sortOrder: 7 },
];

async function main() {
  for (const subject of subjects) {
    await prisma.subject.upsert({ where: { id: subject.id }, update: subject, create: subject });
  }

  for (const [subjectId, titles] of Object.entries(chapterTitles)) {
    for (let i = 0; i < titles.length; i++) {
      const id = `${subjectId}-${i + 1}`;
      const title = titles[i];
      const duration = 15 + (i % 4) * 5;

      await prisma.chapter.upsert({
        where: { id },
        update: { title, duration, sortOrder: i },
        create: { id, subjectId, title, duration, sortOrder: i },
      });

      const lesson = buildLessonContent(title, duration);
      await prisma.lesson.upsert({
        where: { chapterId: id },
        update: { readingTime: lesson.readingTime, intro: lesson.intro, summary: lesson.summary },
        create: {
          chapterId: id,
          readingTime: lesson.readingTime,
          intro: lesson.intro,
          summary: lesson.summary,
          sections: { create: lesson.sections },
        },
      });

      const guide = buildStudyGuideContent(title);
      await prisma.studyGuide.upsert({
        where: { chapterId: id },
        update: {
          keyConcepts: guide.keyConcepts,
          examTips: guide.examTips,
          commonMistakes: guide.commonMistakes,
          importantFacts: guide.importantFacts,
        },
        create: {
          chapterId: id,
          keyConcepts: guide.keyConcepts,
          examTips: guide.examTips,
          commonMistakes: guide.commonMistakes,
          importantFacts: guide.importantFacts,
          definitions: { create: guide.definitions },
        },
      });

      const existingQuestions = await prisma.question.count({ where: { chapterId: id } });
      if (existingQuestions === 0) {
        await prisma.question.createMany({
          data: buildQuizQuestions(title).map((q) => ({ ...q, chapterId: id, options: q.options })),
        });
      }
    }
  }

  for (const badge of badges) {
    await prisma.badge.upsert({ where: { id: badge.id }, update: badge, create: badge });
  }

  const demoHash = await hashPassword("password");
  const demo = await prisma.user.upsert({
    where: { email: "dhenne@examfacile.ga" },
    update: {},
    create: {
      name: "Dhenne",
      email: "dhenne@examfacile.ga",
      passwordHash: demoHash,
      avatar: "D",
      series: "A1",
      level: 15,
      points: 4250,
      streak: 12,
      quizCompleted: 87,
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
    },
    include: { subscription: true },
  });

  const allBadges = await prisma.badge.findMany();
  for (const b of allBadges) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demo.id, badgeId: b.id } },
      update: {},
      create: { userId: demo.id, badgeId: b.id, progress: b.id === "motivated" || b.id === "expert" ? 100 : 40, unlockedAt: b.id === "motivated" || b.id === "expert" ? new Date() : null },
    });
  }

  console.log("Seed terminé : contenu partagé + utilisateur démo (dhenne@examfacile.ga / password).");

  const adminHash = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { email: "admin@examfacile.ga" },
    update: { role: "ADMIN" },
    create: {
      name: "Administrateur",
      email: "admin@examfacile.ga",
      passwordHash: adminHash,
      avatar: "A",
      role: "ADMIN",
      series: "A1",
      subscription: { create: { plan: "PREMIUM", status: "ACTIVE" } },
    },
  });
  console.log("Super admin : admin@examfacile.ga / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
