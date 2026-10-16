"use client";

import { getDictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Switches language while keeping the current section (hash) and query
 * parameters such as an open project (?p=slug).
 */
export function LangSwitch({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const target: Locale = locale === "pt" ? "en" : "pt";
  const base = localePath(target);

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const { search } = window.location;
    const inView = (s: Element) => {
      const r = s.getBoundingClientRect();
      return r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.2;
    };
    // Keep the URL hash if that section is still on screen; otherwise use the section in view.
    const hashed = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
    const current =
      hashed && inView(hashed)
        ? hashed
        : Array.from(document.querySelectorAll<HTMLElement>("main section[id]")).find((s) => {
            const r = s.getBoundingClientRect();
            return r.top <= window.innerHeight * 0.4 && r.bottom > window.innerHeight * 0.4;
          });
    const hash = current ? `#${current.id}` : "";
    // PT and EN have separate root layouts, so this is always a full page load;
    // a direct navigation is the reliable way to do it (router.push is flaky here).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${base}${search}${hash}`);
  };

  return (
    <a
      href={base}
      hrefLang={target === "pt" ? "pt-BR" : "en"}
      lang={target === "pt" ? "pt-BR" : "en"}
      onClick={go}
      className="mono grid h-11 min-w-11 place-items-center rounded-full border border-line px-3 text-xs font-medium transition-colors hover:border-fg"
    >
      <span aria-hidden="true">{dict.lang.short}</span>
      <span className="sr-only">
        {dict.lang.short} · {dict.lang.switchTo}
      </span>
    </a>
  );
}
