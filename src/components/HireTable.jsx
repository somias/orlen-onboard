import { Search } from "lucide-react";
import { derive, fmt, initials } from "../data/hires";
import { ProgressBar, StatusPill } from "./primitives";

export function HireTable({ hires, onOpen }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="text-sm font-medium text-slate-700">New hires</div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-400">
          <Search size={15} />
          <span className="text-xs">Search</span>
        </div>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-slate-400">
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="hidden px-4 py-2 font-medium sm:table-cell">Department</th>
            <th className="hidden px-4 py-2 font-medium sm:table-cell">Start</th>
            <th className="px-4 py-2 font-medium">Progress</th>
            <th className="px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {hires.map((h) => {
            const d = derive(h);
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
                      <div className="font-medium text-slate-800">{h.name}</div>
                      <div className="text-xs text-slate-400">{h.role}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">{h.department}</td>
                <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">{fmt(h.start)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24"><ProgressBar pct={d.pct} /></div>
                    <span className="w-9 text-xs tabular-nums text-slate-500">{d.pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusPill status={d.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
