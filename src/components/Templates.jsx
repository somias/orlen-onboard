import { ChevronRight } from "lucide-react";
import { TEMPLATES } from "../data/templates";
import { Eyebrow } from "./primitives";
import { useT } from "../i18n";

export function Templates({ onUse }) {
  const { t } = useT();
  return (
    <div className="space-y-4">
      <Eyebrow>{t.templates.title}</Eyebrow>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.values(TEMPLATES).map((tpl) => {
          const trackCount = Object.keys(tpl.tracks).length;
          const itemCount = Object.values(tpl.tracks).reduce((s, a) => s + a.length, 0);
          const tx = t.templateLabels[tpl.key];
          return (
            <div key={tpl.key} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-800">{tx.label}</div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                  {tx.department}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-400">{t.templates.counts(trackCount, itemCount)}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.keys(tpl.tracks).map((trackKey) => (
                  <span
                    key={trackKey}
                    className={`rounded px-1.5 py-0.5 text-[11px] ${trackKey === "Compliance & regulatory" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}
                  >
                    {t.tracks[trackKey] ?? trackKey}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onUse(tpl.key)}
                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                {t.templates.create} <ChevronRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
