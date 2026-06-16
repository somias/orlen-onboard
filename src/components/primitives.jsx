import { STATUS_STYLE } from "../data/constants";
import { useT } from "../i18n";

export function Eyebrow({ children }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
      {children}
    </div>
  );
}

export function StatusPill({ statusKey }) {
  const { t } = useT();
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[statusKey]}`}>
      {t.statuses[statusKey]}
    </span>
  );
}

export function ProgressBar({ pct }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Ring({ pct }) {
  return (
    <div
      className="relative flex h-20 w-20 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#10b981 ${pct * 3.6}deg, #e2e8f0 0deg)` }}
    >
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white">
        <span className="text-lg font-semibold tabular-nums text-slate-800">{pct}%</span>
      </div>
    </div>
  );
}

export function Stat({ label, value, danger }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="text-[13px] text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${danger ? "text-rose-600" : "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}
