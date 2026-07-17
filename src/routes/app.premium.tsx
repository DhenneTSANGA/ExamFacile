import { createFileRoute, useRouteContext, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { upgradePremiumFn } from "@/fns/auth.server";
import { Card, PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/app/premium")({
  head: () => ({ meta: [{ title: "Premium — ExamFacile" }] }),
  component: Premium,
});

const plans = [
  {
    name: "Gratuit",
    price: "0",
    desc: "Commencez avec l'essentiel — créé automatiquement à l'inscription.",
    features: ["3 leçons par semaine", "2 quiz par jour", "Suivi de progression basique", "Classement communautaire"],
    highlight: false,
  },
  {
    name: "Premium",
    price: "4 990",
    desc: "Tout ce qu'il vous faut pour exceller.",
    features: ["Leçons illimitées", "Quiz illimités", "Fiches IA personnalisées", "Statistiques avancées", "Classement national complet", "Narration IA prioritaire", "Accès hors-ligne", "Tuteur IA personnel"],
    highlight: true,
  },
];

function Premium() {
  const { user } = useRouteContext({ from: "/app" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isPremium = user.plan === "PREMIUM";

  const upgrade = async () => {
    setLoading(true);
    try {
      await upgradePremiumFn();
      await router.invalidate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Passez à Premium" subtitle="Votre abonnement actuel : Gratuit par défaut à l'inscription, Premium via cette page." />

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((p, i) => {
          const isCurrent = p.highlight ? isPremium : !isPremium;
          const cta = p.highlight ? (isPremium ? "Plan actuel" : "Passer Premium") : isPremium ? "Inclus dans Premium" : "Plan actuel";

          return (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`p-8 h-full relative ${p.highlight ? "gradient-brand text-white shadow-glow border-0" : ""}`}>
                {p.highlight && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold inline-flex items-center gap-1"><Zap className="w-3 h-3" /> Meilleur choix</div>
                )}
                <div className={`text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"} mb-1`}>{p.highlight && <Sparkles className="w-4 h-4 inline mr-1" />}{p.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold font-display">{p.price}</span>
                  <span className={p.highlight ? "opacity-80" : "text-muted-foreground"}>FCFA / mois</span>
                </div>
                <p className={`text-sm mb-6 ${p.highlight ? "opacity-90" : "text-muted-foreground"}`}>{p.desc}</p>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full grid place-items-center shrink-0 ${p.highlight ? "bg-white/20" : "bg-emerald-100 text-emerald-600"}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent || (p.highlight && loading)}
                  onClick={p.highlight && !isPremium ? upgrade : undefined}
                  className={`w-full py-3.5 rounded-xl font-semibold transition disabled:opacity-70 ${p.highlight ? "bg-white text-primary hover:scale-[1.02]" : "bg-card border border-border hover:bg-muted"}`}
                >
                  {p.highlight && loading ? "Mise à jour..." : cta}
                </button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-10 text-sm text-muted-foreground">
        7 jours d'essai gratuit · Annulation à tout moment · Sans carte bancaire
      </div>
    </div>
  );
}
