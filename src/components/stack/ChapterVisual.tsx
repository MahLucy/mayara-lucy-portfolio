import type { StackChapter } from "@/content/skills";
import { gsap } from "@/lib/gsap";
import { layerColors } from "@/lib/layers";

/**
 * Abstract, illustrative diagrams for each stack chapter. They are not real
 * architectures: shapes only hint at what the area does. Every animated part is
 * tagged with data-v so `buildChapterTimeline` can drive it from scroll progress.
 */

const ink = "#0b1020";
const line = "rgba(241,245,250,0.22)";
const soft = "rgba(241,245,250,0.6)";

/** Paths use pathLength=1 so "drawing" is just strokeDashoffset 1 → 0. */
function Path(props: React.SVGProps<SVGPathElement>) {
  return <path pathLength={1} strokeDasharray="1" strokeDashoffset="0" fill="none" strokeLinecap="round" {...props} />;
}

function FullStack() {
  const c = layerColors.api;
  return (
    <>
      <g data-v="top">
        <rect x="60" y="34" width="200" height="74" rx="8" fill="#f1f5fa" />
        <rect x="74" y="48" width="60" height="8" rx="4" fill={ink} opacity=".7" />
        <rect x="74" y="64" width="120" height="6" rx="3" fill={ink} opacity=".25" />
        <rect x="74" y="78" width="96" height="6" rx="3" fill={ink} opacity=".25" />
        <rect x="200" y="48" width="46" height="46" rx="6" fill={c} />
      </g>
      {[110, 160, 210].map((x, i) => (
        <Path key={x} data-v="wire" d={`M${x} 112 L${x} 152`} stroke={c} strokeWidth="2" style={{ ["--i" as string]: i }} />
      ))}
      {[110, 160, 210].map((x) => (
        <circle key={x} data-v="packet" cx={x} cy="112" r="3.5" fill="#d8ff68" opacity="0" />
      ))}
      <g data-v="bottom">
        <rect x="60" y="156" width="200" height="66" rx="8" fill={ink} stroke={line} />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x="74" y={170 + r * 16} width="150" height="8" rx="2" fill={c} opacity={0.35 + r * 0.2} />
            <circle cx="238" cy={174 + r * 16} r="3" fill="#52e6d0" />
          </g>
        ))}
      </g>
    </>
  );
}

function Ai() {
  const c = layerColors.ai;
  const inputs = [50, 100, 150, 200];
  const mids = [70, 125, 180];
  return (
    <>
      {inputs.map((y, i) =>
        mids.map((m, j) => (
          <Path key={`${i}-${j}`} data-v="edge" d={`M84 ${y + 12} C 130 ${y + 12}, 130 ${m + 12}, 170 ${m + 12}`} stroke={c} strokeWidth="1.2" opacity=".55" />
        )),
      )}
      {mids.map((m) => (
        <Path key={m} data-v="edge2" d={`M184 ${m + 12} C 220 ${m + 12}, 220 137, 248 137`} stroke="#d8ff68" strokeWidth="1.6" />
      ))}
      {inputs.map((y) => (
        <rect key={y} data-v="doc" x="52" y={y} width="32" height="24" rx="4" fill="#f1f5fa" />
      ))}
      {mids.map((m) => (
        <circle key={m} data-v="node" cx="177" cy={m + 12} r="9" fill={ink} stroke={c} strokeWidth="2" />
      ))}
      <g data-v="core">
        <circle cx="266" cy="137" r="22" fill={c} />
        <circle cx="266" cy="137" r="32" fill="none" stroke={c} strokeOpacity=".35" />
      </g>
    </>
  );
}

function Cloud() {
  const c = layerColors.cloud;
  return (
    <>
      <rect data-v="vpc" x="96" y="28" width="196" height="200" rx="14" fill="none" stroke={soft} strokeDasharray="5 6" />
      <g data-v="lb">
        <rect x="24" y="110" width="52" height="36" rx="8" fill="#f1f5fa" />
        <rect x="34" y="124" width="32" height="8" rx="4" fill={ink} opacity=".6" />
      </g>
      {[60, 112, 164].map((y, i) => (
        <Path key={y} data-v="link" d={`M76 128 C 100 128, 100 ${y + 18}, 124 ${y + 18}`} stroke={c} strokeWidth="1.8" style={{ ["--i" as string]: i }} />
      ))}
      {[60, 112, 164].map((y) => (
        <g key={y} data-v="task">
          <rect x="124" y={y} width="70" height="36" rx="6" fill={ink} stroke={c} strokeWidth="1.5" />
          <rect x="134" y={y + 14} width="34" height="8" rx="4" fill={c} />
        </g>
      ))}
      {[60, 112, 164].map((y) => (
        <Path key={y} data-v="link2" d={`M194 ${y + 18} C 214 ${y + 18}, 214 128, 234 128`} stroke={soft} strokeWidth="1.2" />
      ))}
      <g data-v="db">
        <ellipse cx="258" cy="112" rx="24" ry="8" fill="#8fa6ff" />
        <rect x="234" y="112" width="48" height="34" fill="#8fa6ff" />
        <ellipse cx="258" cy="146" rx="24" ry="8" fill="#6f87e6" />
        <ellipse cx="258" cy="112" rx="24" ry="8" fill="#b9c7ff" />
      </g>
    </>
  );
}

function Data() {
  const c = layerColors.data;
  const cyl = (x: number, fill: string, key: string) => (
    <g key={key} data-v="cyl">
      <rect x={x} y="70" width="70" height="110" fill={fill} />
      <ellipse cx={x + 35} cy="180" rx="35" ry="11" fill={fill} />
      <ellipse cx={x + 35} cy="70" rx="35" ry="11" fill="#f1f5fa" opacity=".9" />
      {[0, 1, 2].map((r) => (
        <rect key={r} data-v="row" x={x + 12} y={96 + r * 22} width="46" height="7" rx="3" fill={ink} opacity=".45" />
      ))}
    </g>
  );
  return (
    <>
      {cyl(40, c, "a")}
      {cyl(230, "#52e6d0", "b")}
      <Path data-v="flow" d="M118 108 C 160 90, 190 90, 222 108" stroke="#d8ff68" strokeWidth="2" />
      <Path data-v="flow" d="M222 148 C 190 166, 160 166, 118 148" stroke={soft} strokeWidth="2" />
      <circle data-v="token" cx="118" cy="108" r="4" fill="#d8ff68" opacity="0" />
    </>
  );
}

function DevSecOps() {
  const c = layerColors.security;
  const stages = [24, 98, 172, 246];
  return (
    <>
      <Path data-v="rail" d="M40 128 L 292 128" stroke={line} strokeWidth="2" />
      {stages.map((x, i) => (
        <g key={x} data-v="stage">
          <rect x={x} y="104" width="56" height="48" rx="8" fill={i === 2 ? c : "#f1f5fa"} opacity={i === 2 ? 1 : 0.92} />
          <rect x={x + 12} y="124" width="32" height="7" rx="3" fill={ink} opacity=".55" />
        </g>
      ))}
      <rect data-v="scan" x="166" y="92" width="3" height="72" rx="1.5" fill="#d8ff68" opacity="0" />
      {stages.map((x) => (
        <Path key={x} data-v="check" d={`M${x + 19} 180 l7 7 l13 -14`} stroke="#d8ff68" strokeWidth="3" />
      ))}
      <path data-v="shield" d="M160 40 l26 10 v18 c0 16 -12 26 -26 32 c-14 -6 -26 -16 -26 -32 v-18 z" fill="none" stroke={c} strokeWidth="2.5" />
    </>
  );
}

const visuals: Record<StackChapter["id"], () => React.JSX.Element> = {
  fullstack: FullStack,
  ai: Ai,
  cloud: Cloud,
  data: Data,
  devsecops: DevSecOps,
};

export function ChapterVisual({ id }: { id: StackChapter["id"] }) {
  const Visual = visuals[id];
  return (
    <svg viewBox="0 0 320 256" className="h-full w-full" aria-hidden="true" focusable="false">
      <Visual />
    </svg>
  );
}

/** Builds the paused timeline for one chapter visual; scroll progress drives it. */
export function buildChapterTimeline(root: Element, id: StackChapter["id"]): gsap.core.Timeline {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.4 } });
  const draw = (sel: string, at: number | string, stagger = 0.05) =>
    tl.fromTo(q(sel), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger }, at);

  switch (id) {
    case "fullstack":
      tl.fromTo(q("[data-v=top]"), { y: 40 }, { y: 0 }, 0).fromTo(q("[data-v=bottom]"), { y: -36 }, { y: 0 }, 0);
      draw("[data-v=wire]", 0.3, 0.08);
      tl.fromTo(q("[data-v=packet]"), { opacity: 0, y: 0 }, { opacity: 1, y: 40, stagger: 0.08, ease: "none" }, 0.55);
      break;
    case "ai":
      tl.fromTo(q("[data-v=doc]"), { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05 }, 0);
      draw("[data-v=edge]", 0.15, 0.015);
      tl.fromTo(q("[data-v=node]"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, stagger: 0.06, ease: "back.out(2)" }, 0.35);
      draw("[data-v=edge2]", 0.55, 0.05);
      tl.fromTo(q("[data-v=core]"), { scale: 0.4, opacity: 0, transformOrigin: "266px 137px" }, { scale: 1, opacity: 1 }, 0.7);
      break;
    case "cloud":
      tl.fromTo(q("[data-v=vpc]"), { opacity: 0, scale: 0.92, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1 }, 0);
      tl.fromTo(q("[data-v=lb]"), { x: -24, opacity: 0 }, { x: 0, opacity: 1 }, 0.1);
      draw("[data-v=link]", 0.25, 0.06);
      tl.fromTo(q("[data-v=task]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07 }, 0.35);
      draw("[data-v=link2]", 0.6, 0.05);
      tl.fromTo(q("[data-v=db]"), { y: 16, opacity: 0 }, { y: 0, opacity: 1 }, 0.7);
      break;
    case "data":
      tl.fromTo(q("[data-v=cyl]"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12 }, 0);
      tl.fromTo(q("[data-v=row]"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, stagger: 0.04 }, 0.25);
      draw("[data-v=flow]", 0.5, 0.15);
      tl.fromTo(q("[data-v=token]"), { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: 104, y: 0, ease: "none", duration: 0.35 }, 0.65);
      break;
    case "devsecops":
      draw("[data-v=rail]", 0);
      tl.fromTo(q("[data-v=stage]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08 }, 0.1);
      tl.fromTo(q("[data-v=scan]"), { opacity: 0, x: -150 }, { opacity: 1, x: 120, ease: "none", duration: 0.5 }, 0.4);
      draw("[data-v=check]", 0.55, 0.08);
      tl.fromTo(q("[data-v=shield]"), { scale: 0.6, opacity: 0, transformOrigin: "160px 70px" }, { scale: 1, opacity: 1, ease: "back.out(2)" }, 0.7);
      break;
  }
  return tl;
}
