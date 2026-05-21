import React, { createContext, useContext, useState, useCallback } from "react";
import { Lang, t, Translations, languages } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: Translations;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANG_STORAGE_KEY = "flowentra_lang";

const getInitialLang = (): Lang => {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
    if (stored && ["en", "fr", "de", "ar"].includes(stored)) return stored;
  } catch {}
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (browser === "fr") return "fr";
  return "en";
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem(LANG_STORAGE_KEY, newLang); } catch {}
    const langConfig = languages.find((l) => l.code === newLang);
    document.documentElement.dir = langConfig?.dir || "ltr";
    document.documentElement.lang = newLang;
  }, []);

  const tr = t(lang);
  const dir = languages.find((l) => l.code === lang)?.dir || "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
