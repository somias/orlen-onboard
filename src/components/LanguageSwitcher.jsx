import { LANGS, useT } from "../i18n";
import { en } from "../i18n/en";
import { de } from "../i18n/de";
import { pl } from "../i18n/pl";
import gbFlag from "flag-icons/flags/4x3/gb.svg";
import deFlag from "flag-icons/flags/4x3/de.svg";
import plFlag from "flag-icons/flags/4x3/pl.svg";

const META = { en, de, pl };
const FLAG_SRC = { gb: gbFlag, de: deFlag, pl: plFlag };

export function LanguageSwitcher() {
  const { lang, setLang, t } = useT();

  return (
    <nav aria-label={t.app.langAria} className="flex items-center gap-0.5">
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-current={active ? "true" : undefined}
            lang={l}
            className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
              active
                ? "bg-slate-100 text-slate-800"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <img
              src={FLAG_SRC[META[l].meta.flag]}
              alt=""
              className={`h-3 w-[18px] rounded-[2px] object-cover ring-1 ring-inset ring-black/10 ${active ? "" : "opacity-60"}`}
            />
            {META[l].meta.langLabel}
          </button>
        );
      })}
    </nav>
  );
}
