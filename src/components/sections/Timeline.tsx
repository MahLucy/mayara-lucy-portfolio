import { Briefcase, GraduationCap } from "lucide-react";
import { getDictionary } from "@/content/dictionary";
import { timeline, type TimelineEntry } from "@/content/experience";
import type { Locale } from "@/lib/i18n";
import { sectionIds } from "@/lib/sections";
import { TimelineProgress } from "./TimelineProgress";

function formatDate(value: string, months: string[]): string {
  const [year, month] = value.split("-");
  return month ? `${months[Number(month) - 1]} ${year}` : (year ?? value);
}

function period(entry: TimelineEntry, months: string[], present: string) {
  return `${formatDate(entry.start, months)} – ${entry.end ? formatDate(entry.end, months) : present}`;
}

export function Timeline({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section id={sectionIds.journey} data-theme="light" data-wipe aria-labelledby="journey-title" className="relative py-24 lg:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="kicker">{dict.timeline.kicker}</p>
            <h2 id="journey-title" data-reveal-title className="section-title mt-5">
              {dict.timeline.title}
            </h2>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6">
          <TimelineProgress />
          <ol className="relative flex flex-col gap-10 pl-10">
            {timeline.map((entry) => {
              const Icon = entry.kind === "work" ? Briefcase : GraduationCap;
              const current = entry.end === null;
              return (
                <li key={entry.id} data-journey-item className="reveal-view relative">
                  <span
                    aria-hidden="true"
                    data-journey-dot
                    className={`absolute top-1 -left-10 grid size-[22px] -translate-x-[calc(50%-0.5px)] place-items-center rounded-full border transition-colors duration-500 ${
                      current ? "border-ink bg-lime" : "border-line-strong bg-ice"
                    }`}
                  >
                    <Icon className="size-3" />
                  </span>
                  <p className="mono text-xs tracking-wide text-fg-muted uppercase">
                    <time dateTime={entry.start}>{period(entry, dict.months, dict.timeline.present)}</time>
                    <span className="sr-only">
                      {" "}
                      · {entry.kind === "work" ? dict.timeline.work : dict.timeline.education}
                    </span>
                  </p>
                  <h3 className="mt-2 text-xl font-medium sm:text-2xl">{entry.title[locale]}</h3>
                  <p className="mt-1 font-medium text-blue-ink">{entry.org}</p>
                  <p className="mt-3 max-w-xl text-fg-muted">{entry.description[locale]}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
