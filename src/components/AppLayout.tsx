import { Link, Outlet, useRouterState, useRouteContext } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Trophy, Award, User, Sparkles, Flame, Menu, X, Shield,
} from "lucide-react";
import { useState } from "react";
import { levelName } from "@/lib/gamification";

const nav = [
  { to: "/app/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/app/subjects", label: "Matières", icon: BookOpen },
  { to: "/app/leaderboard", label: "Classement", icon: Trophy },
  { to: "/app/achievements", label: "Badges", icon: Award },
  { to: "/app/profile", label: "Profil", icon: User },
  { to: "/app/premium", label: "Premium", icon: Sparkles },
];

export function AppLayout() {
  const { user } = useRouteContext({ from: "/app" });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card/60 backdrop-blur-xl p-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl gradient-brand grid place-items-center text-white font-bold shadow-glow">E</div>
          <span className="font-display font-bold text-xl">ExamFacile</span>
        </Link>

        <div className="rounded-2xl p-4 mb-6 gradient-brand text-white shadow-glow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 grid place-items-center font-bold text-lg">{user.avatar}</div>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs opacity-90">Niv. {user.level} · {levelName(user.level)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-1"><Flame className="w-4 h-4" /> {user.streak} j</div>
            <div className="font-bold">{user.points.toLocaleString("fr-FR")} XP</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {active && <motion.div layoutId="navActive" className="absolute inset-0 rounded-xl gradient-brand -z-0" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
          {user.role === "ADMIN" && (
            <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname.startsWith("/admin") ? "bg-amber-500/15 text-amber-700" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              <Shield className="w-5 h-5" />
              Administration
            </Link>
          )}
        </nav>
      </aside>

      <div className="lg:hidden fixed top-0 inset-x-0 z-40 glass border-b border-border/50 flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-brand grid place-items-center text-white font-bold">E</div>
          <span className="font-display font-bold">ExamFacile</span>
        </Link>
        <button onClick={() => setOpen((o) => !o)} className="p-2 rounded-lg hover:bg-muted" aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden fixed inset-0 top-14 z-30 bg-background/95 backdrop-blur p-4">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium hover:bg-muted">
              <item.icon className="w-5 h-5" />{item.label}
            </Link>
          ))}
        </motion.div>
      )}

      <main className="flex-1 min-w-0 pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border/50 flex justify-around py-2">
        {nav.slice(0, 5).map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
