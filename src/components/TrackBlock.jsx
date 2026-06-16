import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { TODAY, TRACK_ICON } from "../data/constants";
import { fmt } from "../data/hires";
import { useT } from "../i18n";

export function TrackBlock({ track, tasks, onToggle }) {
  const { t } = useT();
  const locale = t.meta.locale;
  const Icon = TRACK_ICON[track];
  const done = tasks.filter((task) => task.done).length;
  const isCompliance = track === "Compliance & regulatory";
  const trackLabel = t.tracks[track] ?? track;

  return (
    <div className={`rounded-xl border bg-white ${isCompliance ? "border-amber-200" : "border-slate-200"}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Icon size={17} className={isCompliance ? "text-amber-600" : "text-slate-400"} />
          <span className="text-sm font-medium text-slate-700">{trackLabel}</span>
          {isCompliance && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              {t.trackBlock.regulated}
            </span>
          )}
        </div>
        <span className="text-xs tabular-nums text-slate-400">{t.trackBlock.countOf(done, tasks.length)}</span>
      </div>
      <div className="border-t border-slate-100">
        {tasks.map((task) => {
          const label = t.taskLabels[task.label] ?? task.label;
          const assignee = t.teams[task.assignee] ?? task.assignee;
          return (
            <button
              key={task.id}
              onClick={() => onToggle(task.id)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
            >
              {task.done
                ? <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                : <Circle size={18} className="shrink-0 text-slate-300" />}
              <span className={`flex-1 text-sm ${task.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                {label}
              </span>
              <span className="hidden text-xs text-slate-400 sm:inline">{assignee}</span>
              <span className={`inline-flex items-center gap-1 text-xs tabular-nums ${!task.done && task.due < TODAY ? "text-rose-500" : "text-slate-400"}`}>
                {!task.done && task.due < TODAY && <AlertTriangle size={12} />}
                {fmt(task.due, locale)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
