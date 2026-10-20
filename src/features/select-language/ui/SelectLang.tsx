import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useLocalization, Language } from "@shared/lib/useLocalization";

export const SelectLang = () => {
  const { lng, changeLanguage, t } = useLocalization();
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const LANGS: { code: Language; label: string; flag: string }[] = [
    { code: "tj", label: t("languages.tj"), flag: "/tajikistan.png" },
    { code: "ru", label: t("languages.ru"), flag: "/russia.png" },
  ];

  const current = LANGS.find((l) => l.code === lng)!;

  return (
    <div ref={wrapperRef} className="relative w-[140px]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[38px] flex items-center justify-between px-3 rounded-xl bg-brand-50 font-semibold text-brand-600 hover:bg-brand-100 transition-colors dark:bg-brand-500/15 dark:text-brand-300 dark:hover:bg-brand-500/25"
      >
        <span className="flex items-center gap-2">
          <img src={current?.flag} alt={current?.label} className="w-5 h-5" />
          <span className="text-sm font-medium">{current?.label}</span>
        </span>

        <ChevronDown
          size={18}
          className={`
                transition-transform duration-200
                ${open ? "rotate-180" : "rotate-0"}
              `}
        />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl dark:border-gray-600 dark:bg-mainBgColor">
          {LANGS.map((lang) => (
            <button
              key={lang?.code}
              onClick={() => {
                changeLanguage(lang?.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors
                    ${
                      lng === lang?.code
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
                    }
                  `}
            >
              <span className="flex items-center gap-2">
                <img src={lang?.flag} alt={lang?.label} className="w-5 h-5" />
                <span>{lang?.label}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
