import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, BookOpen, Lightbulb, AlertTriangle, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getChapter, studyGuide } from "@/lib/mockData";
import { Card } from "@/components/ui-bits";

export const Route = createFileRoute("/app/study-guide/$chapterId")({
  head: ({ params }) => ({ meta: [{ title: `Fiche de révision : ${getChapter(params.chapterId)?.title ?? ""} — ExamFacile` }] }),
  component: StudyGuidePage,
});

function StudyGuidePage() {
  const { chapterId } = useParams({ from: "/app/study-guide/$chapterId" });
  const chapter = getChapter(chapterId);
  const guide = useMemo(() => (chapter ? studyGuide(chapter) : null), [chapter]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t);
  }, []);

  if (!chapter || !guide) {
    return <div className="p-8 text-center text-muted-foreground">Chapitre introuvable.</div>;
  }

  if (!ready) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 rounded-2xl gradient-brand grid place-items-center text-white mx-auto mb-6 shadow-glow">
          <Sparkles className="w-7 h-7" />
        </motion.div>
        <h1 className="text-3xl font-bold font-display mb-3">Génération de la fiche…</h1>
        <p className="text-muted-foreground mb-8">Notre IA lit le chapitre et prépare vos notes.</p>
        <div className="space-y-2 max-w-sm mx-auto">
          {["Lecture du chapitre", "Extraction des notions clés", "Rédaction des conseils"].map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }} className="flex items-center gap-2 text-sm text-left p-3 rounded-xl bg-card border border-border">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {s}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/app/lesson/$chapterId" params={{ chapterId: chapter.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Retour à la leçon</Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 text-primary" /> Générée par IA · rien que pour vous
        </div>
        <h1 className="text-4xl font-bold font-display mb-2">{chapter.title}</h1>
        <p className="text-muted-foreground mb-8">Notes de révision personnalisées à partir du contenu de la leçon.</p>

        <Section icon={BookOpen} title="Notions clés" color="from-blue-500 to-indigo-600">
          <ul className="space-y-2">
            {guide.keyConcepts.map((c, i) => (
              <li key={i} className="flex gap-3"><span className="text-primary font-bold">→</span><span>{c}</span></li>
            ))}
          </ul>
        </Section>

        <Section icon={Info} title="Définitions" color="from-emerald-500 to-teal-600">
          <div className="space-y-3">
            {guide.definitions.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/40">
                <div className="font-semibold mb-1">{d.term}</div>
                <div className="text-sm text-muted-foreground">{d.def}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Lightbulb} title="Conseils pour le bac" color="from-amber-500 to-orange-600">
          <ul className="space-y-2">
            {guide.examTips.map((t, i) => (
              <li key={i} className="flex gap-3"><span>💡</span><span>{t}</span></li>
            ))}
          </ul>
        </Section>

        <Section icon={AlertTriangle} title="Erreurs fréquentes" color="from-red-500 to-rose-600">
          <ul className="space-y-2">
            {guide.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-3"><span>⚠️</span><span>{m}</span></li>
            ))}
          </ul>
        </Section>

        <Section icon={Sparkles} title="À savoir absolument" color="from-purple-500 to-fuchsia-600">
          <ul className="space-y-2">
            {guide.importantFacts.map((f, i) => (
              <li key={i} className="flex gap-3"><span>⭐</span><span>{f}</span></li>
            ))}
          </ul>
        </Section>

        <Link to="/app/quiz/$chapterId" params={{ chapterId: chapter.id }}>
          <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-brand text-white font-semibold shadow-glow hover:scale-[1.01] transition">
            Tester mes connaissances avec un quiz
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

function Section({ icon: Icon, title, color, children }: { icon: React.ComponentType<{ className?: string }>; title: string; color: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card className="p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} grid place-items-center text-white shadow-soft`}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold font-display">{title}</h2>
        </div>
        <div className="text-foreground/90">{children}</div>
      </Card>
    </motion.div>
  );
}
