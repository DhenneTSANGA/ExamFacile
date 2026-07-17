import { BookOpen, Brain, Globe2, Languages, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  BookOpen,
  Languages,
  Globe2,
};

export function resolveSubjectIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? BookOpen;
}
