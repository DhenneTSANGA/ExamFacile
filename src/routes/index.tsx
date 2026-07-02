import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, BookOpen, Brain, Trophy, Award, TrendingUp, ChevronRight, Star, Zap, Check,
} from "lucide-react";
import { GradientButton, OutlineButton, Card } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExamFacile — Réussissez le Bac avec confiance" },
      { name: "description", content: "Préparation au baccalauréat assistée par IA : leçons interactives, quiz, fiches de révision et classement national pour les lycéens du Gabon." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: BookOpen, title: "Leçons interactives", desc: "Des leçons soignées qui transforment la théorie dense en lectures de 5 minutes.", color: "from-blue-500 to-indigo-600" },
  { icon: Sparkles, title: "Fiches IA", desc: "Notes personnalisées, notions clés et conseils d'examen générés pour vous.", color: "from-purple-500 to-fuchsia-600" },
  { icon: Brain, title: "Quiz intelligents", desc: "Questions adaptatives qui ciblent vos points faibles et s'ajustent à votre niveau.", color: "from-emerald-500 to-teal-600" },
  { icon: TrendingUp, title: "Suivi de progression", desc: "Statistiques hebdomadaires, séries et XP pour rester motivé chaque jour.", color: "from-amber-500 to-orange-600" },
  { icon: Trophy, title: "Classement national", desc: "Mesurez-vous aux lycéens de tout le Gabon et grimpez dans le classement.", color: "from-pink-500 to-rose-600" },
  { icon: Award, title: "Badges & succès", desc: "Débloquez des badges, montez de niveau et faites de la révision une habitude.", color: "from-cyan-500 to-sky-600" },
];

const steps = [
  { n: 1, t: "Choisissez votre matière", d: "Maths, philo, français, histoire-géo et bien plus." },
  { n: 2, t: "Étudiez la leçon", d: "Des explications claires avec exemples et narration IA." },
  { n: 3, t: "Faites les quiz", d: "Testez vos acquis avec des défis de 10 questions." },
  { n: 4, t: "Améliorez votre score", d: "Suivez vos progrès et gagnez de l'XP à chaque session." },
  { n: 5, t: "Réussissez le bac", d: "Présentez-vous à l'examen national en pleine confiance." },
];

const testimonials = [
  { name: "Amina K.", series: "Série C", quote: "Je suis passée de moyenne au top 50 national en 3 mois. Les fiches IA sont incroyables.", avatar: "A" },
  { name: "Jules M.", series: "Série A1", quote: "Les quiz rendent les révisions ludiques. J'attends ma série quotidienne avec impatience.", avatar: "J" },
  { name: "Sara D.", series: "Série D", quote: "Le meilleur investissement pour mon année de bac. Mention obtenue !", avatar: "S" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b border-border/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-brand grid place-items-center text-white font-bold shadow-glow">E</div>
            <span className="font-display font-bold text-lg">ExamFacile</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Fonctionnalités</a>
            <a href="#how" className="hover:text-foreground">Comment ça marche</a>
            <a href="#pricing" className="hover:text-foreground">Tarifs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium px-4 py-2 hover:text-primary">Connexion</Link>
            <Link to="/register"><GradientButton className="text-sm py-2.5">Commencer</GradientButton></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              Votre compagnon de révision boosté par l'IA
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.05] mb-6">
              Réussissez le bac en toute <span className="gradient-text">confiance</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Apprenez plus intelligemment avec des leçons, des quiz interactifs, des fiches générées par IA et un suivi gamifié — pensé pour les lycéens du Gabon.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register"><GradientButton>Essai gratuit <ChevronRight className="w-4 h-4" /></GradientButton></Link>
              <Link to="/app/dashboard"><OutlineButton>Découvrir la plateforme</OutlineButton></Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-semibold text-foreground">4,9</span> · 12k avis</div>
              <div>30 000+ élèves actifs</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            <div className="relative aspect-[4/5] rounded-3xl gradient-brand p-1 shadow-glow">
              <div className="w-full h-full rounded-[1.4rem] bg-card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Leçon du jour</div>
                    <div className="font-bold text-lg">Fonctions & Limites</div>
                  </div>
                  <div className="text-2xl">📐</div>
                </div>
                <div className="space-y-3 flex-1">
                  {[80, 65, 90, 45].map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/50">
                      <div className="flex justify-between text-xs mb-2"><span>Chapitre {i + 1}</span><span>{v}%</span></div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} className="h-full gradient-brand" /></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-xl gradient-brand text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs opacity-80">Série quotidienne</div>
                    <div className="font-bold text-xl">🔥 12 jours</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">XP aujourd'hui</div>
                    <div className="font-bold text-xl">+340</div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-6 -left-8 glass rounded-2xl p-4 shadow-soft hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 grid place-items-center text-white">🏅</div>
              <div><div className="text-xs text-muted-foreground">Débloqué</div><div className="font-semibold text-sm">Badge Expert</div></div>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-6 -right-4 glass rounded-2xl p-4 shadow-soft hidden md:block">
              <div className="text-xs text-muted-foreground">Rang #5</div>
              <div className="font-bold gradient-text text-lg">Top 10 national</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Tout ce qu'il faut pour <span className="gradient-text">réussir</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Un système d'apprentissage complet, conçu pour la façon dont les élèves révisent vraiment.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card hover className="p-6 h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} grid place-items-center text-white mb-4 shadow-soft`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-24 bg-card/40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Comment ça marche</h2>
            <p className="text-muted-foreground">Cinq étapes simples, de votre première leçon à la réussite du bac.</p>
          </div>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-6 p-6 rounded-2xl bg-card border border-border shadow-soft">
                <div className="w-12 h-12 rounded-xl gradient-brand grid place-items-center text-white font-bold text-lg shadow-glow shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-bold text-lg">{s.t}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Adopté par les <span className="gradient-text">lycéens</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="p-6 h-full">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-foreground mb-6 leading-relaxed">«&nbsp;{t.quote}&nbsp;»</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-brand grid place-items-center text-white font-bold">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.series}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-5xl mx-auto rounded-3xl gradient-brand p-12 md:p-16 text-center text-white shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" /> Offre limitée · -50 % le premier mois
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-display mb-4">Prêt à décrocher votre bac ?</h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">Rejoignez plus de 30 000 élèves qui révisent plus intelligemment chaque jour avec ExamFacile.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register"><button className="px-7 py-3.5 rounded-xl bg-white text-primary font-bold hover:scale-[1.02] transition-transform shadow-soft">Créer un compte gratuit</button></Link>
              <Link to="/app/dashboard"><button className="px-7 py-3.5 rounded-xl bg-white/10 border border-white/30 font-bold hover:bg-white/20 transition-colors">Découvrir la plateforme</button></Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm opacity-90">
              {["Sans carte bancaire", "Annulation à tout moment", "Accès complet"].map((x) => <div key={x} className="flex items-center gap-1.5"><Check className="w-4 h-4" />{x}</div>)}
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ExamFacile · Conçu avec soin pour les lycéens du Gabon.
      </footer>
    </div>
  );
}
