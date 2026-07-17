import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { getCurrentUserFn } from "@/fns/auth.server";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const user = await getCurrentUserFn();
    if (!user) throw redirect({ to: "/login" });
    if (user.role !== "ADMIN") throw redirect({ to: "/app/dashboard" });
    return { user };
  },
  component: AdminLayout,
});
