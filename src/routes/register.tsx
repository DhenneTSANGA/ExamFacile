import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { GradientButton } from "@/components/ui-bits";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Créer un compte — ExamFacile" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || !email.includes("@") || pwd.length < 6) return;
    setLoading(true);
    setTimeout(() => { setDone(true); setTimeout(() => navigate({ to: "/app/dashboard" }), 800); }, 800);
  };

  return (
    <AuthShell title="Commencez gratuitement" subtitle="Créez votre compte et lancez votre première leçon en 60 secondes.">
      <form onSubmit={submit} className="space-y-4">
        <Field icon={User} type="text" placeholder="Nom complet" value={name} onChange={setName} />
        <Field icon={Mail} type="email" placeholder="vous@lycee.ga" value={email} onChange={setEmail} />
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
