import type { ReactNode } from "react";

type Props = {
  id: string;
  kicker: string;
  title: string;
  intro?: string;
  aside?: ReactNode;
};

/** Asymmetric section header: kicker + title on the left, intro offset to the right. */
export function SectionHeading({ id, kicker, title, intro, aside }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <p className="kicker">{kicker}</p>
        <h2 id={id} data-reveal-title className="section-title mt-5">
          {title}
        </h2>
      </div>
      {(intro || aside) && (
        <div className="reveal-view flex flex-col items-start gap-4 lg:col-span-4 lg:col-start-9">
          {intro && <p className="text-fg-muted">{intro}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}
