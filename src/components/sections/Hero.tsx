"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useCallback, useRef, useState, type CSSProperties } from "react";
import { HeroScene, type SceneStatus } from "@/components/3d/HeroVisual";
import { StackGlyph } from "@/components/3d/StackGlyph";
import { getDictionary } from "@/content/dictionary";
import { profile } from "@/content/profile";
import { gsap, motionQueries, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";
import { sceneStore } from "@/lib/scene-store";
import { sectionIds } from "@/lib/sections";

/** Stagger index consumed by the CSS intro animation. */
const delay = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Opening composition: where the anchor (and therefore the monolith) starts.
 * Mirrored in globals.css (.can-motion [data-hero-anchor]) so the first paint
 * already shows the opening state, before hydration.
 */
export const heroOpening = {
  desktop: { x: -0.06, y: 0.02, scale: 1.75 },
  mobile: { x: 0, y: 0.04, scale: 1.45 },
};

export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>("pending");
  const onStatusChange = useCallback((status: SceneStatus) => setSceneStatus(status), []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !anchor.current || !spacer.current) return;
      sceneStore.anchor = anchor.current;
      document.documentElement.classList.add("motion-live");

      // Exit: once the opening is done and the hero scrolls away, the layers drift apart again.
      const exit = ScrollTrigger.create({
        trigger: spacer.current,
        start: "bottom bottom",
        end: () => `+=${window.innerHeight}`,
        onUpdate: (self) => {
          sceneStore.progress = self.progress;
          sceneStore.emit();
        },
      });

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 1024px)", motion: motionQueries.motion },
        (ctx) => {
          const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
          if (!motion) {
            sceneStore.intro = 1;
            sceneStore.emit();
            return;
          }
          const opening = desktop ? heroOpening.desktop : heroOpening.mobile;
          const intro = { value: 0 };

          // One timeline owns the whole opening: anchor box, scene progress, copy and cues.
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage.current,
              start: "top top",
              end: () => `+=${spacer.current?.offsetHeight ?? window.innerHeight}`,
              pin: true,
              // Scroll room is reserved in CSS ([data-hero-spacer]), so no pin spacing.
              pinSpacing: false,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            anchor.current,
            {
              x: () => opening.x * window.innerWidth,
              y: () => opening.y * window.innerHeight,
              scale: opening.scale,
            },
            { x: 0, y: 0, scale: 1, duration: 1, ease: "power2.out" },
            0,
          )
            .fromTo(
              intro,
              { value: 0 },
              {
                value: 1,
                duration: 1,
                ease: "none",
                onUpdate: () => {
                  sceneStore.intro = intro.value;
                  sceneStore.emit();
                },
              },
              0,
            )
            .fromTo("[data-hero-scrim]", { opacity: 1 }, { opacity: 0, duration: 0.6 }, 0.25)
            .fromTo("[data-hero-cue]", { opacity: 1 }, { opacity: 0, duration: 0.15 }, 0)
            .fromTo(
              "[data-hero-title]",
              { scale: desktop ? 1.12 : 1, transformOrigin: "0% 100%" },
              { scale: 1, duration: 0.8, ease: "power2.out" },
              0,
            )
            .fromTo(
              "[data-hero-reveal]",
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: "power2.out" },
              0.42,
            )
            .fromTo("[data-hero-meter]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

          // Copy drifts up and dims as the hero leaves.
          gsap.to("[data-hero-copy]", {
            yPercent: -14,
            opacity: 0.25,
            ease: "none",
            scrollTrigger: { trigger: spacer.current, start: "bottom bottom", end: () => `+=${window.innerHeight}`, scrub: true },
          });

          // Keyboard users tabbing into hidden copy skip straight to the settled state.
          const onFocus = () => {
            const st = tl.scrollTrigger;
            if (st && st.progress < 1) window.scrollTo({ top: st.end, behavior: "instant" });
          };
          el.addEventListener("focusin", onFocus);
          return () => el.removeEventListener("focusin", onFocus);
        },
      );

      return () => {
        exit.kill();
        sceneStore.anchor = null;
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id={sectionIds.top} data-theme="dark" aria-labelledby="hero-title" className="relative isolate">
      <div ref={stage} data-hero-stage className="grain relative flex h-svh min-h-[560px] flex-col overflow-hidden">
        <HeroScene onStatusChange={onStatusChange} />
        <div
          data-hero-scrim
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(11,16,32,0.92)_0%,rgba(11,16,32,0.7)_38%,transparent_62%)] max-lg:bg-[linear-gradient(0deg,rgba(11,16,32,0.94)_0%,rgba(11,16,32,0.75)_40%,transparent_62%)]"
        />

        <div className="container-x relative z-10 grid flex-1 items-center gap-8 pt-24 pb-6 lg:grid-cols-12 lg:pt-28">
          <div data-hero-copy className="relative order-2 lg:order-1 lg:col-span-6">
            <p data-hero-intro style={delay(0)} className="kicker">
              {dict.hero.eyebrow} · {profile.location[locale]}
            </p>

            <h1
              id="hero-title"
              data-hero-title
              className="mt-6 text-[clamp(3rem,1.6rem+6.4vw,7rem)] leading-[0.92] font-light tracking-[-0.045em]"
            >
              Mayara <strong className="font-medium">Lucy</strong>
            </h1>

            <p data-hero-intro style={delay(1)} className="mono mt-6 text-sm tracking-wide text-cyan sm:text-base">
              {profile.role}
            </p>

            <div data-hero-reveal>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-fg-muted sm:text-xl">{profile.headline[locale]}</p>
            </div>

            <div data-hero-reveal className="mt-10 flex flex-wrap gap-3">
              <a href={`#${sectionIds.projects}`} className="btn btn-primary">
                {dict.hero.ctaProjects}
                <ArrowRight aria-hidden className="btn-icon size-4" />
              </a>
              <a href={`#${sectionIds.stack}`} className="btn btn-ghost">
                {dict.hero.ctaStack}
              </a>
              <a href={`#${sectionIds.contact}`} className="btn btn-ghost">
                {dict.hero.ctaContact}
              </a>
            </div>
          </div>

          {/* Slot = the settled composition. The anchor inside it starts large and converges here. */}
          <div className="relative order-1 h-[38svh] min-h-[220px] lg:order-2 lg:col-span-6 lg:h-[76svh]">
            <div
              ref={anchor}
              data-hero-anchor
              role="img"
              aria-label={dict.hero.sceneLabel}
              className="absolute inset-0 will-change-transform"
            >
              {/* Before hydration CSS decides (hidden when the 3D opening will play); afterwards the
                  illustration shows only when it is the fallback. */}
              <div
                data-hero-glyph
                className="absolute inset-0 transition-opacity duration-700"
                style={sceneStatus === "pending" ? undefined : { opacity: sceneStatus === "static" ? 1 : 0 }}
              >
                <StackGlyph className="absolute inset-0 m-auto h-[82%] w-auto max-w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="container-x relative z-10 flex items-center gap-4 pb-8 text-fg-muted" aria-hidden="true">
          <span data-hero-cue className="flex items-center gap-3">
            <ArrowDown className="size-4" />
            <span className="mono text-xs tracking-[0.14em] uppercase">{dict.hero.scroll}</span>
          </span>
          <span className="relative ml-auto hidden h-px w-40 bg-line lg:block">
            <span data-hero-meter className="absolute inset-0 origin-left bg-lime" />
          </span>
        </div>
      </div>
      <div ref={spacer} data-hero-spacer aria-hidden="true" />
    </section>
  );
}
