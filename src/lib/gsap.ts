"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

/** Media queries shared by every motion component, used with gsap.matchMedia(). */
export const motionQueries = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  /** Pinned scenes need room: wide and tall enough to show the whole stage. */
  pinnable: "(min-width: 1024px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)",
  /** Horizontal stack scene: wide screens with enough height for the cards. */
  stackPinnable: "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/** Flip is only needed once someone filters the projects, so it loads on demand. */
export async function loadFlip() {
  const { Flip } = await import("gsap/Flip");
  gsap.registerPlugin(Flip);
  return Flip;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
