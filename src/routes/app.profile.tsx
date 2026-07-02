import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Edit2 } from "lucide-react";
import { mockUser, levelName } from "@/lib/mockData";
import { Card, PageHeader, GradientButton } from "@/components/ui-bits";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profil — ExamFacile" }] }),
  component: Profile,
});

function Profile() {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(mockUser);
  const [saved, setSaved] = useState(false);

  const save = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <PageHeader title="Votre profil" subtitle="Gérez votre compte et vos préférences d'apprentissage." />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center lg:col-span-1">
          <div className="w-24 h-24 mx-auto rounded-full gradient-brand grid place-items-center text-white text-4xl font-bold shadow-glow mb-4">{user.avatar}</div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-semibold">Niv. {user.level} · {levelName(user.level)}</div>

          <div className="grid grid-cols-3 gap-2 mt-6 text-center">
            <div className="p-3 rounded-xl bg-muted/40">
              <div className="font-bold text-lg">{user.points.toLocaleString("fr-FR")}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
            <div className="p-3 rounded-xl bg-muted/40">
              <div className="font-bold text-lg">{user.streak}</div>
              <div className="text-xs text-muted-foreground">Série</div>
            </div>
            <div className="p-3 rounded-xl bg-muted/40">
              <div className="font-bold text-lg">{user.quizCompleted}</div>
              <div className="text-xs text-muted-foreground">Quiz</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Informations personnelles</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline"><Edit2 className="w-4 h-4" /> Modifier</button>
            ) : saved && <span className="text-emerald-600 text-sm inline-flex items-center gap-1"><Check className="w-4 h-4" /> Enregistré</span>}
          </div>
          <div className="space-y-4">
            <Row label="Nom complet" value={user.name} editing={editing} onChange={(v) => setUser({ ...user, name: v })} />
            <Row label="E-mail" value={user.email} editing={editing} onChange={(v) => setUser({ ...user, email: v })} />
            <Row label="Série" value={user.series} editing={editing} onChange={(v) => setUser({ ...user, series: v })} />
          </div>
          {editing && (
            <div className="flex gap-2 mt-6">
              <GradientButton onClick={save}>Enregistrer</GradientButton>
              <button onClick={() => { setUser(mockUser); setEditing(false); }} className="px-6 py-3 rounded-xl bg-muted font-semibold hover:bg-muted/70">Annuler</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, editing, onChange }: { label: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      {editing ? (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
      ) : (
        <div className="mt-1 px-4 py-3 rounded-xl bg-muted/40 font-medium">{value}</div>
      )}
    </div>
  );
}
