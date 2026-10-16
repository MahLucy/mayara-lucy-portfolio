"use client";

import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { ChapterVisual, buildChapterTimeline } from "@/components/stack/ChapterVisual";
import { getDictionary } from "@/content/dictionary";
import { levelHelp, levelLabels, skillGroups, stackChapters, type SkillLevel, type StackChapter } from "@/content/skills";
import { gsap, motionQueries, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { eachIdle, onIdle } from "@/lib/idle";
import type { Locale } from "@/lib/i18n";
import { layerColors } from "@/lib/layers";
import { sectionIds } from "@/lib/sections";

const chapterColor: Record<StackChapter["id"], string> = {
  fullstack: layerColors.api,
  ai: layerColors.ai,
  cloud: layerColors.cloud,
  data: layerColors.data,
  devsecops: layerColors.security,
};

const levels: SkillLevel[] = ["pro", "used", "study"];

function LevelMark({ level }: { level: SkillLevel }) {
  const base = "inline-block size-2 shrink-0 rounded-full border border-current";
  if (level === "pro") return <span aria-hidden="true" className={`${base} bg-current`} />;
  if (level === "used") return <span aria-hidden="true" className={`${base} bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)]`} />;
  return <span aria-hidden="true" className={base} />;
}

function ChapterCard({ chapter, index, locale }: { chapter: StackChapter; index: number; locale: Locale }) {
  const groups = chapter.groups.map((id) => skillGroups.find((g) => g.id === id)).filter((g) => g !== undefined);
  const titleId = `stack-${chapter.id}-title`;
  const color = chapterColor[chapter.id];

  return (
    <li data-stack-card={chapter.id} className="stack-card relative shrink-0">
      <article
        aria-labelledby={titleId}
        data-theme="light"
        className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-paper text-ink shadow-[0_30px_80px_-30px_rgba(11,16,32,0.55)]"
      >
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-ink lg:aspect-[16/8]">
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{ background: `radial-gradient(120% 90% at 85% 10%, ${color}33, transparent 60%)` }}
          />
          <div data-stack-visual className="absolute inset-0 p-4">
            <ChapterVisual id={chapter.id} />
          </div>
          <span className="mono absolute top-4 left-5 text-xs tracking-[0.14em] text-[#a9b3cc] uppercase">
            {String(index + 1).padStart(2, "0")} / {String(stackChapters.length).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="absolute top-5 right-5 h-1 w-10 rounded-full" style={{ background: color }} />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6 lg:p-7">
          <h3 id={titleId} data-stack-title className="text-2xl leading-tight font-light lg:text-[1.7rem]">
            {chapter.title[locale]}
          </h3>
          {groups.map((group) => (
            <div key={group.id} data-stack-group className="border-t border-line pt-3">
              {groups.length > 1 && (
                <h4 className="mono mb-1 text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">{group.title[locale]}</h4>
              )}
              <p className="text-sm text-fg-muted">{group.blurb[locale]}</p>
              <dl className="mt-3 flex flex-col gap-2">
                {levels.map((level) => {
                  const items = group.skills.filter((s) => s.level === level);
                  if (items.length === 0) return null;
                  return (
                    <div key={level} className="flex items-start gap-3">
                      <dt className="mt-1 flex shrink-0 items-center" title={levelLabels[level][locale]}>
                        <LevelMark level={level} />
                        <span className="sr-only">{levelLabels[level][locale]}</span>
                      </dt>
                      <dd>
                        <ul className="flex flex-wrap gap-1.5">
                          {items.map((s) => (
                            <li key={s.name} className={`chip px-2 py-1 text-[0.7rem] ${level === "pro" ? "" : "text-fg-muted"}`}>
                              {s.name}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>
      </article>
    </li>
  );
}

export function Stack({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
      const visualTl = (card: HTMLElement) =>
        buildChapterTimeline(card.querySelector("[data-stack-visual]") ?? card, card.dataset.stackCard as StackChapter["id"]);

      const mm = gsap.matchMedia();
      const cancel = onIdle(() => setup());
      return () => {
        cancel();
        mm.revert();
      };

      function setup() {
      // Desktop: pinned stage, the track slides right → left, each card gets its moment.
      mm.add(motionQueries.stackPinnable, () => {
        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
        const runway = () => spacer.current?.offsetHeight ?? window.innerHeight;

        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none", // must stay linear for containerAnimation
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: () => `+=${runway()}`,
            pin: true,
            pinSpacing: false, // runway reserved in CSS ([data-stack-spacer])
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(cards.length, Math.max(1, Math.round(self.progress * (cards.length - 1)) + 1));
              if (counter.current) counter.current.textContent = String(n).padStart(2, "0");
            },
          },
        });

        gsap.fromTo("[data-stack-meter]", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: stage.current, start: "top top", end: () => `+=${runway()}`, scrub: 0.7 },
        });

        cards.forEach((card) => {
          const tl = visualTl(card);
          // Focus: the card swells as it reaches the middle of the viewport, then recedes.
          gsap.fromTo(
            card,
            { scale: 0.86, yPercent: 6, rotateY: -10, transformPerspective: 1400 },
            {
              keyframes: [
                { scale: 1, yPercent: 0, rotateY: 0, ease: "power2.out" },
                { scale: 0.92, yPercent: 2, rotateY: 6, ease: "power1.in" },
              ],
              ease: "none",
              scrollTrigger: { containerAnimation: slide, trigger: card, start: "left right", end: "right left", scrub: true },
            },
          );
          ScrollTrigger.create({
            containerAnimation: slide,
            trigger: card,
            start: "left 90%",
            end: "center 55%",
            scrub: true,
            onUpdate: (self) => tl.progress(self.progress),
          });
        });
      });

      // Mobile, short screens: a vertical sequence; each diagram builds as its card scrolls in.
      mm.add(`${motionQueries.motion} and (not ((min-width: 1024px) and (min-height: 700px)))`, (ctx) => {
        const stop = eachIdle(cards, ctx.add("setupCard", (card: HTMLElement) => {
          const tl = visualTl(card);
          ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            end: "center 55%",
            scrub: true,
            onUpdate: (self) => tl.progress(self.progress),
          });
          gsap.fromTo(card, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, scrollTrigger: { trigger: card, start: "top 92%", once: true } });
        }) as (card: HTMLElement) => void);
        return () => stop();
      });

      // Reduced motion: diagrams shown complete.
      mm.add(motionQueries.reduced, () => {
        cards.forEach((card) => visualTl(card).progress(1));
      });

      // Intro words light up as the section enters.
      mm.add(motionQueries.motion, () => {
        // Words go from the muted tone (already AA) to full contrast, so text stays legible throughout.
        const split = SplitText.create("[data-stack-lead]", { type: "words", aria: "none" });
        gsap.fromTo(split.words, { color: "var(--fg-muted)" }, {
          color: "var(--fg)",
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: "[data-stack-lead]", start: "top 85%", end: "top 45%", scrub: true },
        });
        return () => split.revert();
      });
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id={sectionIds.stack} data-theme="blue" data-wipe aria-labelledby="stack-title" className="relative">
      <div ref={stage} className="stack-stage relative overflow-hidden py-24 lg:flex lg:flex-col lg:justify-center">
        <ul ref={track} className="stack-track flex flex-col gap-8 px-[var(--gutter)] lg:flex-row lg:items-stretch lg:gap-[var(--stack-gap)]">
          <li className="stack-intro flex shrink-0 flex-col justify-center gap-6">
            <p className="kicker">{dict.stack.kicker}</p>
            <h2 id="stack-title" data-reveal-title className="section-title">
              {dict.stack.title}
            </h2>
            <p data-stack-lead className="max-w-md text-lg">
              {dict.stack.intro}
            </p>
            <div className="max-w-md rounded-2xl border border-line p-4 text-sm text-fg-muted">
              <p className="sr-only">{dict.stack.legend}</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-fg">
                {levels.map((l) => (
                  <li key={l} className="flex items-center gap-2">
                    <LevelMark level={l} />
                    {levelLabels[l][locale]}
                  </li>
                ))}
              </ul>
              <p className="mt-2">{levelHelp[locale]}</p>
            </div>
            <p className="mono hidden items-center gap-3 text-xs tracking-[0.14em] uppercase lg:flex" aria-hidden="true">
              {dict.stack.hint}
              <ArrowRight className="size-4" />
            </p>
          </li>
          {stackChapters.map((chapter, i) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={i} locale={locale} />
          ))}
        </ul>

        <div aria-hidden="true" className="container-x mt-8 hidden items-center gap-4 lg:flex">
          <span className="mono text-xs tracking-[0.14em]">
            <span ref={counter}>01</span> / {String(stackChapters.length).padStart(2, "0")}
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span data-stack-meter className="absolute inset-0 origin-left bg-lime" />
          </span>
        </div>
      </div>
      <div ref={spacer} data-stack-spacer aria-hidden="true" />
    </section>
  );
}
