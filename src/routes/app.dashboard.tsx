import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Trophy, Target, TrendingUp, ChevronRight, Zap } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, BarChart, Bar, CartesianGrid } from "recharts";
import { mockUser, weeklyProgress, recentActivity, subjects, leaderboard, levelName } from "@/lib/mockData";
import { Card, PageHeader, ProgressBar } from "@/components/ui-bits";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — ExamFacile" }] }),
  component: Dashboard,
});

function Dashboard() {
  const xpToNext = 5000;
  const xpProgress = (mockUser.points / xpToNext) * 100;

  return (
    <div className="space-y-6">
      <PageHeader title={`Bon retour, ${mockUser.name} 👋`} subtitle="Voici votre progression aujourd'hui." />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="XP total" value={mockUser.points.toLocaleString("fr-FR")} color="from-blue-500 to-indigo-600" />
        <StatCard icon={Flame} label="Jours de série" value={`${mockUser.streak} 🔥`} color="from-orange-500 to-red-500" />
        <StatCard icon={Target} label="Quiz réalisés" value={mockUser.quizCompleted} color="from-emerald-500 to-teal-600" />
        <StatCard icon={Trophy} label="Rang national" value="#5" color="from-purple-500 to-fuchsia-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress overview */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Progression hebdomadaire</h3>
              <p className="text-sm text-muted-foreground">XP gagnés cette semaine</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">3 250 XP</div>
              <div className="text-xs text-muted-foreground"><TrendingUp className="w-3 h-3 inline" /> +18 % vs semaine dernière</div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Area type="monotone" dataKey="points" stroke="#7C3AED" strokeWidth={3} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Level progress */}
        <Card className="p-6 gradient-brand text-white shadow-glow">
          <div className="text-sm opacity-80">Niveau actuel</div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-bold font-display">{mockUser.level}</span>
            <span className="opacity-80">{levelName(mockUser.level)}</span>
          </div>
          <p className="text-sm opacity-80 mb-4">{(xpToNext - mockUser.points).toLocaleString("fr-FR")} XP avant le niveau {mockUser.level + 1}</p>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1 }} className="h-full bg-white rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {["Débutant", "Expert", "Champion"].map((l, i) => (
              <div key={l} className={`p-2 rounded-lg ${i === 1 ? "bg-white/25" : "bg-white/10"}`}>
                <div className="font-semibold">Niv. {[1, 10, 20][i]}</div>
                <div className="opacity-80">{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subjects */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Continuer l'apprentissage</h3>
            <Link to="/app/subjects" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">Toutes les matières <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {subjects.slice(0, 4).map((s) => (
              <Link key={s.id} to="/app/subjects/$id" params={{ id: s.id }} className="group">
                <div className="p-4 rounded-xl border border-border hover:border-primary hover:shadow-soft transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.gradient} grid place-items-center text-white`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">{s.progress}%</span>
                  </div>
                  <div className="font-semibold text-sm mb-2">{s.name}</div>
                  <ProgressBar value={s.progress} />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Activité récente</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50">
                <div className="text-2xl">{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </div>
                <div className="text-sm font-semibold text-primary">{a.score}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Votre position au classement</h3>
            <Link to="/app/leaderboard" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">Tout voir <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-2">
            {leaderboard.slice(3, 7).map((e) => (
              <div key={e.rank} className={`flex items-center gap-3 p-3 rounded-xl ${e.isUser ? "gradient-brand text-white shadow-glow" : "bg-muted/40"}`}>
                <div className={`w-8 h-8 rounded-lg grid place-items-center text-sm font-bold ${e.isUser ? "bg-white/20" : "bg-card"}`}>{e.rank}</div>
                <div className="flex-1"><div className="font-semibold text-sm">{e.name}</div><div className={`text-xs ${e.isUser ? "opacity-80" : "text-muted-foreground"}`}>Série {e.series}</div></div>
                <div className="font-bold text-sm">{e.points.toLocaleString("fr-FR")}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Minutes chart */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-1">Minutes d'étude</h3>
          <p className="text-sm text-muted-foreground mb-4">Temps passé à apprendre cette semaine</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="minutes" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; color: string }) {
  return (
    <Card hover className="p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} grid place-items-center text-white mb-3 shadow-soft`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold font-display">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}
