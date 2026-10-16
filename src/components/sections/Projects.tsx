import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { getDictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";
import { sectionIds } from "@/lib/sections";
import { Marquee } from "./Marquee";
import { SectionHeading } from "./SectionHeading";

export function Projects({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section id={sectionIds.projects} data-theme="light" data-wipe aria-labelledby="projects-title" className="relative pb-24 lg:pb-32">
      <Marquee locale={locale} />
      <div className="container-x pt-20 lg:pt-28">
        <SectionHeading id="projects-title" kicker={dict.projects.kicker} title={dict.projects.title} intro={dict.projects.intro} />
        <div className="mt-14">
          <ProjectsGallery locale={locale} />
        </div>
      </div>
    </section>
  );
}
