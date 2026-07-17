import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { getBadgesFn } from "@/fns/progress.server";
import { Card, PageHeader, ProgressBar } from "@/components/ui-bits";

export const Route = createFileRoute("/app/achievements")({
  head: () => ({ meta: [{ title: "Badges — ExamFacile" }] }),
  loader: () => getBadgesFn(),
  component: Achievements,
});

function Achievements() {
  const badges = Route.useLoaderData();
  const unlocked = badges.filter((b) => b.unlocked);
  const locked = badges.filter((b) => !b.unlocked);

  return (
    <div>
      <PageHeader title="Vos badges" subtitle={`${unlocked.length} badges sur ${badges.length} débloqués`}>
        <div className="px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-soft">
          {badges.length ? Math.round((unlocked.length / badges.length) * 100) : 0} % accomplis
        </div>
      </PageHeader>

      <h2 className="font-bold text-lg mb-4">Débloqués</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {unlocked.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground">Complétez des leçons et quiz pour débloquer vos premiers badges.</p>
        ) : unlocked.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, type: "spring" }} whileHover={{ y: -4 }}>
            <Card className="p-6 text-center gradient-brand text-white shadow-glow">
              <div className="text-5xl mb-3">{b.emoji}</div>
              <div className="font-bold mb-1">{b.name}</div>
              <div className="text-xs opacity-80">{b.description}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-4">À débloquer</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {locked.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-6 text-center relative">
              <div className="text-5xl mb-3 grayscale opacity-40">{b.emoji}</div>
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted grid place-items-center"><Lock className="w-3.5 h-3.5 text-muted-foreground" /></div>
              <div className="font-bold mb-1">{b.name}</div>
              <div className="text-xs text-muted-foreground mb-3">{b.description}</div>
              <ProgressBar value={b.progress} />
              <div className="text-xs text-muted-foreground mt-2">{b.progress}%</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
