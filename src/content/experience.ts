import type { Localized } from "@/lib/i18n";

export type TimelineEntry = {
  id: string;
  kind: "work" | "education";
  title: Localized;
  org: string;
  /** ISO-like "YYYY" or "YYYY-MM". `end: null` means current. */
  start: string;
  end: string | null;
  description: Localized;
};

/** Kept in chronological order; the timeline renders it as-is. */
export const timeline: TimelineEntry[] = [
  {
    id: "senai",
    kind: "education",
    title: { pt: "Técnico em Comunicação Visual", en: "Technical degree in Visual Communication" },
    org: "SENAI Theobaldo de Nigris",
    start: "2019",
    end: "2020",
    description: {
      pt: "Base em design, composição e comunicação visual.",
      en: "Foundation in design, composition, and visual communication.",
    },
  },
  {
    id: "unicsul",
    kind: "education",
    title: { pt: "Bacharelado em Ciência da Computação", en: "B.Sc. in Computer Science" },
    org: "Universidade Cruzeiro do Sul",
    start: "2021",
    end: "2024",
    description: {
      pt: "Formação em engenharia de software, algoritmos, bancos de dados e sistemas.",
      en: "Training in software engineering, algorithms, databases, and systems.",
    },
  },
  {
    id: "visual-software",
    kind: "work",
    title: { pt: "Estagiária de TI", en: "IT Intern" },
    org: "Visual Software",
    start: "2022",
    end: "2023",
    description: {
      pt: "Atendimento de chamados de clientes no Zendesk, controle de documentação de fornecedores e testes de sistema.",
      en: "Customer ticket support in Zendesk, vendor documentation control, and system testing.",
    },
  },
  {
    id: "ibm",
    kind: "work",
    title: { pt: "Full Stack Developer Intern · Innovation Studio", en: "Full Stack Developer Intern · Innovation Studio" },
    org: "IBM",
    start: "2023-09",
    end: "2025-03",
    description: {
      pt: "Protótipos e assets de IA com RAG, LLMs e busca vetorial, integrando serviços Watson a front-ends em React e APIs em Node.js. Sessões de Design Thinking com clientes.",
      en: "AI prototypes and assets with RAG, LLMs, and vector search, connecting Watson services to React front ends and Node.js APIs. Design Thinking sessions with clients.",
    },
  },
  {
    id: "tecban",
    kind: "work",
    title: { pt: "Analista de Soluções de Segurança", en: "Security Solutions Analyst" },
    org: "TecBan",
    start: "2025-03",
    end: null,
    description: {
      pt: "Desenvolvimento full stack, migração de sistemas para a AWS e análise e correção de vulnerabilidades em aplicações do setor financeiro.",
      en: "Full stack development, migration of systems to AWS, and vulnerability analysis and remediation for financial sector applications.",
    },
  },
];

export type Credential = {
  name: string;
  issuer: string;
  year?: string;
  url?: string;
};

export const credentials: Credential[] = [
  {
    name: "IBM watsonx.ai Technical Essentials",
    issuer: "IBM · Credly",
    url: "https://www.credly.com/badges/5fb0fcf5-d834-4092-bcf0-15183ff1f89b",
  },
  {
    name: "Enterprise Design Thinking Practitioner",
    issuer: "IBM · Credly",
    url: "https://www.credly.com/badges/60d0480f-9073-4bc3-96b4-b4f008a8b0a9",
  },
  {
    name: "Docker Essentials: A Developer Introduction",
    issuer: "Cognitive Class · IBM",
    year: "2024",
    url: "https://courses.cognitiveclass.ai/certificates/dc303230593b4f978a67eb1d230d28a8",
  },
  {
    name: "Introdução à IA moderna",
    issuer: "Cisco Networking Academy",
  },
];
