import { Link, Outlet, useRouterState, useRouteContext } from "@tanstack/react-router";
import {
  LayoutDashboard, BookOpen, Award, Users, ArrowLeft, Shield, Menu, X,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { to: "/admin/subjects", label: "Matières & chapitres", icon: BookOpen },
  { to: "/admin/badges", label: "Badges", icon: Award },
  { to: "/admin/users", label: "Utilisateurs", icon: Users },
];

export function AdminLayout() {
  const { user } = useRouteContext({ from: "/admin" });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-slate-950 text-slate-100 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500 grid place-items-center text-slate-950 font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-lg">Admin ExamFacile</div>
            <div className="text-xs text-slate-400">Gestion de contenu</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 px-2">Connecté : {user.name}</div>
          <Link to="/app/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Retour à l'app élève
          </Link>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-slate-950 text-white flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold">
          <Shield className="w-5 h-5 text-amber-500" /> Admin
        </div>
        <button onClick={() => setOpen((o) => !o)} className="p-2" aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-14 z-30 bg-slate-950 p-4 space-y-1">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-xl text-white hover:bg-slate-900">
              <item.icon className="w-5 h-5" />{item.label}
            </Link>
          ))}
          <Link to="/app/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-xl text-slate-300">
            <ArrowLeft className="w-5 h-5" /> App élève
          </Link>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold font-display">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] ${props.className ?? ""}`}
    />
  );
}

export function AdminButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "danger" | "outline"; children: React.ReactNode }) {
  const styles = {
    primary: "bg-amber-500 hover:bg-amber-400 text-slate-950",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    outline: "bg-card border border-border hover:bg-muted",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-card rounded-2xl border border-border shadow-soft p-6 ${className}`}>{children}</div>;
}
