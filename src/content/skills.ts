import type { Localized } from "@/lib/i18n";

/**
 * pro   = used in professional deliveries (employment or freelance)
 * used  = used occasionally or in personal projects
 * study = courses and study only
 */
export type SkillLevel = "pro" | "used" | "study";

export type SkillGroup = {
  id: "frontend" | "backend" | "ai" | "cloud" | "data" | "devsecops";
  title: Localized;
  blurb: Localized;
  skills: { name: string; level: SkillLevel }[];
};

export const levelLabels: Record<SkillLevel, Localized> = {
  pro: { pt: "Uso profissional", en: "Professional use" },
  used: { pt: "Uso pontual", en: "Occasional use" },
  study: { pt: "Em estudo", en: "Studying" },
};

export const levelHelp: Localized = {
  pt: "Uso profissional: tecnologias que usei em entregas no trabalho ou em projetos para clientes. Uso pontual: em projetos próprios ou demandas específicas. Em estudo: cursos e estudos.",
  en: "Professional use: technologies I've used in work deliveries or client projects. Occasional use: personal projects or specific tasks. Studying: courses and self-study.",
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: { pt: "Frontend", en: "Frontend" },
    blurb: {
      pt: "Interfaces do design no Figma ao componente em produção.",
      en: "Interfaces from the Figma design to the production component.",
    },
    skills: [
      { name: "React", level: "pro" },
      { name: "TypeScript", level: "pro" },
      { name: "JavaScript", level: "pro" },
      { name: "HTML & CSS", level: "pro" },
      { name: "Chakra UI", level: "pro" },
      { name: "Figma", level: "pro" },
      { name: "UI/UX", level: "pro" },
      { name: "Next.js", level: "used" },
      { name: "Tailwind CSS", level: "used" },
      { name: "Carbon Design System", level: "used" },
      { name: "Bootstrap", level: "used" },
      { name: "WordPress", level: "used" },
      { name: "Angular", level: "study" },
    ],
  },
  {
    id: "backend",
    title: { pt: "Backend e APIs", en: "Backend and APIs" },
    blurb: {
      pt: "APIs REST e integrações entre sistemas corporativos.",
      en: "REST APIs and integrations between enterprise systems.",
    },
    skills: [
      { name: "Node.js", level: "pro" },
      { name: "NestJS", level: "pro" },
      { name: "Express.js", level: "pro" },
      { name: "AdonisJS", level: "pro" },
      { name: "PHP", level: "pro" },
      { name: "Laravel", level: "pro" },
      { name: "REST APIs", level: "pro" },
      { name: "Microsoft Graph API", level: "pro" },
      { name: "Python", level: "used" },
      { name: "FastAPI", level: "used" },
      { name: "Java", level: "study" },
    ],
  },
  {
    id: "ai",
    title: { pt: "Inteligência Artificial", en: "Artificial Intelligence" },
    blurb: {
      pt: "RAG, busca vetorial e LLMs aplicados a problemas reais.",
      en: "RAG, vector search, and LLMs applied to real problems.",
    },
    skills: [
      { name: "watsonx.ai", level: "pro" },
      { name: "RAG", level: "pro" },
      { name: "Vector search", level: "pro" },
      { name: "LLM integrations", level: "pro" },
      { name: "Watson Assistant", level: "pro" },
      { name: "Watson Discovery", level: "pro" },
      { name: "Watson Speech to Text", level: "pro" },
      { name: "Watson NLU", level: "pro" },
      { name: "OCR", level: "pro" },
      { name: "Watson Orchestrate", level: "pro" },
      { name: "AI agents", level: "used" },
      { name: "Claude Code", level: "used" },
      { name: "Prompt engineering", level: "used" },
      { name: "n8n", level: "used" },
    ],
  },
  {
    id: "cloud",
    title: { pt: "AWS e Cloud", en: "AWS and Cloud" },
    blurb: {
      pt: "Migração e execução de aplicações em contêineres gerenciados.",
      en: "Migrating and running applications on managed containers.",
    },
    skills: [
      { name: "AWS ECS/Fargate", level: "pro" },
      { name: "ECR", level: "pro" },
      { name: "ALB", level: "pro" },
      { name: "VPC", level: "pro" },
      { name: "RDS", level: "pro" },
      { name: "CloudFront", level: "pro" },
      { name: "Route 53", level: "pro" },
      { name: "ACM", level: "pro" },
      { name: "IBM Cloud", level: "pro" },
      { name: "Cloud Object Storage", level: "pro" },
      { name: "Azure", level: "study" },
      { name: "Google Cloud", level: "study" },
    ],
  },
  {
    id: "data",
    title: { pt: "Dados e bancos de dados", en: "Data and databases" },
    blurb: {
      pt: "Modelagem, consultas e integração entre bases diferentes.",
      en: "Modeling, querying, and integrating different databases.",
    },
    skills: [
      { name: "PostgreSQL", level: "pro" },
      { name: "Oracle", level: "pro" },
      { name: "MySQL", level: "pro" },
      { name: "MongoDB", level: "pro" },
      { name: "SQL", level: "pro" },
      { name: "Cognos Analytics", level: "pro" },
      { name: "Power BI", level: "used" },
      { name: "SQL Server", level: "used" },
    ],
  },
  {
    id: "devsecops",
    title: { pt: "DevOps e segurança", en: "DevOps and security" },
    blurb: {
      pt: "Pipelines, contêineres e análise de vulnerabilidades.",
      en: "Pipelines, containers, and vulnerability analysis.",
    },
    skills: [
      { name: "Docker", level: "pro" },
      { name: "Git", level: "pro" },
      { name: "GitLab CI/CD", level: "pro" },
      { name: "Semgrep", level: "pro" },
      { name: "KICS", level: "pro" },
      { name: "OWASP Dependency-Check", level: "pro" },
      { name: "Dependency Scanning", level: "pro" },
      { name: "Jira", level: "used" },
      { name: "Kubernetes", level: "used" },
    ],
  },
];

/**
 * Presentation of the groups above as five chapters in the horizontal stack.
 * Frontend and backend share the Full Stack chapter; nothing is added or removed.
 */
export type StackChapter = {
  id: "fullstack" | "ai" | "cloud" | "data" | "devsecops";
  title: Localized;
  groups: SkillGroup["id"][];
};

export const stackChapters: StackChapter[] = [
  {
    id: "fullstack",
    title: { pt: "Desenvolvimento Full Stack", en: "Full Stack Development" },
    groups: ["frontend", "backend"],
  },
  {
    id: "ai",
    title: { pt: "Inteligência Artificial & RAG", en: "Artificial Intelligence & RAG" },
    groups: ["ai"],
  },
  {
    id: "cloud",
    title: { pt: "AWS Cloud & Infraestrutura", en: "AWS Cloud & Infrastructure" },
    groups: ["cloud"],
  },
  {
    id: "data",
    title: { pt: "Bancos de Dados & Integração", en: "Databases & Data Integration" },
    groups: ["data"],
  },
  {
    id: "devsecops",
    title: { pt: "DevOps & Segurança de Aplicações", en: "DevOps & Application Security" },
    groups: ["devsecops"],
  },
];
