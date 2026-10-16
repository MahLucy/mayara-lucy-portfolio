import { ChromaDirector } from "@/components/animations/ChromaDirector";
import { MotionDirector } from "@/components/animations/MotionDirector";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Architecture } from "@/components/sections/Architecture";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { getDictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      <a
        href="#content"
        className="sr-only-focusable fixed top-3 left-3 z-[70] rounded-full bg-lime px-4 py-3 text-sm font-medium text-ink"
      >
        {dict.skipLink}
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <Header locale={locale} />
      <main id="content" tabIndex={-1} className="outline-none">
        <Hero locale={locale} />
        <Projects locale={locale} />
        <Architecture locale={locale} />
        <Stack locale={locale} />
        <About locale={locale} />
        <Timeline locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
      <MotionDirector />
      <ChromaDirector />
    </>
  );
}
