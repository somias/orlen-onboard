import { useState } from "react";
import { X } from "lucide-react";
import { TEMPLATES } from "../data/templates";

export function AddHireModal({ presetTemplate, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [templateKey, setTemplateKey] = useState(presetTemplate || "trading");
  const [start, setStart] = useState("2026-07-07");
  const [touched, setTouched] = useState(false);

  const valid = name.trim().length > 1;

  function submit() {
    setTouched(true);
    if (!valid) return;
    onCreate({
      name: name.trim(),
      role: role.trim() || "New hire",
      templateKey,
      start: new Date(start + "T00:00:00"),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Add new hire</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marko Petrović"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            {touched && !valid && (
              <div className="mt-1 text-xs text-rose-500">Enter a name to create the hire.</div>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Junior power trader"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Template</label>
              <select
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              >
                {Object.values(TEMPLATES).map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Start date</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Department set to {TEMPLATES[templateKey].department}. The checklist is generated
            from the {TEMPLATES[templateKey].label} template.
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Create hire
          </button>
        </div>
      </div>
    </div>
  );
}
