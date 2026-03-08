export const languages = {
  en: "English",
  es: "Español",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "en";

export const routes: Record<Lang, { home: string; program: string; support: string }> = {
  en: { home: "/en", program: "/en/program", support: "/en/support" },
  es: { home: "/es", program: "/es/programa", support: "/es/apoyo" },
};

const routeEquivalents: Record<string, Record<Lang, string>> = {
  "/en": { en: "/en", es: "/es" },
  "/es": { en: "/en", es: "/es" },
  "/en/program": { en: "/en/program", es: "/es/programa" },
  "/es/programa": { en: "/en/program", es: "/es/programa" },
  "/en/support": { en: "/en/support", es: "/es/apoyo" },
  "/es/apoyo": { en: "/en/support", es: "/es/apoyo" },
};

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getLocalizedPath(path: string, targetLang: Lang): string {
  const clean = path.replace(/\/$/, "") || path;
  const mapping = routeEquivalents[clean];
  if (mapping) return mapping[targetLang];
  return `/${targetLang}${path === "/" ? "" : path}`;
}

export function getOtherLangUrl(pathname: string, currentLang: Lang): string {
  const otherLang: Lang = currentLang === "en" ? "es" : "en";
  const clean = pathname.replace(/\/$/, "");
  const mapping = routeEquivalents[clean];
  if (mapping) return mapping[otherLang];
  return pathname.replace(`/${currentLang}`, `/${otherLang}`);
}
