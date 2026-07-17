import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, BookOpen, ArrowLeft, Play, Pause, Sparkles, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { resolveSubjectIcon } from "@/lib/icons";
import { getChapterLessonFn } from "@/fns/content.server";
import { completeLessonFn } from "@/fns/progress.server";
import { Card } from "@/components/ui-bits";

export const Route = createFileRoute("/app/lesson/$chapterId")({
  loader: ({ params }) => getChapterLessonFn({ data: { chapterId: params.chapterId } }),
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.lesson.title ?? "Leçon"} — ExamFacile` }] }),
  component: Lesson,
});

function Lesson() {
  const { chapterId } = useParams({ from: "/app/lesson/$chapterId" });
  const data = Route.useLoaderData();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [completed, setCompleted] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    ref.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + speed * 0.5;
        if (next >= 100) {
          setPlaying(false);
          if (!completed && data) {
            setCompleted(true);
            completeLessonFn({ data: { chapterId, minutes: data.lesson.readingTime } }).catch(console.error);
          }
          return 100;
        }
        return next;
      });
    }, 100);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [playing, speed, completed, chapterId, data]);

  if (!data) {
    return <div className="p-8 text-center text-muted-foreground">Leçon introuvable.</div>;
  }

  const { lesson, subjectId } = data;
  const SubjectIcon = resolveSubjectIcon("BookOpen");

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/app/subjects/$id" params={{ id: subjectId }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Retour aux chapitres</Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <BookOpen className="w-4 h-4" /> Chapitre · <SubjectIcon className="w-4 h-4 inline" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">{lesson.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson.readingTime} min de lecture</span>
        </div>

        <Card className="p-5 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setPlaying((p) => !p)} className="w-12 h-12 rounded-full gradient-brand text-white grid place-items-center shadow-glow hover:scale-105 transition-transform" aria-label={playing ? "Pause" : "Lecture"}>
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Narration IA
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="flex gap-1">
              {[0.75, 1, 1.5, 2].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className={`px-2.5 py-1 text-xs rounded-lg font-semibold ${speed === s ? "gradient-brand text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>{s}x</button>
              ))}
            </div>
          </div>
        </Card>

        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">{lesson.intro}</p>
          {lesson.sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8">
              <h2 className="text-2xl font-bold font-display mb-3">{s.heading}</h2>
              <p className="text-foreground leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <Card className="p-6 gradient-brand text-white shadow-glow mb-8">
          <div className="flex items-center gap-2 mb-3 font-semibold"><Sparkles className="w-5 h-5" /> À retenir</div>
          <p className="opacity-95 leading-relaxed">{lesson.summary}</p>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link to="/app/study-guide/$chapterId" params={{ chapterId }} className="flex-1 min-w-[200px]">
            <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card border border-border font-semibold hover:bg-muted transition">
              <Sparkles className="w-4 h-4" /> Générer la fiche IA
            </button>
          </Link>
          <Link to="/app/quiz/$chapterId" params={{ chapterId }} className="flex-1 min-w-[200px]">
            <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-brand text-white font-semibold shadow-glow hover:scale-[1.02] transition">
              Lancer le quiz <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
