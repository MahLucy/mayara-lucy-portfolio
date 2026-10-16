import Image from "next/image";
import { StackGlyph } from "@/components/3d/StackGlyph";
import type { Project } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { categoryColor, categoryLayers } from "@/lib/layers";

type Props = {
  project: Project;
  locale: Locale;
  index: number;
  sizes: string;
  illustrativeLabel: string;
  /** Larger glyph and flow for the dialog header and featured tiles. */
  large?: boolean;
};

/**
 * Project cover. Real screenshots when the project is public; otherwise an
 * abstract cover built from the project's own layers (and its simplified flow,
 * when the project has one), labeled as a conceptual illustration.
 */
export function ProjectCover({ project, locale, index, sizes, illustrativeLabel, large }: Props) {
  const primary = project.categories[0] ?? "web";
  const color = categoryColor[primary];

  return (
    <div data-cover className="relative h-full w-full overflow-hidden bg-ink">
      <div data-cover-media className="absolute inset-0 will-change-transform">
        {project.preview ? (
          <Image
            src={project.preview.src}
            alt=""
            width={project.preview.width}
            height={project.preview.height}
            sizes={sizes}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(110% 90% at 80% 20%, ${color}38, #0b1020 62%)` }}>
            <StackGlyph
              highlight={project.categories.flatMap((c) => categoryLayers[c])}
              gap={large ? 34 : 28}
              className="absolute top-1/2 right-[6%] h-[86%] w-auto -translate-y-1/2"
            />
          </div>
        )}
      </div>

      {/* Text sits outside the zooming media layer, so it is never cropped by the scroll zoom. */}
      {!project.preview && project.flow && (
        <ol aria-hidden="true" className="absolute bottom-5 left-5 flex max-w-[55%] flex-col gap-1.5">
          {project.flow[locale].map((step, i) => (
            <li key={step} className="mono flex items-center gap-2 text-[0.68rem] tracking-wide text-[#c9d2e8] uppercase">
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: i === project.flow![locale].length - 1 ? "#d8ff68" : color }} />
              {step}
            </li>
          ))}
        </ol>
      )}

      <span
        aria-hidden="true"
        className="mono pointer-events-none absolute top-4 left-5 text-[0.7rem] tracking-[0.18em] text-[#f1f5fa] mix-blend-difference"
      >
        P—{String(index + 1).padStart(2, "0")}
      </span>
      <span aria-hidden="true" data-cover-bar className="absolute top-5 right-5 h-1 w-10 origin-right rounded-full" style={{ background: color }} />
      {!project.preview && (
        <span className="mono absolute right-5 bottom-4 text-[0.62rem] tracking-[0.14em] text-[#a9b3cc] uppercase">
          {illustrativeLabel}
        </span>
      )}
    </div>
  );
}
