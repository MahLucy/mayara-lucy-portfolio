import type { LayerId } from "@/content/architecture";
import { layerColors, layerOrder } from "@/lib/layers";

type Props = {
  /** Layers drawn in full color; the rest are drawn as outlines. Omit to color all. */
  highlight?: (LayerId | "security")[];
  /** Vertical distance between slabs, in viewBox units. */
  gap?: number;
  /** Surface the glyph sits on, used for outline and side-face tones. */
  tone?: "dark" | "light";
  showSecurity?: boolean;
  className?: string;
  title?: string;
};

const W = 120;
const H = 60;
const T = 10;

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r} ${g} ${b})`;
}

/**
 * Isometric illustration of the five-layer stack. It is the static
 * counterpart of the 3D monolith, so it doubles as the WebGL fallback.
 */
export function StackGlyph({ highlight, gap = 44, tone = "dark", showSecurity = true, className, title }: Props) {
  const total = (layerOrder.length - 1) * gap;
  const top = 30 + H;
  const height = top + total + H + T + 30;
  const cx = W + 30;
  const outline = tone === "dark" ? "rgba(241,245,250,0.32)" : "rgba(11,16,32,0.28)";
  const securityOn = !highlight || highlight.includes("security");

  return (
    <svg
      viewBox={`0 0 ${cx * 2} ${height}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {[...layerOrder].reverse().map((id) => {
        const i = layerOrder.indexOf(id);
        const y = top + i * gap;
        const on = !highlight || highlight.includes(id);
        const color = layerColors[id];
        return (
          <g key={id} data-layer={id}>
            <polygon
              points={`${cx - W},${y} ${cx},${y + H} ${cx},${y + H + T} ${cx - W},${y + T}`}
              fill={on ? shade(color, -46) : "none"}
              stroke={on ? "none" : outline}
              strokeWidth={1}
            />
            <polygon
              points={`${cx + W},${y} ${cx},${y + H} ${cx},${y + H + T} ${cx + W},${y + T}`}
              fill={on ? shade(color, -86) : "none"}
              stroke={on ? "none" : outline}
              strokeWidth={1}
            />
            <polygon
              points={`${cx},${y - H} ${cx + W},${y} ${cx},${y + H} ${cx - W},${y}`}
              fill={on ? color : tone === "dark" ? "#0b1020" : "#f1f5fa"}
              stroke={on ? "none" : outline}
              strokeWidth={1}
            />
          </g>
        );
      })}
      {showSecurity && (
        <polygon
          data-layer="security"
          points={`${cx},${top - H - 18} ${cx + W + 20},${top} ${cx + W + 20},${top + total + T + 8} ${cx},${top + total + H + T + 18} ${cx - W - 20},${top + total + T + 8} ${cx - W - 20},${top}`}
          fill="none"
          stroke={securityOn ? layerColors.security : outline}
          strokeWidth={1.5}
          strokeDasharray="6 6"
        />
      )}
    </svg>
  );
}
