import { createFileRoute, Link } from "@tanstack/react-router";

import { BookOpen, HelpCircle, Layers, Trophy, Users } from "lucide-react";

import { AdminCard, AdminPageHeader } from "@/components/AdminLayout";

import { getAdminStatsFn } from "@/fns/admin.server";



export const Route = createFileRoute("/admin/")({

  head: () => ({ meta: [{ title: "Admin — ExamFacile" }] }),

  loader: () => getAdminStatsFn(),

  component: AdminDashboard,

});



function AdminDashboard() {

  const stats = Route.useLoaderData();



  const cards = [

    { label: "Matières", value: stats.subjects, icon: BookOpen, to: "/admin/subjects" },

    { label: "Chapitres", value: stats.chapters, icon: Layers, to: "/admin/subjects" },

    { label: "Questions quiz", value: stats.questions, icon: HelpCircle, to: "/admin/subjects" },

    { label: "Utilisateurs", value: stats.users, icon: Users, to: "/admin/users" },

    { label: "Badges", value: stats.badges, icon: Trophy, to: "/admin/badges" },

    { label: "Quiz passés", value: stats.attempts, icon: HelpCircle, to: "/admin/users" },

  ];



  return (

    <div>

      <AdminPageHeader

        title="Tableau de bord admin"

        subtitle="Gérez le contenu pédagogique, les badges et suivez l'activité de la plateforme."

      />



      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        {cards.map((c) => (

          <Link key={c.label} to={c.to}>

            <AdminCard className="hover:border-amber-500/50 transition-colors h-full">

              <div className="flex items-start justify-between">

                <div>

                  <div className="text-sm text-muted-foreground">{c.label}</div>

                  <div className="text-3xl font-bold mt-1">{c.value}</div>

                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-500/10 grid place-items-center text-amber-600">

                  <c.icon className="w-5 h-5" />

                </div>

              </div>

            </AdminCard>

          </Link>

        ))}

      </div>



      <AdminCard>

        <h2 className="font-bold text-lg mb-2">Démarrage rapide</h2>

        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">

          <li>Créez une <Link to="/admin/subjects" className="text-primary font-medium hover:underline">matière</Link> (ex. math, philo).</li>

          <li>Ajoutez des chapitres avec contenu auto-généré (leçon, fiche, quiz).</li>

          <li>Affinez le contenu dans l'éditeur de chapitre.</li>

          <li>Les élèves voient les changements immédiatement dans l'app.</li>

        </ol>

      </AdminCard>

    </div>

  );

}

