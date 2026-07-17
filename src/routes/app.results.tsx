import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { getQuizResultFn } from "@/fns/progress.server";
import { Card, PageHeader } from "@/components/ui-bits";

type ResultsSearch = { attemptId?: string };

export const Route = createFileRoute("/app/results")({
  validateSearch: (search: Record<string, unknown>): ResultsSearch => ({
    attemptId: typeof search.attemptId === "string" ? search.attemptId : undefined,
  }),
  loaderDeps: ({ search }) => ({ attemptId: search.attemptId }),
  loader: ({ deps }) => {
    if (!deps.attemptId) throw redirect({ to: "/app/subjects" });
    return getQuizResultFn({ data: { attemptId: deps.attemptId } });
  },
  head: () => ({ meta: [{ title: "Résultats du quiz — ExamFacile" }] }),
  component: Results,
});

function Results() {
  const result = Route.useLoaderData();

  useEffect(() => {
    if (result && result.score / result.total >= 0.7) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#2563EB", "#7C3AED", "#10B981"] });
    }
  }, [result]);

  if (!result) {
    return <div className="p-8 text-center text-muted-foreground">Résultat introuvable.</div>;
  }

  const pct = Math.round((result.score / result.total) * 100);
  const chartData = [{ name: "score", value: pct, fill: pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444" }];

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Quiz terminé !" subtitle={result.chapterTitle} />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6 text-center md:col-span-1 gradient-brand text-white shadow-glow">
          <div className="text-sm opacity-80">Score final</div>
          <div className="text-5xl font-bold font-display my-2">{result.score}/{result.total}</div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-sm font-semibold">
            <Trophy className="w-3.5 h-3.5" /> {pct}%
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="grid grid-cols-3 gap-4">
            <Stat icon={CheckCircle2} value={result.score} label="Bonnes réponses" color="text-emerald-500" />
            <Stat icon={XCircle} value={result.total - result.score} label="Erreurs" color="text-red-500" />
            <Stat icon={Clock} value={`${Math.floor(result.time / 60)} min ${result.time % 60} s`} label="Temps" color="text-primary" />
          </div>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={20} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-bold text-2xl">{pct}%</text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <h2 className="font-bold text-lg mb-4">Correction détaillée</h2>
      <div className="space-y-3 mb-8">
        {result.questions.map((q, i) => {
          const user = result.answers[i];
          const ok = user === q.correct;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  {ok ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-2">{q.question}</div>
                    <div className="text-sm space-y-1 mb-3">
                      <div className="text-muted-foreground">Votre réponse : <span className={ok ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>{q.options[user] ?? "—"}</span></div>
                      {!ok && <div className="text-emerald-600">Bonne réponse : <span className="font-semibold">{q.options[q.correct]}</span></div>}
                    </div>
                    <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/50">{q.explanation}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/app/quiz/$chapterId" params={{ chapterId: result.chapterId }} className="flex-1 min-w-[200px]">
          <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border font-semibold hover:bg-muted transition">
            <RotateCcw className="w-4 h-4" /> Refaire le quiz
          </button>
        </Link>
        <Link to="/app/dashboard" className="flex-1 min-w-[200px]">
          <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-semibold shadow-glow">
            Retour au tableau de bord <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label, color }: { icon: React.ComponentType<{ className?: string }>; value: string | number; label: string; color: string }) {
  return (
    <div className="text-center">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
