"use client";

import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { getDictionary } from "@/content/dictionary";
import { contactLinks, profile, type ContactLink } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { sectionIds } from "@/lib/sections";

const linkIcons: Record<ContactLink["id"], React.ComponentType<{ className?: string }>> = {
  email: Mail,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  cv: FileText,
};

export function Contact({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section
      id={sectionIds.contact}
      data-theme="dark"
      data-wipe
      aria-labelledby="contact-title"
      className="grain relative overflow-hidden py-24 lg:py-36"
    >
      <span
        aria-hidden="true"
        data-depth="0.6"
        className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full border border-coral/40"
      />
      <span
        aria-hidden="true"
        data-depth="1.4"
        className="pointer-events-none absolute -top-24 -right-24 size-[360px] rounded-full border border-dashed border-coral/60"
      />

      <div className="container-x relative">
        <p className="kicker">{dict.contact.kicker}</p>
        <h2 id="contact-title" data-reveal-title className="mt-5 max-w-4xl text-[clamp(2.4rem,1.2rem+5vw,5.5rem)] leading-[0.98] font-light">
          {dict.contact.title}
        </h2>
        <p className="mt-8 max-w-2xl text-lg text-fg-muted">{dict.contact.intro}</p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={`mailto:${profile.email}`} className="btn btn-primary">
            <Mail aria-hidden className="size-4" />
            {dict.contact.email}
          </a>
          <button type="button" onClick={copy} className="btn btn-ghost">
            {status === "copied" ? <Check aria-hidden className="size-4 text-lime" /> : <Copy aria-hidden className="size-4" />}
            {status === "copied" ? dict.contact.copied : dict.contact.copy}
          </button>
          <p className="mono text-sm break-all text-fg-muted">{profile.email}</p>
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-6 text-sm text-fg-muted">
          {status === "copied" && dict.contact.copied}
          {status === "failed" && `${dict.contact.copyFailed} ${profile.email}`}
        </p>

        <ul aria-label={dict.contact.linksLabel} className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {contactLinks.map((link) => {
            const Icon = linkIcons[link.id];
            return (
              <li key={link.id} className="border-b border-line sm:odd:border-r lg:border-r lg:last:border-r-0">
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(link.id === "cv" ? { download: "Mayara-Lucy-CV.pdf" } : {})}
                  className="group flex min-h-24 items-center justify-between gap-4 px-1 py-6 transition-colors hover:text-lime sm:px-6"
                >
                  <span className="flex items-center gap-4">
                    <Icon className="size-5" />
                    <span>
                      <span className="block font-medium">{link.label[locale]}</span>
                      <span className="mono block text-xs text-fg-muted">{link.display}</span>
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  {link.external && <span className="sr-only">{dict.external}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
