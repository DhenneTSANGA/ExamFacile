export function levelName(level: number): string {
  if (level >= 30) return "Légende";
  if (level >= 20) return "Champion";
  if (level >= 10) return "Expert";
  if (level >= 5) return "Apprenant";
  return "Débutant";
}

export function levelFromPoints(points: number): number {
  return Math.max(1, Math.floor(points / 300) + 1);
}

export function xpToNextLevel(level: number): number {
  return level * 300;
}

export function quizXp(score: number, total: number): number {
  const ratio = total > 0 ? score / total : 0;
  return Math.round(50 + ratio * 150);
}

export function lessonXp(minutes: number): number {
  return Math.max(30, minutes * 3);
}

export function computeStreak(lastActiveAt: Date, currentStreak: number): number {
  const today = startOfDay(new Date());
  const last = startOfDay(lastActiveAt);
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);

  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `il y a ${Math.max(1, minutes)} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] as const;
