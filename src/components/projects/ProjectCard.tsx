"use client";

import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/content/dictionary";
import { categories, type Project } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { categoryColor } from "@/lib/layers";
import { ProjectCover } from "./ProjectCover";

export type CardSize = "feature" | "l" | "s" | "m";

type Props = {
  project: Project;
  locale: Locale;
  index: number;
  size: CardSize;
  /** Featured tiles alternate the side of their cover. */
  flip?: boolean;
  onOpen: (slug: string, trigger: HTMLButtonElement) => void;
};

const span: Record<CardSize, string> = {
  feature: "md:col-span-2 lg:col-span-12",
  l: "lg:col-span-7",
  s: "lg:col-span-5",
  m: "lg:col-span-4",
};

const coverHeight: Record<CardSize, string> = {
  feature: "aspect-[16/10] lg:aspect-auto lg:h-[clamp(340px,38vw,560px)]",
  l: "aspect-[16/10] lg:aspect-auto lg:h-[clamp(260px,27vw,420px)]",
  s: "aspect-[16/10] lg:aspect-auto lg:h-[clamp(260px,27vw,420px)]",
  m: "aspect-[16/10] lg:aspect-[4/3]",
};

export function ProjectCard({ project, locale, index, size, flip, onOpen }: Props) {
  const dict = getDictionary(locale);
  const titleId = `project-${project.slug}-title`;
  const primary = project.categories[0] ?? "web";
  const feature = size === "feature";
  const labels = project.categories.map((c) => categories.find((cat) => cat.id === c)?.label[locale]).filter(Boolean);

  return (
    <li data-flip-id={project.slug} data-project-card data-size={size} className={`group/card relative ${span[size]}`}>
      <article
        aria-labelledby={titleId}
        className={`project-card relative grid h-full gap-6 ${feature ? "lg:grid-cols-12 lg:items-end lg:gap-10" : ""}`}
      >
        <div
          data-cover-frame
          className={`relative overflow-hidden rounded-[1.4rem] ${coverHeight[size]} ${
            feature ? `lg:col-span-7 ${flip ? "lg:order-2" : ""}` : ""
          }`}
        >
          <div data-tilt className="absolute inset-0">
            <ProjectCover
              project={project}
              locale={locale}
              index={index}
              large={feature}
              illustrativeLabel={dict.projects.illustrative}
              sizes={feature ? "(min-width: 1024px) 58vw, 100vw" : size === "m" ? "(min-width: 1024px) 32vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
            />
          </div>
        </div>

        <div className={`flex flex-col gap-3 ${feature ? `lg:col-span-5 lg:pb-4 ${flip ? "lg:order-1" : ""}` : ""}`}>
          <div data-card-line className="flex items-baseline gap-4">
            {feature && (
              <span aria-hidden="true" data-card-index className="mono text-[clamp(2.5rem,4vw,4rem)] leading-none font-light text-fg-muted transition-colors duration-500">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <p className="mono flex flex-wrap items-center gap-x-2 text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">
              <span className="text-fg">{dict.projects.org[project.org]}</span>
              <span aria-hidden="true">/</span>
              {labels.join(" · ")}
            </p>
          </div>
          <h3 id={titleId} data-card-line className={`leading-[1.08] font-light ${feature ? "text-[clamp(1.8rem,1.2rem+1.8vw,2.8rem)]" : "text-2xl"}`}>
            {project.title[locale]}
          </h3>
          <p data-card-line className={`text-fg-muted ${feature ? "text-lg" : ""}`}>
            {project.summary[locale]}
          </p>
          {feature && (
            <p data-card-line className="border-l-2 pl-3 text-sm" style={{ borderColor: categoryColor[primary] }}>
              <span className="mono mr-2 text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">{dict.projects.role}</span>
              {project.role[locale]}
            </p>
          )}
          {project.metric && (
            <p data-card-line className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-light tracking-tight">{project.metric.value}</span>
              <span className="mono text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">{project.metric.label[locale]}</span>
            </p>
          )}
          <ul data-card-line className="flex flex-wrap gap-1.5 pt-1" aria-label={dict.projects.stack}>
            {project.stack.slice(0, feature ? 6 : 4).map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
          <button
            type="button"
            data-card-line
            onClick={(e) => onOpen(project.slug, e.currentTarget)}
            className="mt-1 inline-flex items-center gap-2 self-start text-sm font-medium text-accent after:absolute after:inset-0 after:content-['']"
          >
            <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover/card:after:scale-x-100">
              {dict.projects.open}
            </span>
            <span className="sr-only">: {project.title[locale]}</span>
            <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </button>
        </div>
      </article>
    </li>
  );
}
