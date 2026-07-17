import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { useMemo, useState } from "react";
import { getLeaderboardFn } from "@/fns/progress.server";
import { Card, PageHeader } from "@/components/ui-bits";

const filters = ["National", "Série A1", "Série C", "Série D"] as const;

export const Route = createFileRoute("/app/leaderboard")({
  head: () => ({ meta: [{ title: "Classement — ExamFacile" }] }),
  loader: () => getLeaderboardFn({ data: { filter: "National" } }),
  component: Leaderboard,
});

function Leaderboard() {
  const initial = Route.useLoaderData();
  const [filter, setFilter] = useState<typeof filters[number]>("National");
  const [list, setList] = useState(initial);
  const [loading, setLoading] = useState(false);

  const podium = useMemo(() => list.slice(0, 3), [list]);

  const changeFilter = async (f: typeof filters[number]) => {
    setFilter(f);
    setLoading(true);
    try {
      setList(await getLeaderboardFn({ data: { filter: f } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Classement national" subtitle="Mesurez-vous aux lycéens de tout le Gabon — tri sur User.points.">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button key={f} onClick={() => changeFilter(f)} disabled={loading} className={`px-4 py-2 text-sm rounded-xl font-medium transition ${filter === f ? "gradient-brand text-white shadow-soft" : "bg-card border border-border hover:bg-muted"}`}>{f}</button>
          ))}
        </div>
      </PageHeader>

      {podium.length === 3 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 max-w-2xl mx-auto">
          {[podium[1], podium[0], podium[2]].map((e, i) => {
            const heights = ["h-32", "h-40", "h-28"];
            const colors = ["from-slate-300 to-slate-400", "from-amber-300 to-amber-500", "from-orange-400 to-orange-500"];
            const real = [1, 0, 2][i];
            return (
              <motion.div key={e.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: real * 0.1 }} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full gradient-brand grid place-items-center text-white font-bold text-xl mb-2 shadow-glow">{e.name[0]}</div>
                <div className="font-semibold text-sm truncate">{e.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{e.points.toLocaleString("fr-FR")} XP</div>
                <div className={`${heights[i]} rounded-t-2xl bg-gradient-to-b ${colors[i]} grid place-items-center text-white font-bold text-3xl shadow-soft`}>{e.rank}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-semibold uppercase text-muted-foreground">
          <div className="col-span-1">Rang</div>
          <div className="col-span-6">Élève</div>
          <div className="col-span-2">Série</div>
          <div className="col-span-3 text-right">Points</div>
        </div>
        {list.map((e, i) => (
          <motion.div key={`${e.rank}-${e.name}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
            className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-border last:border-0 items-center ${e.isUser ? "gradient-brand text-white" : "hover:bg-muted/40"}`}>
            <div className="col-span-2 md:col-span-1 font-bold flex items-center gap-1">
              {e.rank <= 3 ? <Medal className={`w-4 h-4 ${e.rank === 1 ? "text-amber-400" : e.rank === 2 ? "text-slate-300" : "text-orange-400"}`} /> : null}
              #{e.rank}
            </div>
            <div className="col-span-7 md:col-span-6 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full grid place-items-center font-bold text-sm ${e.isUser ? "bg-white/20" : "gradient-brand text-white"}`}>{e.name[0]}</div>
              <span className="font-semibold truncate">{e.name}{e.isUser && <span className="ml-2 text-xs opacity-80">(vous)</span>}</span>
            </div>
            <div className="col-span-3 md:col-span-2 text-sm">Série {e.series}</div>
            <div className="col-span-12 md:col-span-3 text-right font-bold flex items-center justify-end gap-1">
              <Trophy className="w-4 h-4 opacity-60" /> {e.points.toLocaleString("fr-FR")}
            </div>
          </motion.div>
        ))}
      </Card>
    </div>
  );
}
