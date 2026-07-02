import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "@/components/ui-bits";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — ExamFacile" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("dhenne@examfacile.ga");
  const [pwd, setPwd] = useState("password");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || pwd.length < 4) return;
    setLoading(true);
    setTimeout(() => { setSuccess(true); setTimeout(() => navigate({ to: "/app/dashboard" }), 700); }, 800);
  };

  return (
    <AuthShell
      title="Heureux de vous revoir"
      subtitle="Connectez-vous pour reprendre vos révisions."
      illustration={
        <div className="absolute inset-0 w-full h-full bg-[#0d092c]">
          <img
            src="/sign.jpeg"
            alt="ExamFacile"
            className="w-full h-full object-cover object-center"
          />
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={Mail} type="email" placeholder="vous@lycee.ga" value={email} onChange={setEmail} />
        <div className="relative">
          <Field icon={Lock} type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={pwd} onChange={setPwd} />
          <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Afficher le mot de passe">
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Se souvenir de moi</label>
          <Link to="/forgot-password" className="text-primary hover:underline">Mot de passe oublié ?</Link>
        </div>
        <GradientButton type="submit" className="w-full" disabled={loading}>
          {success ? <><Check className="w-4 h-4" /> Connecté</> : loading ? "Connexion..." : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
        </GradientButton>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Nouveau sur ExamFacile ? <Link to="/register" className="text-primary font-semibold hover:underline">Créer un compte</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  illustration,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  illustration?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative gradient-brand text-white items-end overflow-hidden">
        {illustration ? (
          <>
            {illustration}
            <div className="absolute top-12 left-12 z-10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md grid place-items-center font-bold border border-white/20">
                  E
                </div>
                <span className="font-display font-bold text-xl text-white">ExamFacile</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="w-full h-full p-12 flex flex-col justify-end relative">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-12 left-12">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center font-bold">E</div>
                <span className="font-display font-bold text-xl text-white">ExamFacile</span>
              </Link>
            </div>
            <div className="relative">
              <h2 className="text-4xl font-bold font-display mb-4 max-w-md">Votre compagnon de révision boosté par l'IA.</h2>
              <p className="opacity-90 max-w-md">Leçons, quiz, fiches de révision et classement national — tout au même endroit pour réussir le bac.</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-brand grid place-items-center text-white font-bold">E</div>
            <span className="font-display font-bold text-xl">ExamFacile</span>
          </Link>
          <h1 className="text-3xl font-bold font-display mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, type, placeholder, value, onChange }: { icon: React.ComponentType<{ className?: string }>; type: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Icon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />
    </div>
  );
}
