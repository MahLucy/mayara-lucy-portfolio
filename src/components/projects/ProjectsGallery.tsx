"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { getDictionary } from "@/content/dictionary";
import { contactLinks } from "@/content/profile";
import { categories, projects, type CategoryId, type Project } from "@/content/projects";
import type { Flip } from "gsap/Flip";
import { gsap, loadFlip, motionQueries, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { eachIdle, onIdle } from "@/lib/idle";
import type { Locale } from "@/lib/i18n";
import { categoryColor } from "@/lib/layers";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectCard, type CardSize } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";

type Filter = CategoryId | "all";
const PARAM = "p";

const noopSubscribe = () => () => {};

/**
 * Editorial grid: featured projects take a full row (cover side alternates);
 * runs of regular projects are laid out as asymmetric pairs (7/5, 5/7) and,
 * when a run is odd, one row of three.
 */
function layout(list: Project[]): { size: CardSize; flip: boolean }[] {
  const out: { size: CardSize; flip: boolean }[] = [];
  let features = 0;
  let pairRow = 0;
  let i = 0;
  while (i < list.length) {
    if (list[i]?.featured) {
      out.push({ size: "feature", flip: features++ % 2 === 1 });
      i++;
      continue;
    }
    let n = 0;
    while (i + n < list.length && !list[i + n]?.featured) n++;
    if (n === 1) {
      out.push({ size: "feature", flip: features++ % 2 === 1 });
    } else {
      const triple = n % 2 === 1;
      const pairs = triple ? (n - 3) / 2 : n / 2;
      for (let k = 0; k < pairs; k++) {
        const wideFirst = pairRow++ % 2 === 0;
        out.push({ size: wideFirst ? "l" : "s", flip: false }, { size: wideFirst ? "s" : "l", flip: false });
      }
      if (triple) out.push({ size: "m", flip: false }, { size: "m", flip: false }, { size: "m", flip: false });
    }
    i += n;
  }
  return out;
}

function readSlug(): string | null {
  const slug = new URLSearchParams(window.location.search).get(PARAM);
  return slug && projects.some((p) => p.slug === slug) ? slug : null;
}

export function ProjectsGallery({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const flip = useRef<typeof Flip | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  // Deep link: ?p=slug opens the matching project (also preserved by the language switch).
  const urlSlug = useSyncExternalStore(noopSubscribe, readSlug, () => null);
  const [chosenSlug, setOpenSlug] = useState<string | null | undefined>(undefined);
  const openSlug = chosenSlug === undefined ? urlSlug : chosenSlug;

  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  const sizes = layout(visible);
  const openProject = projects.find((p) => p.slug === openSlug) ?? null;
  const github = contactLinks.find((l) => l.id === "github");

  const syncUrl = (slug: string | null) => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set(PARAM, slug);
    else url.searchParams.delete(PARAM);
    window.history.replaceState(null, "", url);
  };

  const open = useCallback((slug: string, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setOpenSlug(slug);
    syncUrl(slug);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
    syncUrl(null);
    lastTrigger.current?.focus();
  }, []);

  const changeFilter = async (next: Filter) => {
    if (next === filter) return;
    const cards = list.current?.querySelectorAll("[data-project-card]");
    if (cards && !window.matchMedia(motionQueries.reduced).matches) {
      try {
        flip.current ??= await loadFlip();
        flipState.current = flip.current.getState(cards);
      } catch {
        flipState.current = null;
      }
    }
    setFilter(next);
  };

  // Reorganize the grid with Flip after a filter change.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state || !list.current || !flip.current) return;
      flipState.current = null;
      flip.current.from(state, {
        targets: list.current.querySelectorAll("[data-project-card]"),
        duration: 0.7,
        ease: "expo.out",
        absolute: true,
        scale: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [filter], scope: root },
  );

  // Scroll choreography per card: cover opens through a mask while its image settles,
  // copy follows line by line, and the card in the middle of the screen takes focus.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const cancel = onIdle(() => setup());
      return () => {
        cancel();
        mm.revert();
      };

      function setup() {
      mm.add(motionQueries.motion, (ctx) => {
        // One card per idle slot keeps each setup task short on slower phones.
        const stop = eachIdle(gsap.utils.toArray<HTMLElement>("[data-project-card]"), ctx.add("setupCard", (card: HTMLElement) => {
          const frame = card.querySelector("[data-cover-frame]");
          const media = card.querySelector("[data-cover-media]");
          const lines = card.querySelectorAll("[data-card-line]");
          const big = card.dataset.size === "feature";
          gsap.fromTo(
            frame,
            { clipPath: big ? "inset(14% 22% 14% 22% round 1.4rem)" : "inset(22% 10% 22% 10% round 1.4rem)" },
            { clipPath: "inset(0% 0% 0% 0% round 1.4rem)", ease: "none", scrollTrigger: { trigger: card, start: "top 95%", end: "top 55%", scrub: 0.6 } },
          );
          // The cover settles to its real size by the time the card reaches the middle of the
          // screen, and stays there — what you see in focus is the whole illustration.
          gsap.fromTo(
            media,
            { scale: 1.18 },
            { scale: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 95%", end: "center 55%", scrub: 0.6 } },
          );
          gsap.fromTo(
            lines,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 78%", toggleActions: "play none none reverse" },
            },
          );
          ScrollTrigger.create({ trigger: card, start: "top 58%", end: "bottom 42%", toggleClass: { targets: card, className: "is-focus" } });
        }) as (card: HTMLElement) => void);
        return () => stop();
      });

      // Subtle 3D tilt on hover, only for precise pointers.
      mm.add(`${motionQueries.motion} and (pointer: fine)`, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>("[data-cover-frame]").map((frame) => {
          const tilt = frame.querySelector<HTMLElement>("[data-tilt]");
          if (!tilt) return () => {};
          gsap.set(tilt, { transformPerspective: 900 });
          const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });
          const sc = gsap.quickTo(tilt, "scale", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = frame.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 7);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
            sc(1.03);
          };
          const leave = () => {
            rx(0);
            ry(0);
            sc(1);
          };
          const card = frame.closest("[data-project-card]") ?? frame;
          card.addEventListener("pointermove", move as EventListener);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move as EventListener);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
      }
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  return (
    <div ref={root}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label={dict.projects.filterLabel} className="-mx-1 flex flex-wrap gap-2 px-1">
          {[{ id: "all" as const, label: { pt: dict.projects.all, en: dict.projects.all } }, ...categories].map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => void changeFilter(c.id)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                  active ? "border-ink bg-ink text-ice" : "border-line-strong text-fg hover:border-ink"
                }`}
              >
                {c.id !== "all" && (
                  <span aria-hidden="true" className="size-2 rotate-45 rounded-[1px]" style={{ background: categoryColor[c.id] }} />
                )}
                {c.label[locale]}
              </button>
            );
          })}
        </div>
        <p className="mono text-xs tracking-wide text-fg-muted uppercase" aria-live="polite">
          {dict.projects.count(visible.length)}
        </p>
      </div>

      <ul ref={list} className="mt-12 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24">
        {visible.map((p, i) => {
          const slot = sizes[i] ?? { size: "m" as const, flip: false };
          return (
            <ProjectCard
              key={p.slug}
              project={p}
              locale={locale}
              index={projects.indexOf(p)}
              size={slot.size}
              flip={slot.flip}
              onOpen={open}
            />
          );
        })}
      </ul>

      {github && (
        <a
          href={github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost mt-10"
        >
          <GithubIcon className="size-4" />
          {dict.projects.github}
          <span className="sr-only"> {dict.external}</span>
        </a>
      )}

      <ProjectDialog project={openProject} locale={locale} onClose={close} />
    </div>
  );
}
