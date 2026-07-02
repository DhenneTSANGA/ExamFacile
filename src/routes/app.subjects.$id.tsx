import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Circle, Play, ArrowLeft } from "lucide-react";
import { subjects, chapters } from "@/lib/mockData";
import { Card, PageHeader, ProgressBar } from "@/components/ui-bits";

export const Route = createFileRoute("/app/subjects/$id")({
  head: ({ params }) => ({ meta: [{ title: `${subjects.find((s) => s.id === params.id)?.name ?? "Matière"} — ExamFacile` }] }),
  component: SubjectDetail,
});

function SubjectDetail() {
  const { id } = useParams({ from: "/app/subjects/$id" });
  const subject = subjects.find((s) => s.id === id);
  const chapterList = chapters[id] ?? [];

  if (!subject) {
    return <div className="p-8 text-center text-muted-foreground">Matière introuvable.</div>;
  }

  return (
    <div>
      <Link to="/app/subjects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Toutes les matières</Link>
      <PageHeader title={subject.name} subtitle={subject.description}>
        <div className="flex items-center gap-4 text-sm">
          <div className="px-3 py-1.5 rounded-full bg-card border border-border">{chapterList.length} chapitres</div>
          <div className="px-3 py-1.5 rounded-full gradient-brand text-white font-semibold">{subject.progress}% terminé</div>
        </div>
      </PageHeader>

      <div className="space-y-3">
        {chapterList.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
            <Card hover className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 grid place-items-center">
                {c.completed ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> : <Circle className="w-7 h-7 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Chapitre {i + 1}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration} min</span>
                </div>
                <div className="font-semibold mb-2 truncate">{c.title}</div>
                <ProgressBar value={c.progress} />
              </div>
              <Link to="/app/lesson/$chapterId" params={{ chapterId: c.id }} className="shrink-0">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-soft hover:scale-105 transition-transform">
                  <Play className="w-4 h-4" /> {c.progress > 0 ? "Continuer" : "Commencer"}
                </button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
