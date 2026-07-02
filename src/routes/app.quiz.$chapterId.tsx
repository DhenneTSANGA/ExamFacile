import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getChapter, generateQuiz } from "@/lib/mockData";
import { Card } from "@/components/ui-bits";

export const Route = createFileRoute("/app/quiz/$chapterId")({
  head: ({ params }) => ({ meta: [{ title: `Quiz : ${getChapter(params.chapterId)?.title ?? ""} — ExamFacile` }] }),
  component: Quiz,
});

function Quiz() {
  const { chapterId } = useParams({ from: "/app/quiz/$chapterId" });
  const chapter = getChapter(chapterId);
  const navigate = useNavigate();
  const questions = useMemo(() => (chapter ? generateQuiz(chapter) : []), [chapter]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(questions.length).fill(-1));
  const [selected, setSelected] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!chapter || questions.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">Quiz indisponible.</div>;
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const next = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    if (newAnswers.length === 0) {
      for (let i = 0; i < questions.length; i++) newAnswers.push(-1);
    }
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      const score = newAnswers.reduce((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0);
      sessionStorage.setItem("examfacile-quiz-result", JSON.stringify({
        chapterId: chapter.id, chapterTitle: chapter.title, score, total: questions.length, time, answers: newAnswers,
        questions: questions.map((qq) => ({ question: qq.question, options: qq.options, correct: qq.correct, explanation: qq.explanation })),
      }));
      navigate({ to: "/app/results" });
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/app/lesson/$chapterId" params={{ chapterId: chapter.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Retour à la leçon</Link>
        <div className="flex items-center gap-4 text-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border"><Clock className="w-3.5 h-3.5" /> {formatTime(time)}</div>
          <Link to="/app/subjects" className="p-2 rounded-lg hover:bg-muted" aria-label="Quitter"><X className="w-4 h-4" /></Link>
        </div>
      </div>

      <div className="mb-2 flex justify-between text-sm text-muted-foreground">
        <span>Question {current + 1} sur {questions.length}</span>
        <span>{chapter.title}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} className="h-full gradient-brand rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 md:p-8 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold font-display mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg grid place-items-center font-bold text-sm ${selected === i ? "gradient-brand text-white" : "bg-muted text-muted-foreground"}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="flex-1">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <button onClick={next} disabled={selected === null} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-semibold shadow-glow disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition">
          {current + 1 === questions.length ? "Terminer le quiz" : "Question suivante"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60); const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
