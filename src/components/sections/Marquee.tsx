import { getDictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";
import { layerColors } from "@/lib/layers";
import { MarqueeMotion } from "./MarqueeMotion";

// Accents that stay visible on the light band.
const dots = [layerColors.api, layerColors.security, "#0b1020", layerColors.data];

export function Marquee({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = dict.marquee.items;

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
          <span className="text-[clamp(1.5rem,1rem+2.4vw,2.75rem)] font-light tracking-[-0.02em] whitespace-nowrap uppercase">
            {item}
          </span>
          <span aria-hidden="true" className="size-2.5 rotate-45 rounded-[2px]" style={{ background: dots[i % dots.length] }} />
        </li>
      ))}
    </ul>
  );

  return (
    <div role="region" aria-label={dict.marquee.label} className="marquee overflow-hidden border-b border-line py-6 sm:py-8">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
      <MarqueeMotion />
    </div>
  );
}
