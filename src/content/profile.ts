import type { Localized } from "@/lib/i18n";

export type ContactLink = {
  id: "email" | "linkedin" | "github" | "cv";
  label: Localized;
  href: string;
  /** Text shown next to the label, e.g. the handle. */
  display: string;
  external: boolean;
};

export const profile = {
  name: "Mayara Lucy",
  initials: "ML",
  role: "Full Stack Developer · AI · AWS Cloud · AppSec",
  location: { pt: "São Paulo, Brasil", en: "São Paulo, Brazil" } satisfies Localized,
  email: "mayara-lucy@live.com",
  headline: {
    pt: "Construo aplicações completas, da interface à nuvem, com inteligência artificial onde ela gera valor e segurança em cada camada.",
    en: "I build complete applications, from interface to cloud, with AI where it adds value and security at every layer.",
  } satisfies Localized,
  bio: {
    pt: [
      "Sou desenvolvedora full stack em São Paulo. Comecei pela comunicação visual, no curso técnico do SENAI, e cheguei à engenharia de software pela Ciência da Computação. Essa combinação ainda orienta meu trabalho: entender o problema, desenhar a experiência e construir o sistema que a sustenta.",
      "Na IBM Innovation Studio, criei protótipos e assets de IA com RAG, modelos de linguagem e busca vetorial, além de conduzir sessões de Design Thinking com clientes. Hoje, na TecBan, como Analista de Soluções de Segurança, desenvolvo aplicações full stack, conduzo a migração de sistemas para a AWS e trato vulnerabilidades ao longo do ciclo de desenvolvimento.",
      "Como freelancer, desenvolvo sites e plataformas de ponta a ponta: do design no Figma ao front-end e ao back-end.",
    ],
    en: [
      "I'm a full stack developer based in São Paulo. I started in visual communication, through a technical course at SENAI, and moved into software engineering through a Computer Science degree. That mix still shapes how I work: understand the problem, design the experience, and build the system behind it.",
      "At IBM Innovation Studio, I built AI prototypes and assets with RAG, language models, and vector search, and ran Design Thinking sessions with clients. Today, at TecBan, as a Security Solutions Analyst, I build full stack applications, lead the migration of systems to AWS, and handle vulnerabilities throughout the development lifecycle.",
      "As a freelancer, I build websites and platforms end to end: from the Figma design to the front end and back end.",
    ],
  } satisfies Localized<string[]>,
  photo: {
    src: "/images/mayara-lucy.webp",
    width: 900,
    height: 900,
    alt: {
      pt: "Retrato de Mayara Lucy, sorrindo, com cabelo cacheado",
      en: "Portrait of Mayara Lucy smiling, with curly hair",
    } satisfies Localized,
  },
};

export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: { pt: "E-mail", en: "Email" },
    href: `mailto:${profile.email}`,
    display: profile.email,
    external: false,
  },
  {
    id: "linkedin",
    label: { pt: "LinkedIn", en: "LinkedIn" },
    href: "https://www.linkedin.com/in/mayaralucy/",
    display: "in/mayaralucy",
    external: true,
  },
  {
    id: "github",
    label: { pt: "GitHub", en: "GitHub" },
    href: "https://github.com/MahLucy",
    display: "MahLucy",
    external: true,
  },
  {
    id: "cv",
    label: { pt: "Currículo (PDF)", en: "Résumé (PDF, Portuguese)" },
    href: "/cv/mayara-lucy-cv.pdf",
    display: "PDF",
    external: false,
  },
];
