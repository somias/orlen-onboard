import { LANGS, useT } from "../i18n";
import { en } from "../i18n/en";
import { de } from "../i18n/de";
import { pl } from "../i18n/pl";

const META = { en, de, pl };

export function LanguageSwitcher() {
  const { lang, setLang, t } = useT();

  return (
    <nav
      aria-label={t.app.langAria}
      className="hidden items-center gap-1 font-mono text-[11px] tracking-widest text-slate-400 sm:flex"
      style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
    >
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="text-slate-300">·</span>}
          {l === lang ? (
            <span className="font-semibold text-slate-700" aria-current="true">
              {META[l].meta.langLabel}
            </span>
          ) : (
            <button
              onClick={() => setLang(l)}
              className="text-slate-400 hover:text-slate-700"
              lang={l}
            >
              {META[l].meta.langLabel}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}
