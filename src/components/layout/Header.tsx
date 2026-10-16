"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getDictionary } from "@/content/dictionary";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { sectionIds } from "@/lib/sections";
import { LangSwitch } from "./LangSwitch";

export function Header({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const links = [
    { id: sectionIds.projects, label: dict.nav.projects },
    { id: sectionIds.architecture, label: dict.nav.architecture },
    { id: sectionIds.stack, label: dict.nav.stack },
    { id: sectionIds.about, label: dict.nav.about },
    { id: sectionIds.journey, label: dict.nav.timeline },
    { id: sectionIds.contact, label: dict.nav.contact },
  ];

  // The header adopts the theme of whichever section sits under it.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-theme], footer[data-theme]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTheme((entry.target as HTMLElement).dataset.theme === "light" ? "light" : "dark");
          }
        }
      },
      { rootMargin: "0px 0px -92% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <header
      data-theme={theme}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-md transition-colors duration-500"
    >
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <a href={`#${sectionIds.top}`} className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="mono grid size-9 place-items-center rounded-lg border border-line-strong text-xs font-medium"
          >
            {profile.initials}
          </span>
          <span className="sr-only text-sm font-medium sm:not-sr-only">{profile.name}</span>
          <span className="sr-only">, {dict.nav.backToTop}</span>
        </a>

        <nav aria-label={dict.nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="rounded-full px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch locale={locale} />
          <button
            ref={trigger}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
            aria-label={dict.nav.openMenu}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        data-theme="dark"
        aria-label={dict.nav.label}
        onClose={() => setOpen(false)}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-ice backdrop:bg-ink/60 lg:hidden"
      >
        <div className="container-x flex h-16 items-center justify-between">
          <span className="mono text-xs tracking-[0.14em] text-fg-muted uppercase">{dict.nav.label}</span>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line"
            aria-label={dict.nav.closeMenu}
            onClick={close}
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <nav aria-label={dict.nav.label} className="container-x pt-8">
          <ol className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.id} className="border-b border-line">
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-5 text-3xl font-light"
                >
                  <span className="mono text-xs text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </dialog>
    </header>
  );
}
