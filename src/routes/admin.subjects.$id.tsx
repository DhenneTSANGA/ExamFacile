import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
} from "@/components/AdminLayout";
import { createChapter, deleteChapter, updateSubject } from "@/lib/admin-api";
import { adminGetSubjectFn } from "@/fns/admin.server";

export const Route = createFileRoute("/admin/subjects/$id")({
  loader: ({ params }) => adminGetSubjectFn({ data: { id: params.id } }),
  component: AdminSubjectDetail,
});
s
function AdminSubjectDetail() {
  const subject = Route.useLoaderData();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [chapterForm, setChapterForm] = useState({ id: "", title: "", duration: 20, sortOrder: 0, withContent: true });
  const [showChapter, setShowChapter] = useState(false);
  const [chapterQuery, setChapterQuery] = useState("");
  const [meta, setMeta] = useState({
    name: subject?.name ?? "",
    icon: subject?.icon ?? "BookOpen",
    color: subject?.color ?? "#2563EB",
    gradient: subject?.gradient ?? "",
    description: subject?.description ?? "",
    sortOrder: subject?.sortOrder ?? 0,
  });

  const filteredChapters = useMemo(() => {
    if (!subject) return [];
    const q = chapterQuery.trim().toLowerCase();
    if (!q) return subject.chapters;
    return subject.chapters.filter(
      (c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [subject, chapterQuery]);

  if (!subject) {
    return <div className="text-center text-muted-foreground py-12">Matière introuvable.</div>;
  }

  const saveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateSubject(subject.id, meta);
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const addChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.id || !chapterForm.title) return;
    setLoading(true);
    try {
      await createChapter({
        ...chapterForm,
        subjectId: subject.id,
      });
      setShowChapter(false);
      setChapterForm({ id: "", title: "", duration: 20, sortOrder: subject.chapters.length, withContent: true });
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const removeChapter = async (id: string, title: string) => {
    if (!confirm(`Supprimer le chapitre « ${title} » ?`)) return;
    await deleteChapter(id);
    await router.invalidate();
  };

  return (
    <div>
      <Link to="/admin/subjects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Toutes les matières
      </Link>

      <AdminPageHeader title={subject.name} subtitle={`Gestion des chapitres · ID ${subject.id}`}>
        <Link to="/app/subjects/$id" params={{ id: subject.id }} target="_blank">
          <AdminButton variant="outline"><ExternalLink className="w-4 h-4" /> Aperçu élève</AdminButton>
        </Link>
      </AdminPageHeader>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <AdminCard className="mb-6">
        <h2 className="font-bold mb-4">Informations matière</h2>
        <form onSubmit={saveMeta} className="grid md:grid-cols-2 gap-4">
          <AdminField label="Nom"><AdminInput value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} required /></AdminField>
          <AdminField label="Icône"><AdminInput value={meta.icon} onChange={(e) => setMeta({ ...meta, icon: e.target.value })} /></AdminField>
          <AdminField label="Couleur"><AdminInput value={meta.color} onChange={(e) => setMeta({ ...meta, color: e.target.value })} /></AdminField>
          <AdminField label="Gradient"><AdminInput value={meta.gradient} onChange={(e) => setMeta({ ...meta, gradient: e.target.value })} /></AdminField>
          <div className="md:col-span-2"><AdminField label="Description"><AdminTextarea value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} /></AdminField></div>
          <div><AdminButton type="submit" disabled={loading}>Mettre à jour</AdminButton></div>
        </form>
      </AdminCard>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="font-bold text-lg">Chapitres / leçons ({subject.chapters.length})</h2>
        <AdminButton onClick={() => setShowChapter((s) => !s)}><Plus className="w-4 h-4" /> Ajouter un chapitre</AdminButton>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={chapterQuery}
          onChange={(e) => setChapterQuery(e.target.value)}
          placeholder="Rechercher une leçon ou un chapitre (titre, ID)…"
          aria-label="Rechercher une leçon"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {showChapter && (
        <AdminCard className="mb-4">
          <form onSubmit={addChapter} className="grid md:grid-cols-2 gap-4">
            <AdminField label="ID chapitre"><AdminInput value={chapterForm.id} onChange={(e) => setChapterForm({ ...chapterForm, id: e.target.value })} placeholder={`${subject.id}-11`} required /></AdminField>
            <AdminField label="Titre"><AdminInput value={chapterForm.title} onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })} required /></AdminField>
            <AdminField label="Durée (min)"><AdminInput type="number" value={chapterForm.duration} onChange={(e) => setChapterForm({ ...chapterForm, duration: Number(e.target.value) })} /></AdminField>
            <AdminField label="Ordre"><AdminInput type="number" value={chapterForm.sortOrder} onChange={(e) => setChapterForm({ ...chapterForm, sortOrder: Number(e.target.value) })} /></AdminField>
            <label className="md:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={chapterForm.withContent} onChange={(e) => setChapterForm({ ...chapterForm, withContent: e.target.checked })} />
              Générer automatiquement leçon, fiche de révision et questions quiz
            </label>
            <div className="md:col-span-2 flex gap-2">
              <AdminButton type="submit" disabled={loading}>Créer le chapitre</AdminButton>
              <AdminButton type="button" variant="outline" onClick={() => setShowChapter(false)}>Annuler</AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      <div className="space-y-3">
        {filteredChapters.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {chapterQuery.trim()
              ? "Aucun chapitre / leçon ne correspond à votre recherche."
              : "Aucun chapitre pour le moment."}
          </p>
        ) : (
          filteredChapters.map((c) => (
            <AdminCard key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-muted-foreground">{c.id} · {c.duration} min · {c._count?.questions ?? 0} questions</div>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/chapters/$id" params={{ id: c.id }}>
                  <AdminButton variant="outline">Éditer le contenu</AdminButton>
                </Link>
                <AdminButton variant="danger" onClick={() => removeChapter(c.id, c.title)}><Trash2 className="w-4 h-4" /></AdminButton>
              </div>
            </AdminCard>
          ))
        )}
      </div>
    </div>
  );
}
