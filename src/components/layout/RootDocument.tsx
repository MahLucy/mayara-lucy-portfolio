import type { ReactNode } from "react";
import { plexMono, sora } from "@/lib/fonts";
import { htmlLang, type Locale } from "@/lib/i18n";
import { personJsonLd } from "@/lib/metadata";
import "@/styles/globals.css";

/**
 * Marks the document as motion-capable before first paint, so the space
 * reserved for pinned scenes is in place before hydration and never jumps.
 */
const motionBootstrap = `(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('can-motion')}}catch(e){}})();`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={htmlLang[locale]} className={`${sora.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body data-theme="light">
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
        />
        {children}
      </body>
    </html>
  );
}
