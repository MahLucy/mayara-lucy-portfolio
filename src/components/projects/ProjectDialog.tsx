"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { getDictionary } from "@/content/dictionary";
import { categories, type Project } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { categoryColor } from "@/lib/layers";
import { ProjectCover } from "./ProjectCover";
import { projects } from "@/content/projects";

type Props = {
  project: Project | null;
  locale: Locale;
  onClose: () => void;
};

/** Native <dialog> gives us the focus trap, Escape handling, and inert background. */
export function ProjectDialog({ project, locale, onClose }: Props) {
  const dict = getDictionary(locale);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!project && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [project]);

  const sections: { label: string; body: string }[] = project
    ? [
        { label: dict.projects.problem, body: project.problem[locale] },
        { label: dict.projects.role, body: project.role[locale] },
        { label: dict.projects.solution, body: project.solution[locale] },
        { label: dict.projects.result, body: project.result[locale] },
      ]
    : [];

  return (
    <dialog
      ref={ref}
      data-theme="light"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[min(92dvh,900px)] w-[min(100%-2rem,860px)] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/70 backdrop:backdrop-blur-sm open:animate-[dialog-in_400ms_var(--ease-out)]"
    >
      {project && (
        <div className="relative">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-paper/95 px-6 py-4 backdrop-blur sm:px-10">
            <p className="mono text-xs tracking-wide text-fg-muted uppercase">
              {dict.projects.org[project.org]} ·{" "}
              {project.categories.map((c) => categories.find((x) => x.id === c)?.label[locale]).join(" · ")}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-fg"
              aria-label={dict.projects.close}
              autoFocus
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div data-dialog-cover className="relative mx-6 mt-6 aspect-[16/8] overflow-hidden rounded-2xl sm:mx-10">
            <ProjectCover
              project={project}
              locale={locale}
              index={projects.indexOf(project)}
              large
              illustrativeLabel={dict.projects.illustrative}
              sizes="(min-width: 860px) 780px, 100vw"
            />
          </div>

          <div data-dialog-body className="px-6 pt-8 pb-10 sm:px-10">
            <span
              aria-hidden="true"
              className="block h-1 w-12 rounded-full"
              style={{ background: categoryColor[project.categories[0] ?? "web"] }}
            />
            <h2 id="project-dialog-title" className="mt-6 text-3xl leading-tight font-light sm:text-4xl">
              {project.title[locale]}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-fg-muted">{project.summary[locale]}</p>

            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              {sections.map((s) => (
                <div key={s.label} className="border-t border-line pt-4">
                  <dt className="mono text-xs tracking-[0.14em] text-fg-muted uppercase">{s.label}</dt>
                  <dd className="mt-3 leading-relaxed">{s.body}</dd>
                </div>
              ))}
            </dl>

            {project.flow && (
              <div className="mt-10 border-t border-line pt-4">
                <h3 className="mono text-xs tracking-[0.14em] text-fg-muted uppercase">{dict.projects.flow}</h3>
                <ol className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  {project.flow[locale].map((step, i, all) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="chip bg-surface">
                        <span className="text-fg-muted">{String(i + 1).padStart(2, "0")}</span> {step}
                      </span>
                      {i < all.length - 1 && (
                        <span aria-hidden="true" className="hidden text-fg-muted sm:inline">
                          →
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="mt-10 border-t border-line pt-4">
              <h3 className="mono text-xs tracking-[0.14em] text-fg-muted uppercase">{dict.projects.stack}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s} className="chip bg-surface">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {project.org !== "Freelance" && (
              <p className="mt-8 text-sm text-fg-muted">{dict.projects.confidential}</p>
            )}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-8"
              >
                {dict.projects.visit}
                <span className="sr-only"> {dict.external}</span>
                <ArrowUpRight aria-hidden className="btn-icon size-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
