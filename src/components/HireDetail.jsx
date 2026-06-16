import { ArrowLeft } from "lucide-react";
import { TRACK_ORDER } from "../data/constants";
import { derive, fmt, initials } from "../data/hires";
import { Eyebrow, Ring, StatusPill } from "./primitives";
import { TrackBlock } from "./TrackBlock";
import { useT } from "../i18n";

export function HireDetail({ hire, onBack, onToggle }) {
  const { t } = useT();
  const locale = t.meta.locale;
  const d = derive(hire);
  const byTrack = TRACK_ORDER
    .map((track) => ({ track, tasks: hire.tasks.filter((tk) => tk.track === track) }))
    .filter((g) => g.tasks.length);
  const tplLabel = t.templateLabels[hire.templateKey]?.label ?? "";
  const tplDept = t.templateLabels[hire.templateKey]?.department ?? "";

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} /> {t.hireDetail.back}
      </button>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sm font-medium text-sky-700">
              {initials(hire.name)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-semibold text-slate-900">{hire.name}</h2>
                <StatusPill statusKey={d.status} />
              </div>
              <div className="mt-0.5 text-sm text-slate-500">{hire.role} · {tplDept}</div>
              <div className="mt-1 text-xs text-slate-400">
                {t.hireDetail.metaLine(fmt(hire.start, locale), hire.owner, tplLabel)}
              </div>
            </div>
          </div>
          <Ring pct={d.pct} />
        </div>
      </div>

      <div className="space-y-3">
        <Eyebrow>{t.hireDetail.checklist(d.done, d.total)}</Eyebrow>
        {byTrack.map((g) => (
          <TrackBlock
            key={g.track}
            track={g.track}
            tasks={g.tasks}
            onToggle={(taskId) => onToggle(hire.id, taskId)}
          />
        ))}
      </div>
    </div>
  );
}
