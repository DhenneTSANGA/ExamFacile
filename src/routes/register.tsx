import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { GradientButton } from "@/components/ui-bits";
import { AuthShell, Field } from "./login";
import { registerFn } from "@/fns/auth.server";

const SERIES = ["A1", "A2", "C", "D", "E", "F", "G", "H"] as const;

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Créer un compte — ExamFacile" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [series, setSeries] = useState<(typeof SERIES)[number]>("A1");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || !email.includes("@") || pwd.length < 6) return;
    setLoading(true);
    setError("");
    try {
      await registerFn({ data: { name, email, password: pwd, series } });
      setDone(true);
      setTimeout(() => navigate({ to: "/app/dashboard" }), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Commencez gratuitement" subtitle="Créez votre compte et lancez votre première leçon en 60 secondes.">
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl">{error}</p>}
        <Field icon={User} type="text" placeholder="Nom complet" value={name} onChange={setName} />
        <Field icon={Mail} type="email" placeholder="vous@lycee.ga" value={email} onChange={setEmail} />
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Série du bac</label>
          <select value={series} onChange={(e) => setSeries(e.target.value as (typeof SERIES)[number])} className="w-full px-4 py-3.5 rounded-xl bg-card border border-border focus:border-primary outline-none">
            {SERIES.map((s) => <option key={s} value={s}>Série {s}</option>)}
          </select>
        </div>
        <div className="relative">
          <Field icon={Lock} type={show ? "text" : "password"} placeholder="Mot de passe (6+ caractères)" value={pwd} onChange={setPwd} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Afficher le mot de passe">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <GradientButton type="submit" className="w-full" disabled={loading}>
          {done ? <><Check className="w-4 h-4" /> Compte créé</> : loading ? "Création du compte..." : <>Créer mon compte <ArrowRight className="w-4 h-4" /></>}
        </GradientButton>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Vous avez déjà un compte ? <Link to="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
      </p>
    </AuthShell>
  );
}
