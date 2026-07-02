import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";
import { GradientButton } from "@/components/ui-bits";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Mot de passe oublié — ExamFacile" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setTimeout(() => setSent(true), 600);
  };

  return (
    <AuthShell title="Réinitialiser votre mot de passe" subtitle="Nous vous enverrons un lien sécurisé pour en définir un nouveau.">
      {sent ? (
        <div className="rounded-2xl p-6 bg-emerald-50 border border-emerald-200 text-emerald-900">
          <div className="flex items-center gap-3 font-semibold mb-1"><Check className="w-5 h-5" /> E-mail envoyé</div>
          <p className="text-sm">Consultez votre boîte de réception pour le lien de réinitialisation.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field icon={Mail} type="email" placeholder="votre@email.ga" value={email} onChange={setEmail} />
          <GradientButton type="submit" className="w-full">Envoyer le lien <ArrowRight className="w-4 h-4" /></GradientButton>
        </form>
      )}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Retour à la <Link to="/login" className="text-primary font-semibold hover:underline">connexion</Link>
      </p>
    </AuthShell>
  );
}
