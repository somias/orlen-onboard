import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { derive, fmt, initials } from "../data/hires";
import { useT } from "../i18n";
import { ProgressBar, StatusPill } from "./primitives";

const STATUS_KEYS = ["All", "Overdue", "In progress", "Starting soon", "Upcoming", "Complete"];

function matches(hire, q, t) {
  if (!q) return true;
  const ql = q.toLowerCase();
  const tplLabel = t.templateLabels[hire.templateKey]?.label ?? "";
  const tplDept = t.templateLabels[hire.templateKey]?.department ?? "";
  return [hire.name, hire.role, tplDept, hire.owner, tplLabel]
    .join(" ")
    .toLowerCase()
    .includes(ql);
}

function Highlight({ text, query }) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-amber-100 px-0.5 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export function HireTable({ hires, onOpen }) {
  const { t, lang } = useT();
  const locale = t.meta.locale;
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const inputRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      const active = document.activeElement;
      const typingElsewhere = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
      if (e.key === "/" && !typingElsewhere) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const bySearch = useMemo(() => hires.filter((h) => matches(h, q, t)), [hires, q, t]);
  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUS_KEYS.map((s) => [s, 0]));
    c.All = bySearch.length;
    for (const h of bySearch) c[derive(h).status]++;
    return c;
  }, [bySearch]);
  const visible = useMemo(
    () => (statusFilter === "All" ? bySearch : bySearch.filter((h) => derive(h).status === statusFilter)),
    [bySearch, statusFilter],
  );

  const filtered = q !== "" || statusFilter !== "All";
  const clearAll = () => {
    setQ("");
    setStatusFilter("All");
  };

  const statusLabel = (key) => t.statuses[key];
  let emptyTitle = t.hireTable.empty.noStatus(statusLabel(statusFilter));
  if (q && statusFilter === "All") emptyTitle = t.hireTable.empty.noQuery(q);
  else if (q) emptyTitle = t.hireTable.empty.noBoth(q, statusLabel(statusFilter));

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="text-sm font-medium text-slate-700">
          {t.hireTable.title}
          {filtered && (
            <span
              className="ml-2 text-xs font-normal text-slate-400"
              role="status"
              aria-live="polite"
            >
              · {t.hireTable.countOf(visible.length, hires.length)}
            </span>
          )}
        </div>
        <div className="relative flex items-center">
          <Search size={15} className="pointer-events-none absolute left-2.5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                if (q) {
                  setQ("");
                } else {
                  e.currentTarget.blur();
                }
              }
            }}
            placeholder={t.hireTable.searchPlaceholder}
            aria-label={t.hireTable.searchAria}
            className="w-44 rounded-lg border border-slate-200 py-1.5 pl-8 pr-8 text-xs outline-none placeholder:text-slate-400 focus:border-slate-400 sm:w-56"
          />
          {q ? (
            <button
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              className="absolute right-1.5 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label={t.hireTable.clearSearchAria}
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="absolute right-2 hidden h-4 items-center rounded border border-slate-200 px-1 text-[10px] font-medium text-slate-400 sm:inline-flex">
              /
            </kbd>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 px-4 py-2.5">
        {STATUS_KEYS.map((s) => {
          const active = statusFilter === s;
          const dimmed = !active && counts[s] === 0;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              disabled={dimmed}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs transition-colors ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : dimmed
                    ? "cursor-not-allowed border-slate-100 text-slate-300"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{statusLabel(s)}</span>
              <span className={`tabular-nums ${active ? "text-slate-300" : "text-slate-400"}`}>{counts[s]}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Search size={18} className="text-slate-400" />
          </div>
          <div className="mt-3 text-sm font-medium text-slate-700">{emptyTitle}</div>
          <div className="mt-1 text-xs text-slate-400">{t.hireTable.empty.hint}</div>
          <button
            onClick={clearAll}
            className="mt-4 rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            {t.hireTable.clearFilters}
          </button>
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-400">
              <th className="px-4 py-2 font-medium">{t.hireTable.cols.name}</th>
              <th className="hidden px-4 py-2 font-medium sm:table-cell">{t.hireTable.cols.department}</th>
              <th className="hidden px-4 py-2 font-medium sm:table-cell">{t.hireTable.cols.start}</th>
              <th className="px-4 py-2 font-medium">{t.hireTable.cols.progress}</th>
              <th className="px-4 py-2 font-medium">{t.hireTable.cols.status}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((h) => {
              const d = derive(h);
              const dept = t.templateLabels[h.templateKey]?.department ?? "";
              return (
                <tr
                  key={h.id}
                  onClick={() => onOpen(h.id)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-medium text-sky-700">
                        {initials(h.name)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">
                          <Highlight text={h.name} query={q} />
                        </div>
                        <div className="text-xs text-slate-400">
                          <Highlight text={h.role} query={q} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">
                    <Highlight text={dept} query={q} />
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">{fmt(h.start, locale)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24"><ProgressBar pct={d.pct} /></div>
                      <span className="w-9 text-xs tabular-nums text-slate-500">{d.pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill statusKey={d.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
