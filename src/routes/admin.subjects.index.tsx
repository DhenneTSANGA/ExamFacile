import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
} from "@/components/AdminLayout";
import { createSubject, deleteSubject } from "@/lib/admin-api";
import { adminListSubjectsFn } from "@/fns/admin.server";

export const Route = createFileRoute("/admin/subjects/")({
  head: () => ({ meta: [{ title: "Matières — Admin ExamFacile" }] }),
  loader: () => adminListSubjectsFn(),
  component: AdminSubjects,
});

const emptyForm = {
  id: "",
  name: "",
  icon: "BookOpen",
  color: "#2563EB",
  gradient: "from-blue-500 to-indigo-600",
  description: "",
  sortOrder: 0,
};

function AdminSubjects() {
  const subjects = Route.useLoaderData();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }, [subjects, query]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name) return;
    setLoading(true);
    setError("");
    try {
      await createSubject(form);
      setShowForm(false);
      setForm(emptyForm);
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer la matière « ${name} » et tous ses chapitres ?`)) return;
    await deleteSubject(id);
    await router.invalidate();
  };

  return (
    <div>
      <AdminPageHeader title="Matières" subtitle="Créez et gérez les matières du bac.">
        <AdminButton onClick={() => setShowForm((s) => !s)}>
          <Plus className="w-4 h-4" /> Nouvelle matière
        </AdminButton>
      </AdminPageHeader>

      {showForm && (
        <AdminCard className="mb-6">
          <h2 className="font-bold mb-4">Nouvelle matière</h2>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
            <AdminField label="Identifiant (slug)">
              <AdminInput value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="math" required />
            </AdminField>
            <AdminField label="Nom">
              <AdminInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mathématiques" required />
            </AdminField>
            <AdminField label="Icône Lucide">
              <AdminInput value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Brain" />
            </AdminField>
            <AdminField label="Couleur hex">
              <AdminInput value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="#2563EB" />
            </AdminField>
            <AdminField label="Classes gradient Tailwind">
              <AdminInput value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} placeholder="from-blue-500 to-indigo-600" />
            </AdminField>
            <AdminField label="Ordre d'affichage">
              <AdminInput type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
            </AdminField>
            <div className="md:col-span-2">
              <AdminField label="Description">
                <AdminTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </AdminField>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <AdminButton type="submit" disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</AdminButton>
              <AdminButton type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une matière (nom, ID, description)…"
          aria-label="Rechercher une matière"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {query.trim() ? "Aucune matière ne correspond à votre recherche." : "Aucune matière pour le moment."}
          </p>
        ) : (
          filtered.map((s) => (
            <AdminCard key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="font-bold text-lg">{s.name}</div>
                <div className="text-sm text-muted-foreground">ID : {s.id} · {s._count?.chapters ?? 0} chapitres</div>
                <p className="text-sm mt-1 line-clamp-2">{s.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/admin/subjects/$id" params={{ id: s.id }}>
                  <AdminButton variant="outline"><Pencil className="w-4 h-4" /> Gérer</AdminButton>
                </Link>
                <AdminButton variant="danger" onClick={() => remove(s.id, s.name)}><Trash2 className="w-4 h-4" /></AdminButton>
              </div>
            </AdminCard>
          ))
        )}
      </div>
    </div>
  );
}
