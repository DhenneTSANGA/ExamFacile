import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Plus, Trash2 } from "lucide-react";

import { useState } from "react";

import {

  AdminButton,

  AdminCard,

  AdminField,

  AdminInput,

  AdminPageHeader,

  AdminTextarea,

} from "@/components/AdminLayout";

import { createBadge, deleteBadge } from "@/lib/admin-api";
import { adminListBadgesFn } from "@/fns/admin.server";



export const Route = createFileRoute("/admin/badges")({

  head: () => ({ meta: [{ title: "Badges — Admin ExamFacile" }] }),

  loader: () => adminListBadgesFn(),

  component: AdminBadges,

});



const empty = { id: "", name: "", emoji: "🏅", description: "", sortOrder: 0 };



function AdminBadges() {

  const badges = Route.useLoaderData();

  const router = useRouter();

  const [form, setForm] = useState(empty);

  const [show, setShow] = useState(false);



  const save = async (e: React.FormEvent) => {

    e.preventDefault();

    await createBadge(form);

    setForm(empty);

    setShow(false);

    await router.invalidate();

  };



  const remove = async (id: string) => {

    if (!confirm("Supprimer ce badge ?")) return;

    await deleteBadge(id);

    await router.invalidate();

  };



  return (

    <div>

      <AdminPageHeader title="Badges" subtitle="Récompenses gamification de la plateforme.">

        <AdminButton onClick={() => setShow((s) => !s)}><Plus className="w-4 h-4" /> Nouveau badge</AdminButton>

      </AdminPageHeader>



      {show && (

        <AdminCard className="mb-6">

          <form onSubmit={save} className="grid md:grid-cols-2 gap-4">

            <AdminField label="ID"><AdminInput value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required /></AdminField>

            <AdminField label="Nom"><AdminInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></AdminField>

            <AdminField label="Emoji"><AdminInput value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} /></AdminField>

            <AdminField label="Ordre"><AdminInput type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></AdminField>

            <div className="md:col-span-2"><AdminField label="Description"><AdminTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></AdminField></div>

            <div className="md:col-span-2 flex gap-2">

              <AdminButton type="submit">Enregistrer</AdminButton>

              <AdminButton type="button" variant="outline" onClick={() => setShow(false)}>Annuler</AdminButton>

            </div>

          </form>

        </AdminCard>

      )}



      <div className="grid sm:grid-cols-2 gap-4">

        {badges.map((b) => (

          <AdminCard key={b.id}>

            <div className="flex items-start justify-between gap-3">

              <div>

                <div className="text-3xl mb-2">{b.emoji}</div>

                <div className="font-bold">{b.name}</div>

                <div className="text-xs text-muted-foreground mb-2">{b.id}</div>

                <p className="text-sm text-muted-foreground">{b.description}</p>

              </div>

              <AdminButton variant="danger" onClick={() => remove(b.id)}><Trash2 className="w-4 h-4" /></AdminButton>

            </div>

          </AdminCard>

        ))}

      </div>

    </div>

  );

}

