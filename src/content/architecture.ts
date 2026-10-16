import type { Localized } from "@/lib/i18n";

export type LayerId = "interface" | "api" | "data" | "ai" | "cloud";

export type Layer = {
  id: LayerId;
  index: string;
  title: Localized;
  body: Localized;
  tech: string[];
};

/**
 * Conceptual flow. Not a real employer architecture: it combines patterns from
 * public projects (document analysis with AI, AWS migrations).
 */
export const layers: Layer[] = [
  {
    id: "interface",
    index: "01",
    title: { pt: "Interface", en: "Interface" },
    body: {
      pt: "A pessoa envia um documento e acompanha o resultado. Tudo começa por uma interface clara.",
      en: "Someone uploads a document and follows the result. It all starts with a clear interface.",
    },
    tech: ["React", "TypeScript"],
  },
  {
    id: "api",
    index: "02",
    title: { pt: "Aplicação e APIs", en: "Application and APIs" },
    body: {
      pt: "Uma API recebe o arquivo, valida a requisição e orquestra as etapas seguintes.",
      en: "An API receives the file, validates the request, and orchestrates the next steps.",
    },
    tech: ["Node.js", "NestJS", "REST"],
  },
  {
    id: "data",
    index: "03",
    title: { pt: "Processamento e dados", en: "Processing and data" },
    body: {
      pt: "O OCR extrai o texto, e os dados estruturados vão para o banco.",
      en: "OCR extracts the text, and the structured data is stored in the database.",
    },
    tech: ["OCR", "PostgreSQL"],
  },
  {
    id: "ai",
    index: "04",
    title: { pt: "Serviços de IA", en: "AI services" },
    body: {
      pt: "Busca vetorial recupera o contexto certo, e um modelo de linguagem interpreta o conteúdo.",
      en: "Vector search retrieves the right context, and a language model interprets the content.",
    },
    tech: ["RAG", "watsonx.ai"],
  },
  {
    id: "cloud",
    index: "05",
    title: { pt: "Infraestrutura cloud", en: "Cloud infrastructure" },
    body: {
      pt: "Tudo roda em contêineres gerenciados, atrás de um balanceador, em uma rede isolada.",
      en: "Everything runs on managed containers, behind a load balancer, inside an isolated network.",
    },
    tech: ["ECS/Fargate", "ALB", "VPC"],
  },
];

export const securityLayer = {
  title: { pt: "Segurança em todas as camadas", en: "Security across every layer" } satisfies Localized,
  body: {
    pt: "Análise estática, verificação de dependências e de infraestrutura como código acompanham o pipeline do início ao fim.",
    en: "Static analysis plus dependency and infrastructure-as-code checks run alongside the pipeline from start to finish.",
  } satisfies Localized,
  tech: ["Semgrep", "KICS", "OWASP Dependency-Check"],
};
