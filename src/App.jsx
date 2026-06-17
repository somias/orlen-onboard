import { useEffect, useState } from "react";
import { ClipboardCheck, FileText, LayoutGrid, Menu, Plus, X } from "lucide-react";
import { SEED, buildHire } from "./data/hires";
import { Dashboard } from "./components/Dashboard";
import { HireDetail } from "./components/HireDetail";
import { Templates } from "./components/Templates";
import { AddHireModal } from "./components/AddHireModal";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { I18nProvider, useT } from "./i18n";

function Shell() {
  const { t } = useT();
  const [hires, setHires] = useState(SEED);
  const [view, setView] = useState({ name: "dashboard", hireId: null });
  const [modal, setModal] = useState({ open: false, preset: null });
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleTask(hireId, taskId) {
    setHires((prev) =>
      prev.map((h) =>
        h.id !== hireId
          ? h
          : { ...h, tasks: h.tasks.map((tk) => (tk.id === taskId ? { ...tk, done: !tk.done } : tk)) }
      )
    );
  }

  function createHire({ name, role, templateKey, start }) {
    const hire = buildHire({ name, role, templateKey, start, owner: "M. Lang", pct: 0 });
    setHires((prev) => [...prev, hire]);
    setModal({ open: false, preset: null });
    setView({ name: "detail", hireId: hire.id });
  }

  function goTo(name) {
    setView({ name, hireId: null });
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const current = hires.find((h) => h.id === view.hireId);

  const navItem = (key, label, Icon) => (
    <button
      onClick={() => goTo(key)}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
        view.name === key
          ? "bg-slate-100 font-medium text-slate-800"
          : "text-slate-500 hover:text-slate-800"
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  const mobileNavItem = (key, label, Icon) => {
    const active = view.name === key;
    return (
      <button
        onClick={() => goTo(key)}
        aria-current={active ? "page" : undefined}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
          active
            ? "bg-emerald-50 font-medium text-emerald-700"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Icon size={18} className={active ? "text-emerald-600" : "text-slate-400"} />
        {label}
      </button>
    );
  };

  return (
    <div
      className="min-h-dvh bg-slate-50 text-slate-900"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <div className="flex shrink-0 items-center gap-2">
              <ClipboardCheck size={20} className="text-emerald-500" />
              <span className="truncate font-semibold text-slate-800">{t.app.brand}</span>
            </div>
            <nav className="hidden items-center gap-1 sm:flex">
              {navItem("dashboard", t.app.nav.dashboard, LayoutGrid)}
              {navItem("templates", t.app.nav.templates, FileText)}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setModal({ open: true, preset: null })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              aria-label={t.app.addHire}
            >
              <Plus size={16} /> <span className="hidden sm:inline">{t.app.addHire}</span>
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 sm:hidden"
              aria-label={t.app.menuAria}
              aria-controls="mobileMenu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="mobileMenu"
            className="relative z-40 border-t border-slate-200 bg-white px-3 pb-4 pt-3 shadow-lg sm:hidden"
          >
            <div className="space-y-1">
              {mobileNavItem("dashboard", t.app.nav.dashboard, LayoutGrid)}
              {mobileNavItem("templates", t.app.nav.templates, FileText)}
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {t.app.langAria}
              </div>
              <div className="px-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>

      {menuOpen && (
        <button
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/20 sm:hidden"
        />
      )}

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-5 sm:py-7">
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

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}
