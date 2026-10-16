"use client";

import { useRef } from "react";
import { gsap, motionQueries, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onIdle } from "@/lib/idle";

/** Drives the marquee with GSAP so it speeds up with scroll velocity and follows scroll direction. */
export function MarqueeMotion() {
  const probe = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const track = probe.current?.closest(".marquee")?.querySelector<HTMLElement>(".marquee-track");
    if (!track) return;
    const mm = gsap.matchMedia();
    const cancel = onIdle(() => mm.add(motionQueries.motion, setup));
    return () => {
      cancel();
      mm.revert();
    };

    function setup() {
      if (!track) return;
      track.classList.add("is-gsap");
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      let dir = 1;
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          dir = self.direction;
          const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 500);
          gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out" });
        },
      });
      const marquee = track.closest(".marquee");
      const pause = () => loop.pause();
      const play = () => loop.resume();
      marquee?.addEventListener("pointerenter", pause);
      marquee?.addEventListener("pointerleave", play);
      return () => {
        st.kill();
        loop.kill();
        track.classList.remove("is-gsap");
        gsap.set(track, { clearProps: "transform" });
        marquee?.removeEventListener("pointerenter", pause);
        marquee?.removeEventListener("pointerleave", play);
      };
    }
  });

  return <span ref={probe} hidden />;
}
