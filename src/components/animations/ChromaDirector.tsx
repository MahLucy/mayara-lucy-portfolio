"use client";

import { useRef } from "react";
import { gsap, motionQueries, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onIdle } from "@/lib/idle";

/**
 * Chromatic transitions between chapters.
 *
 * One visual language for the whole page: each chapter enters through an
 * isometric diamond — the top face of a stack layer — that opens from its top
 * edge and grows until it fills the viewport. A thin outline leads the fill.
 *
 * Contrast stays correct throughout: no colors are blended. Text always sits
 * on its own chapter's solid background; outside the diamond the page shows the
 * previous chapter's color (set on <body>), so the old surface simply recedes.
 */
const ease = gsap.parseEase("power2.inOut");

function diamond(cx: number, cy: number, s: number) {
  // Isometric proportion: horizontal radius is twice the vertical one.
  return `${cx}px ${cy - s}px, ${cx + 2 * s}px ${cy}px, ${cx}px ${cy + s}px, ${cx - 2 * s}px ${cy}px`;
}

export function ChromaDirector() {
  const outline = useRef<SVGPolygonElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const cancel = onIdle(() => mm.add(motionQueries.motion, setup));
    return () => {
      cancel();
      mm.revert();
    };

    function setup() {
      const sections = gsap.utils.toArray<HTMLElement>("main [data-wipe]");
      const body = document.body;
      const triggers = sections.map((section) => {
        const prev = section.previousElementSibling as HTMLElement | null;
        const fromColor = prev ? getComputedStyle(prev).backgroundColor : "";
        const toColor = getComputedStyle(section).backgroundColor;

        const apply = (progress: number) => {
          const w = section.clientWidth;
          const vh = window.innerHeight;
          const max = w / 4 + vh * 1.05;
          const s = ease(progress) * max;
          if (progress >= 1) {
            section.style.clipPath = "";
          } else {
            section.style.clipPath = `polygon(${diamond(w / 2, 0, s)})`;
            if (fromColor) body.style.backgroundColor = fromColor;
          }
          const line = outline.current;
          if (!line) return;
          if (progress > 0 && progress < 1) {
            const top = section.getBoundingClientRect().top;
            line.setAttribute("points", diamond(w / 2, top, s + 18).replace(/px/g, ""));
            line.style.stroke = toColor;
            line.style.opacity = String(Math.min(1, progress * 6) * (1 - progress));
          } else if (line.dataset.owner === section.id) {
            line.style.opacity = "0";
          }
          if (progress > 0 && progress < 1) line.dataset.owner = section.id;
        };

        return ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "top 10%",
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => apply(self.progress),
        });
      });

      return () => {
        triggers.forEach((t) => t.kill());
        sections.forEach((s) => (s.style.clipPath = ""));
        body.style.backgroundColor = "";
        if (outline.current) outline.current.style.opacity = "0";
      };
    }
  });

  return (
    <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 h-full w-full overflow-visible" focusable="false">
      <polygon ref={outline} points="0,0" fill="none" strokeWidth="1.5" style={{ opacity: 0 }} />
    </svg>
  );
}
