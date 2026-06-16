import { useMemo } from "react";
import { TODAY } from "../data/constants";
import { addDays, derive } from "../data/hires";
import { Stat } from "./primitives";
import { HireTable } from "./HireTable";

export function Dashboard({ hires, onOpen }) {
  const stats = useMemo(() => {
    const active = hires.filter((h) => derive(h).pct < 100).length;
    const week = hires.filter((h) => h.start >= TODAY && h.start <= addDays(TODAY, 7)).length;
    const overdue = hires.reduce((s, h) => s + derive(h).overdue, 0);
    return { active, week, overdue };
  }, [hires]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Active onboardings" value={stats.active} />
        <Stat label="Starting this week" value={stats.week} />
        <Stat label="Tasks overdue" value={stats.overdue} danger={stats.overdue > 0} />
        <Stat label="Avg. days to onboard" value="11" />
      </div>
      <HireTable hires={hires} onOpen={onOpen} />
    </div>
  );
}
