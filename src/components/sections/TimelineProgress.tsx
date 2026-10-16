"use client";

import { useRef } from "react";
import { gsap, motionQueries, useGSAP } from "@/lib/gsap";

/** Vertical rail that fills as the journey scrolls by. Static full rail without motion. */
export function TimelineProgress() {
  const rail = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = rail.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(motionQueries.motion, () => {
      gsap.fromTo(
        el.firstElementChild,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
    });
  });

  return (
    <span ref={rail} aria-hidden="true" className="absolute top-2 bottom-2 left-0 w-px bg-line">
      <span className="block h-full w-full origin-top bg-ink" />
    </span>
  );
}
