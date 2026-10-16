import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import { getDictionary } from "@/content/dictionary";
import { credentials } from "@/content/experience";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { sectionIds } from "@/lib/sections";

export function About({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [lead, ...rest] = profile.bio[locale];

  return (
    <section id={sectionIds.about} data-theme="lime" data-wipe aria-labelledby="about-title" className="relative py-24 lg:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <figure className="mx-auto w-full max-w-sm self-start lg:col-span-4 lg:mx-0 lg:max-w-none">
          <div className="relative">
            <span aria-hidden="true" data-about-block className="absolute -right-3 -bottom-3 h-full w-full rounded-2xl bg-ink sm:-right-4 sm:-bottom-4" />
            <div data-about-photo className="relative overflow-hidden rounded-2xl bg-blue">
            <Image
              src={profile.photo.src}
              alt={profile.photo.alt[locale]}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="(min-width: 1024px) 30vw, 90vw"
              className="aspect-square w-full object-cover mix-blend-luminosity contrast-110"
            />
            </div>
          </div>
          <figcaption className="mono mt-8 flex items-center gap-2 text-xs tracking-wide text-fg-muted uppercase">
            <MapPin aria-hidden className="size-4" />
            <span className="sr-only">{dict.about.location}:</span>
            {profile.location[locale]}
          </figcaption>
        </figure>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="kicker">{dict.about.kicker}</p>
          <h2 id="about-title" data-reveal-title className="section-title mt-5">
            {dict.about.title}
          </h2>
          <p data-about-lead className="mt-8 text-xl leading-relaxed font-light sm:text-2xl">
            {lead}
          </p>
          {rest.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 text-fg-muted">
              {p}
            </p>
          ))}

          <h3 className="mono mt-14 text-xs tracking-[0.14em] text-fg-muted uppercase">{dict.about.credentials}</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {credentials.map((c) => (
              <li key={c.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-fg-muted">
                    {c.issuer}
                    {c.year ? ` · ${c.year}` : ""}
                  </p>
                  {c.note && <p className="mono mt-1 text-[0.7rem] tracking-wide text-fg-muted uppercase">{c.note[locale]}</p>}
                </div>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-medium text-accent hover:underline sm:self-auto"
                  >
                    {dict.about.viewCredential}
                    <span className="sr-only">
                      : {c.name} {dict.external}
                    </span>
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
