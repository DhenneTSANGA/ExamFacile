import { createFileRoute } from "@tanstack/react-router";

import { AdminCard, AdminPageHeader } from "@/components/AdminLayout";

import { adminListUsersFn } from "@/fns/admin.server";



export const Route = createFileRoute("/admin/users")({

  head: () => ({ meta: [{ title: "Utilisateurs — Admin ExamFacile" }] }),

  loader: () => adminListUsersFn(),

  component: AdminUsers,

});



function AdminUsers() {

  const users = Route.useLoaderData();



  return (

    <div>

      <AdminPageHeader title="Utilisateurs" subtitle={`${users.length} comptes enregistrés.`} />



      <div className="overflow-x-auto rounded-2xl border border-border bg-card">

        <table className="w-full text-sm">

          <thead className="bg-muted/50 text-left">

            <tr>

              <th className="p-4 font-semibold">Nom</th>

              <th className="p-4 font-semibold">E-mail</th>

              <th className="p-4 font-semibold">Rôle</th>

              <th className="p-4 font-semibold">Série</th>

              <th className="p-4 font-semibold">Niveau</th>

              <th className="p-4 font-semibold">XP</th>

              <th className="p-4 font-semibold">Plan</th>

            </tr>

          </thead>

          <tbody>

            {users.map((u) => (

              <tr key={u.id} className="border-t border-border hover:bg-muted/30">

                <td className="p-4 font-medium">{u.name}</td>

                <td className="p-4 text-muted-foreground">{u.email}</td>

                <td className="p-4">

                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === "ADMIN" ? "bg-amber-500/20 text-amber-700" : "bg-muted"}`}>

                    {u.role}

                  </span>

                </td>

                <td className="p-4">{u.series}</td>

                <td className="p-4">{u.level}</td>

                <td className="p-4">{u.points.toLocaleString("fr-FR")}</td>

                <td className="p-4">{u.subscription?.plan ?? "—"}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>



      <AdminCard className="mt-6">

        <p className="text-sm text-muted-foreground">

          Pour promouvoir un utilisateur en administrateur, mettez à jour son champ <code className="text-xs bg-muted px-1 rounded">role</code> à <code className="text-xs bg-muted px-1 rounded">ADMIN</code> via Prisma Studio ou une migration SQL.

        </p>

      </AdminCard>

    </div>

  );

}

