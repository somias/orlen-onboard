import { useState } from "react";
import { ClipboardCheck, FileText, LayoutGrid, Plus } from "lucide-react";
import { SEED, buildHire } from "./data/hires";
import { Dashboard } from "./components/Dashboard";
import { HireDetail } from "./components/HireDetail";
import { Templates } from "./components/Templates";
import { AddHireModal } from "./components/AddHireModal";

export default function App() {
  const [hires, setHires] = useState(SEED);
  const [view, setView] = useState({ name: "dashboard", hireId: null });
  const [modal, setModal] = useState({ open: false, preset: null });

  function toggleTask(hireId, taskId) {
    setHires((prev) =>
      prev.map((h) =>
        h.id !== hireId
          ? h
          : { ...h, tasks: h.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
      )
    );
  }

  function createHire({ name, role, templateKey, start }) {
    const hire = buildHire({ name, role, templateKey, start, owner: "M. Lang", pct: 0 });
    setHires((prev) => [...prev, hire]);
    setModal({ open: false, preset: null });
    setView({ name: "detail", hireId: hire.id });
  }

  const current = hires.find((h) => h.id === view.hireId);
  const navItem = (key, label, Icon) => (
    <button
      onClick={() => setView({ name: key, hireId: null })}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
        view.name === key
          ? "bg-slate-100 font-medium text-slate-800"
          : "text-slate-500 hover:text-slate-800"
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={20} className="text-emerald-500" />
              <span className="font-semibold text-slate-800">Onboard</span>
            </div>
            <nav className="flex items-center gap-1">
              {navItem("dashboard", "Dashboard", LayoutGrid)}
              {navItem("templates", "Templates", FileText)}
            </nav>
          </div>
          <button
            onClick={() => setModal({ open: true, preset: null })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus size={16} /> Add new hire
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-7">
        {view.name === "dashboard" && (
          <Dashboard
            hires={hires}
            onOpen={(id) => setView({ name: "detail", hireId: id })}
          />
        )}
        {view.name === "detail" && current && (
          <HireDetail
            hire={current}
            onBack={() => setView({ name: "dashboard", hireId: null })}
            onToggle={toggleTask}
          />
        )}
        {view.name === "templates" && (
          <Templates onUse={(key) => setModal({ open: true, preset: key })} />
        )}
      </main>

      {modal.open && (
        <AddHireModal
          presetTemplate={modal.preset}
          onClose={() => setModal({ open: false, preset: null })}
          onCreate={createHire}
        />
      )}
    </div>
  );
}
