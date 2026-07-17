import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { resolveSubjectIcon } from "@/lib/icons";
import { getSubjectsFn } from "@/fns/content.server";
import { Card, PageHeader, ProgressBar } from "@/components/ui-bits";

export const Route = createFileRoute("/app/subjects/")({
  head: () => ({ meta: [{ title: "Matières — ExamFacile" }] }),
  loader: () => getSubjectsFn(),
  component: Subjects,
});

function Subjects() {
  const subjects = Route.useLoaderData();

  return (
    <div>
      <PageHeader title="Vos matières" subtitle="Choisissez une matière et reprenez là où vous vous êtes arrêté." />
      <div className="grid md:grid-cols-2 gap-6">
        {subjects.map((s, i) => {
          const Icon = resolveSubjectIcon(s.icon);
          return (
            <motion.div key={s.id} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to="/app/subjects/$id" params={{ id: s.id }}>
                <Card hover className="overflow-hidden">
                  <div className={`h-32 bg-gradient-to-br ${s.gradient} relative grid place-items-center`}>
                    <Icon className="w-16 h-16 text-white/90" />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold">{s.chaptersCount} chapitres</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-semibold">{s.progress}%</span>
                    </div>
                    <ProgressBar value={s.progress} />
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">Continuer</span>
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
