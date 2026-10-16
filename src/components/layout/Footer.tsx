import { ArrowUp } from "lucide-react";
import { getDictionary } from "@/content/dictionary";
import { contactLinks, profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { sectionIds } from "@/lib/sections";
import { CurrentYear } from "./CurrentYear";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const links = contactLinks.filter((l) => l.id === "linkedin" || l.id === "github");

  return (
    <footer data-theme="dark" className="border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 text-sm text-fg-muted md:flex-row md:items-center md:justify-between">
        <p>
          © <CurrentYear /> {profile.name}. {dict.footer.rights}
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <li key={l.id}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                {l.label[locale]}
                <span className="sr-only"> {dict.external}</span>
              </a>
            </li>
          ))}
          <li>
            <a href={`#${sectionIds.top}`} className="inline-flex items-center gap-2 hover:text-fg">
              {dict.footer.backToTop}
              <ArrowUp aria-hidden className="size-4" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
