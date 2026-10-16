"use client";

import { ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { layers, securityLayer } from "@/content/architecture";
import { getDictionary } from "@/content/dictionary";
import { gsap, motionQueries, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onIdle } from "@/lib/idle";
import type { Locale } from "@/lib/i18n";
import { layerColors, layerOrder } from "@/lib/layers";
import { sectionIds } from "@/lib/sections";
import { SectionHeading } from "./SectionHeading";

const STEPS = layers.length + 1; // five layers + the security envelope
const W = 150;
const H = 75;
const T = 12;
const GAP = 62;

export function Architecture({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  // Everything is lit by default: that is the no-JS, mobile, and reduced-motion state.
  const [active, setActive] = useState(STEPS);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const cancel = onIdle(() => mm.add(motionQueries.pinnable, setup));
      return () => {
        cancel();
        mm.revert();
      };

      function setup() {
        setActive(0);
        const st = ScrollTrigger.create({
          trigger: stage.current,
          start: "top top+=64",
          end: () => `+=${spacer.current?.offsetHeight ?? window.innerHeight * 2.2}`,
          pin: true,
          // Scroll room is reserved in CSS ([data-arch-spacer]) so layout is stable before hydration.
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            setActive(Math.min(STEPS, Math.floor(self.progress * (STEPS + 0.999))));
            root.current?.style.setProperty("--arch-p", self.progress.toFixed(4));
          },
        });
        gsap.fromTo(
          "[data-arch-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: stage.current,
              start: "top top+=64",
              end: () => `+=${spacer.current?.offsetHeight ?? window.innerHeight * 2.2}`,
              scrub: true,
            },
          },
        );
        return () => {
          st.kill();
          setActive(STEPS);
          root.current?.style.removeProperty("--arch-p");
        };
      }
    },
    { scope: root },
  );

  const cx = W + 34;
  const top = 34 + H;
  const height = top + (layerOrder.length - 1) * GAP + H + T + 34;
  const securityOn = active >= STEPS;
  const spineX = cx + W + 22;
  const firstY = top;
  const lastY = top + (layerOrder.length - 1) * GAP;
  // Ambient light takes the color of the layer in focus (coral once security closes the loop).
  const focusId = active >= STEPS ? "security" : layerOrder[Math.max(0, active - 1)];
  const glow = layerColors[focusId ?? "interface"];

  return (
    <section
      ref={root}
      id={sectionIds.architecture}
      data-theme="dark"
      data-wipe
      aria-labelledby="architecture-title"
      className="grain relative overflow-x-clip py-24 lg:py-32"
    >
      <div className="container-x">
        <SectionHeading
          id="architecture-title"
          kicker={dict.architecture.kicker}
          title={dict.architecture.title}
          intro={dict.architecture.intro}
          aside={<span className="chip">{dict.architecture.conceptual}</span>}
        />
      </div>

      <div ref={stage} className="container-x mt-14 lg:mt-20 lg:flex lg:min-h-[calc(100svh-64px)] lg:items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12">
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[15%] opacity-40 transition-colors duration-700"
              style={{ color: glow, background: "radial-gradient(closest-side, currentColor, transparent)" }}
            />
            <svg viewBox={`0 0 ${cx * 2 + 30} ${height}`} className="relative h-auto w-full overflow-visible" aria-hidden="true">
              {/* Spine: the request travels down through the layers. */}
              <path
                d={`M${spineX} ${firstY} V ${lastY}`}
                pathLength={1}
                stroke="rgba(241,245,250,0.18)"
                strokeWidth={1.5}
                fill="none"
              />
              <path
                d={`M${spineX} ${firstY} V ${lastY}`}
                pathLength={1}
                strokeDasharray="1"
                stroke={glow}
                strokeWidth={2}
                fill="none"
                style={{ strokeDashoffset: "calc(1 - var(--arch-p, 1) * 1.15)", transition: "stroke 700ms var(--ease-out)" }}
              />
              {layerOrder.map((id, i) => {
                const y = top + i * GAP;
                return (
                  <path
                    key={id}
                    d={`M${cx + W} ${y} H ${spineX}`}
                    pathLength={1}
                    strokeDasharray="1"
                    stroke={layerColors[id]}
                    strokeWidth={2}
                    fill="none"
                    style={{ strokeDashoffset: i < active ? 0 : 1, transition: "stroke-dashoffset 600ms var(--ease-out)" }}
                  />
                );
              })}
              <circle
                cx={spineX}
                cy={firstY}
                r={5}
                fill="#d8ff68"
                style={{
                  transform: `translateY(calc(min(var(--arch-p, 1) * 1.15, 1) * ${lastY - firstY}px))`,
                  opacity: active > 0 && active < STEPS ? 1 : 0,
                  transition: "opacity 400ms",
                }}
              />
              {[...layerOrder].reverse().map((id) => {
                const i = layerOrder.indexOf(id);
                const on = i < active;
                const y = top + i * GAP;
                const c = layerColors[id];
                return (
                  <g
                    key={id}
                    style={{ opacity: on ? 1 : 0.16, transform: on ? "none" : "translateY(12px)", transition: "opacity 500ms var(--ease-out), transform 600ms var(--ease-out)" }}
                  >
                    <polygon points={`${cx - W},${y} ${cx},${y + H} ${cx},${y + H + T} ${cx - W},${y + T}`} fill={c} opacity={0.55} />
                    <polygon points={`${cx + W},${y} ${cx},${y + H} ${cx},${y + H + T} ${cx + W},${y + T}`} fill={c} opacity={0.35} />
                    <polygon points={`${cx},${y - H} ${cx + W},${y} ${cx},${y + H} ${cx - W},${y}`} fill={c} />
                    <text
                      x={cx}
                      y={y + 5}
                      textAnchor="middle"
                      className="mono"
                      fontSize="13"
                      fill={id === "api" ? "#f1f5fa" : "#0b1020"}
                    >
                      {layers.find((l) => l.id === id)?.index}
                    </text>
                  </g>
                );
              })}
              <polygon
                points={`${cx},${top - H - 22} ${cx + W + 24},${top} ${cx + W + 24},${top + (layerOrder.length - 1) * GAP + T + 10} ${cx},${top + (layerOrder.length - 1) * GAP + H + T + 22} ${cx - W - 24},${top + (layerOrder.length - 1) * GAP + T + 10} ${cx - W - 24},${top}`}
                fill="none"
                stroke={layerColors.security}
                strokeWidth={2}
                strokeDasharray="7 7"
                className={securityOn ? "arch-envelope-on" : undefined}
                style={{ opacity: securityOn ? 1 : 0.15, transition: "opacity 500ms var(--ease-out)" }}
              />
            </svg>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 hidden w-px bg-line lg:block">
              <span
                data-arch-progress
                className="block h-full w-full origin-top transition-[background-color] duration-700"
                style={{ backgroundColor: glow }}
              />
            </span>
            <ol className="flex flex-col gap-2 lg:gap-1 lg:pl-10">
              {layers.map((layer, i) => {
                const on = i < active;
                return (
                  <li
                    key={layer.id}
                    aria-current={on && i === active - 1 ? "step" : undefined}
                    className="rounded-xl border border-line p-5 transition-colors duration-500 lg:border-transparent lg:px-4 lg:py-3"
                    style={{
                      color: on ? "var(--fg)" : "var(--fg-muted)",
                      borderColor: on && i === active - 1 ? layerColors[layer.id] : undefined,
                      transform: on && i === active - 1 ? "translateX(8px)" : undefined,
                      transition: "color 500ms, border-color 500ms, transform 600ms var(--ease-out)",
                    }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="mono text-xs" style={{ color: layerColors[layer.id] }}>
                        {layer.index}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                          <h3 className="text-xl font-medium lg:text-lg">{layer.title[locale]}</h3>
                          <ul className="flex flex-wrap gap-1.5">
                            {layer.tech.map((t) => (
                              <li key={t} className="chip">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="mt-1.5 text-fg-muted lg:text-sm">{layer.body[locale]}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
              <li
                className="mt-2 rounded-xl border p-5 transition-colors duration-500 lg:px-4 lg:py-3"
                style={{
                  borderColor: securityOn ? layerColors.security : "var(--line)",
                  color: securityOn ? "var(--fg)" : "var(--fg-muted)",
                }}
              >
                <div className="flex items-baseline gap-4">
                  <ShieldCheck aria-hidden className="size-4 shrink-0 translate-y-0.5" style={{ color: layerColors.security }} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-medium lg:text-lg">{securityLayer.title[locale]}</h3>
                    <p className="mt-1.5 text-fg-muted lg:text-sm">{securityLayer.body[locale]}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {securityLayer.tech.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div ref={spacer} data-arch-spacer aria-hidden="true" />
    </section>
  );
}
