"use client";

import { gsap, motionQueries, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { eachIdle, onIdle } from "@/lib/idle";

/**
 * Page-wide motion that isn't owned by a single section. Each effect has a
 * narrative job, and they differ per chapter on purpose:
 * - section titles rise line by line through a mask;
 * - the About lead darkens to full contrast word by word as it is read;
 * - the portrait opens through a crop;
 * - journey milestones light up once passed;
 * - contact rings drift at different speeds (depth).
 */
export function MotionDirector() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    // Most of this sits below the fold: set it up in small idle slots after hydration.
    const cancel = onIdle(() => mm.add(motionQueries.motion, setup));
    return () => {
      cancel();
      mm.revert();
    };

    function setup(ctx: gsap.Context) {
      const splits: SplitText[] = [];
      const titles = gsap.utils.toArray<HTMLElement>("[data-reveal-title]");
      const stopTitles = eachIdle(titles, ctx.add("splitTitle", (el: HTMLElement) => {
        splits.push(SplitText.create(el, {
          type: "lines",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
            }),
        }));
      }) as (el: HTMLElement) => void);

      const lead = document.querySelector<HTMLElement>("[data-about-lead]");
      if (lead) {
        const words = SplitText.create(lead, { type: "words", aria: "none" });
        splits.push(words);
        // Muted (AA) → full ink: a reading cue that never drops below legible contrast.
        gsap.fromTo(words.words, { color: "var(--fg-muted)" }, {
          color: "var(--fg)",
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: lead, start: "top 80%", end: "bottom 55%", scrub: true },
        });
      }

      const photo = document.querySelector<HTMLElement>("[data-about-photo]");
      if (photo) {
        gsap.fromTo(photo, { clipPath: "inset(0% 0% 100% 0% round 1rem)" }, {
          clipPath: "inset(0% 0% 0% 0% round 1rem)",
          ease: "none",
          scrollTrigger: { trigger: photo, start: "top 90%", end: "top 40%", scrub: 0.6 },
        });
        gsap.fromTo(photo.querySelector("img"), { scale: 1.3 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: photo, start: "top 90%", end: "bottom 30%", scrub: true },
        });
        gsap.fromTo("[data-about-block]", { xPercent: -12, yPercent: -12 }, {
          xPercent: 0,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: photo, start: "top 80%", end: "bottom 50%", scrub: true },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-journey-item]").forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: "top 60%", toggleClass: { targets: item, className: "is-past" } });
      });

      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
        const depth = Number(el.dataset.depth ?? 1);
        gsap.fromTo(el, { yPercent: -20 * depth }, {
          yPercent: 20 * depth,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Fonts change line breaks; recalculate positions once they settle.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        stopTitles();
        splits.forEach((s) => s.revert());
      };
    }
  });

  return null;
}
