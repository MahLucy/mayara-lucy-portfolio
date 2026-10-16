import type { Localized } from "@/lib/i18n";

export type CategoryId = "web" | "ai" | "cloud" | "data" | "security";

export const categories: { id: CategoryId; label: Localized }[] = [
  { id: "web", label: { pt: "Full Stack & Web", en: "Full Stack & Web" } },
  { id: "ai", label: { pt: "IA, RAG & LLMs", en: "AI, RAG & LLMs" } },
  { id: "cloud", label: { pt: "AWS & Cloud", en: "AWS & Cloud" } },
  { id: "data", label: { pt: "Dados & Integrações", en: "Data & Integrations" } },
  { id: "security", label: { pt: "AppSec & DevSecOps", en: "AppSec & DevSecOps" } },
];

export type Project = {
  slug: string;
  title: Localized;
  org: "IBM" | "TecBan" | "Freelance";
  categories: CategoryId[];
  /** Larger tile in the gallery. */
  featured?: boolean;
  summary: Localized;
  problem: Localized;
  role: Localized;
  solution: Localized;
  result: Localized;
  stack: string[];
  /** Conceptual flow, only when it can be shown publicly. */
  flow?: Localized<string[]>;
  url?: string;
  preview?: { src: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    slug: "pdf-ocr-ia",
    title: { pt: "Análise de documentos PDF com OCR e IA", en: "PDF document analysis with OCR and AI" },
    org: "IBM",
    categories: ["ai", "web"],
    featured: true,
    summary: {
      pt: "Aplicação full stack que extrai e analisa informações de documentos PDF com OCR e serviços de IA da IBM.",
      en: "Full stack application that extracts and analyzes information from PDF documents using OCR and IBM AI services.",
    },
    problem: {
      pt: "Automatizar a extração e a análise de informações de documentos PDF.",
      en: "Automate the extraction and analysis of information from PDF documents.",
    },
    role: {
      pt: "Desenvolvi a aplicação full stack, do front-end em React à API em Node.js e à integração com OCR e IA.",
      en: "I built the full stack application, from the React front end to the Node.js API and the OCR and AI integration.",
    },
    solution: {
      pt: "Interface em React para envio dos documentos, API em Node.js que orquestra o OCR e o processamento, e integração com recursos de inteligência artificial da IBM para a análise do conteúdo.",
      en: "A React interface for uploading documents, a Node.js API that orchestrates OCR and processing, and an integration with IBM AI capabilities to analyze the content.",
    },
    result: {
      pt: "Fluxo automatizado de processamento e análise documental.",
      en: "An automated document processing and analysis flow.",
    },
    stack: ["React", "Node.js", "OCR", "IBM watsonx.ai", "REST APIs"],
    flow: {
      pt: ["Envio do PDF", "OCR e extração", "Análise com IA", "Resultado na interface"],
      en: ["PDF upload", "OCR and extraction", "AI analysis", "Result in the interface"],
    },
  },
  {
    slug: "rag-busca-semantica",
    title: { pt: "RAG e busca semântica", en: "RAG and semantic search" },
    org: "IBM",
    categories: ["ai"],
    featured: true,
    summary: {
      pt: "Recuperação de contexto em bases de conhecimento para respostas de IA mais relevantes.",
      en: "Context retrieval over knowledge bases for more relevant AI answers.",
    },
    problem: {
      pt: "Facilitar a recuperação de informações relevantes em bases de conhecimento para melhorar as respostas geradas por IA.",
      en: "Make it easier to retrieve relevant information from knowledge bases to improve AI-generated answers.",
    },
    role: {
      pt: "Trabalhei na integração entre mecanismos de recuperação (RAG), busca vetorial e modelos de linguagem.",
      en: "I worked on integrating retrieval (RAG), vector search, and language models.",
    },
    solution: {
      pt: "Arquitetura que busca trechos relevantes com Watson Discovery e busca vetorial e os entrega como contexto para modelos do watsonx.ai.",
      en: "An architecture that retrieves relevant passages with Watson Discovery and vector search and passes them as context to watsonx.ai models.",
    },
    result: {
      pt: "Arquitetura de recuperação de contexto que apoia respostas mais relevantes e contextualizadas.",
      en: "A context retrieval architecture that supports more relevant, grounded answers.",
    },
    stack: ["watsonx.ai", "Watson Discovery", "RAG", "Vector search", "LLMs"],
    flow: {
      pt: ["Pergunta", "Busca vetorial", "Contexto recuperado", "Resposta do LLM"],
      en: ["Question", "Vector search", "Retrieved context", "LLM answer"],
    },
  },
  {
    slug: "portal-seguranca-aws",
    title: { pt: "Portal de Segurança: migração para AWS", en: "Security Portal: AWS migration" },
    org: "TecBan",
    categories: ["cloud", "web"],
    featured: true,
    summary: {
      pt: "Manutenção, evolução e migração de uma aplicação Laravel interna para uma arquitetura em AWS Fargate.",
      en: "Maintenance, evolution, and migration of an internal Laravel application to an AWS Fargate architecture.",
    },
    problem: {
      pt: "Modernizar a infraestrutura de uma aplicação interna de gestão de informações e processos da área de Segurança Física.",
      en: "Modernize the infrastructure of an internal application that manages information and processes for the Physical Security area.",
    },
    role: {
      pt: "Atuo na manutenção e evolução da aplicação em Laravel/PHP e participei da migração para AWS Fargate.",
      en: "I maintain and evolve the Laravel/PHP application and took part in its migration to AWS Fargate.",
    },
    solution: {
      pt: "Aplicação Laravel containerizada e executada em contêineres gerenciados com AWS Fargate.",
      en: "A containerized Laravel application running on managed containers with AWS Fargate.",
    },
    result: {
      pt: "Evolução da infraestrutura e execução da aplicação adequada ao ambiente de cloud.",
      en: "Evolved infrastructure, with the application running in a cloud environment.",
    },
    stack: ["Laravel", "PHP", "Docker", "AWS ECS/Fargate"],
  },
  {
    slug: "appsec-vulnerabilidades",
    title: { pt: "Segurança de aplicações e vulnerabilidades", en: "Application security and vulnerabilities" },
    org: "TecBan",
    categories: ["security"],
    summary: {
      pt: "Análise estática, verificação de dependências e correção de vulnerabilidades no ciclo de desenvolvimento.",
      en: "Static analysis, dependency checks, and vulnerability remediation throughout the development lifecycle.",
    },
    problem: {
      pt: "Identificar vulnerabilidades e melhorar a segurança das aplicações durante o ciclo de desenvolvimento.",
      en: "Identify vulnerabilities and improve application security during the development lifecycle.",
    },
    role: {
      pt: "Executo análises de segurança e atuo na investigação e correção das vulnerabilidades encontradas.",
      en: "I run security analyses and investigate and fix the vulnerabilities found.",
    },
    solution: {
      pt: "Análise estática de código, de infraestrutura como código e de dependências com Semgrep, KICS, OWASP Dependency-Check e Dependency Scanning.",
      en: "Static analysis of code, infrastructure as code, and dependencies with Semgrep, KICS, OWASP Dependency-Check, and Dependency Scanning.",
    },
    result: {
      pt: "Vulnerabilidades identificadas e tratadas, com melhorias na postura de segurança e nos processos de análise estática.",
      en: "Vulnerabilities identified and handled, with improvements to security posture and static analysis processes.",
    },
    stack: ["Semgrep", "KICS", "OWASP Dependency-Check", "Dependency Scanning", "CI/CD"],
  },
  {
    slug: "integracao-dados",
    title: { pt: "Processamento e integração de dados", en: "Data processing and integration" },
    org: "TecBan",
    categories: ["data", "cloud"],
    summary: {
      pt: "Aplicações NestJS que integram bases PostgreSQL e Oracle entre ambientes cloud e on-premises.",
      en: "NestJS applications integrating PostgreSQL and Oracle databases across cloud and on-premises environments.",
    },
    problem: {
      pt: "Processar informações de diferentes bases de dados e integrar sistemas com necessidades operacionais distintas.",
      en: "Process information from different databases and integrate systems with different operational needs.",
    },
    role: {
      pt: "Desenvolvi aplicações Node.js/NestJS, integrações com bancos e a modernização do envio de e-mails com Microsoft Graph API.",
      en: "I built Node.js/NestJS applications, database integrations, and modernized email delivery with the Microsoft Graph API.",
    },
    solution: {
      pt: "Serviços em NestJS conectados a PostgreSQL e Oracle, com comunicação entre cloud e on-premises e envio de e-mails migrado para o Microsoft Graph.",
      en: "NestJS services connected to PostgreSQL and Oracle, with cloud to on-premises communication and email delivery moved to Microsoft Graph.",
    },
    result: {
      pt: "Integrações entre sistemas evoluídas e componentes das aplicações modernizados.",
      en: "Improved integrations between systems and modernized application components.",
    },
    stack: ["Node.js", "NestJS", "PostgreSQL", "Oracle", "Microsoft Graph API"],
  },
  {
    slug: "portal-indicadores-aws",
    title: { pt: "Portal de Indicadores: migração para AWS", en: "Indicators Portal: AWS migration" },
    org: "TecBan",
    categories: ["cloud"],
    summary: {
      pt: "Migração de uma aplicação de indicadores para infraestrutura em nuvem.",
      en: "Migration of an indicators application to cloud infrastructure.",
    },
    problem: {
      pt: "Migrar uma aplicação de indicadores para uma infraestrutura em nuvem.",
      en: "Migrate an indicators application to cloud infrastructure.",
    },
    role: {
      pt: "Atuei nas atividades técnicas da migração, considerando os componentes de infraestrutura necessários para a execução.",
      en: "I handled the technical migration work, covering the infrastructure components the application needs to run.",
    },
    solution: {
      pt: "Planejamento e execução da mudança da aplicação para um ambiente baseado em AWS.",
      en: "Planning and carrying out the application's move to an AWS-based environment.",
    },
    result: {
      pt: "Aplicação migrada para um ambiente baseado em AWS.",
      en: "Application migrated to an AWS-based environment.",
    },
    stack: ["AWS"],
  },
  {
    slug: "spotcases",
    title: { pt: "SpotCases", en: "SpotCases" },
    org: "IBM",
    categories: ["web", "ai"],
    summary: {
      pt: "Biblioteca digital de cases, conteúdos e áudios, integrada a serviços Watson.",
      en: "A digital library of cases, content, and audio files, integrated with Watson services.",
    },
    problem: {
      pt: "Organizar e facilitar o acesso a cases, conteúdos e arquivos de áudio em uma biblioteca digital.",
      en: "Organize and simplify access to cases, content, and audio files in a digital library.",
    },
    role: {
      pt: "Desenvolvi funcionalidades de interface em React e trabalhei nas integrações com serviços IBM.",
      en: "I built interface features in React and worked on the IBM service integrations.",
    },
    solution: {
      pt: "Interface de consulta conectada a Speech to Text, Watson Assistant, Natural Language Understanding, Cloud Object Storage e Cognos Analytics.",
      en: "A search interface connected to Speech to Text, Watson Assistant, Natural Language Understanding, Cloud Object Storage, and Cognos Analytics.",
    },
    result: {
      pt: "Interface para consulta de conteúdos e visualização das informações associadas aos arquivos.",
      en: "An interface to search content and view the information linked to each file.",
    },
    stack: ["React", "Watson Speech to Text", "Watson Assistant", "Watson NLU", "Cloud Object Storage", "Cognos Analytics"],
  },
  {
    slug: "assistant-curator",
    title: { pt: "Assistant Curator", en: "Assistant Curator" },
    org: "IBM",
    categories: ["ai", "web"],
    summary: {
      pt: "Curadoria e acompanhamento de assistentes virtuais no ecossistema IBM.",
      en: "Curation and monitoring of virtual assistants in the IBM ecosystem.",
    },
    problem: {
      pt: "Facilitar a curadoria e o acompanhamento de assistentes virtuais e das suas informações.",
      en: "Make it easier to curate and monitor virtual assistants and their information.",
    },
    role: {
      pt: "Trabalhei em funcionalidades da solução integrada ao ecossistema IBM.",
      en: "I worked on features of the solution integrated with the IBM ecosystem.",
    },
    solution: {
      pt: "Recursos de gestão e visualização com Watson Assistant, Speech to Text, Cognos Analytics e serviços de cloud.",
      en: "Management and visualization features built with Watson Assistant, Speech to Text, Cognos Analytics, and cloud services.",
    },
    result: {
      pt: "Recursos para apoiar a gestão e a visualização das informações dos assistentes.",
      en: "Features that support managing and visualizing assistant information.",
    },
    stack: ["Watson Assistant", "Watson Speech to Text", "Cognos Analytics", "IBM Cloud"],
  },
  {
    slug: "poc-ia-generativa",
    title: { pt: "Provas de conceito de IA generativa", en: "Generative AI proofs of concept" },
    org: "IBM",
    categories: ["ai"],
    summary: {
      pt: "Protótipos de análise documental, processamento de currículos e automação com IA.",
      en: "Prototypes for document analysis, résumé processing, and AI-driven automation.",
    },
    problem: {
      pt: "Explorar formas de automatizar atividades que exigem análise de documentos, interpretação de informações e execução de tarefas.",
      en: "Explore ways to automate work that requires analyzing documents, interpreting information, and carrying out tasks.",
    },
    role: {
      pt: "Participei do desenvolvimento das provas de conceito, junto com as sessões de Design Thinking para mapear as dores dos clientes.",
      en: "I helped build the proofs of concept, alongside Design Thinking sessions to map client pain points.",
    },
    solution: {
      pt: "Protótipos com watsonx.ai, Watson Discovery, Watson Assistant e Watson Orchestrate.",
      en: "Prototypes built with watsonx.ai, Watson Discovery, Watson Assistant, and Watson Orchestrate.",
    },
    result: {
      pt: "Validação de aplicações de IA generativa, busca de informações e automação de processos.",
      en: "Validated use cases for generative AI, information retrieval, and process automation.",
    },
    stack: ["watsonx.ai", "Watson Discovery", "Watson Assistant", "Watson Orchestrate"],
  },
  {
    slug: "day-spa-hochheim",
    title: { pt: "Day Spa Hochheim", en: "Day Spa Hochheim" },
    org: "Freelance",
    categories: ["web"],
    featured: true,
    summary: {
      pt: "Plataforma de agendamento e e-commerce para um day spa.",
      en: "Booking and e-commerce platform for a day spa.",
    },
    problem: {
      pt: "Oferecer agendamento e venda on-line para os serviços do spa.",
      en: "Offer online booking and sales for the spa's services.",
    },
    role: {
      pt: "Projeto individual: design no Figma, front-end e back-end.",
      en: "Solo project: Figma design, front end, and back end.",
    },
    solution: {
      pt: "Front-end em React com Vite e Tailwind CSS e back-end em PHP com MySQL.",
      en: "A React front end with Vite and Tailwind CSS, and a PHP back end with MySQL.",
    },
    result: {
      pt: "Site publicado e em uso.",
      en: "Site live and in use.",
    },
    stack: ["Figma", "React", "Vite", "Tailwind CSS", "PHP", "MySQL"],
    url: "https://spahochheim.com.br/",
  },
  {
    slug: "clinica-hochheim",
    title: { pt: "Clínica Hochheim", en: "Clínica Hochheim" },
    org: "Freelance",
    categories: ["web"],
    summary: {
      pt: "Site de uma clínica de fisioterapia e reabilitação, com serviços, orientações e contato.",
      en: "Website for a physiotherapy and rehabilitation clinic, with services, visitor guidance, and contact.",
    },
    problem: {
      pt: "Apresentar os serviços da clínica e facilitar o agendamento e o contato.",
      en: "Present the clinic's services and make booking and contact easier.",
    },
    role: {
      pt: "Projeto individual: design no Figma, front-end e back-end.",
      en: "Solo project: Figma design, front end, and back end.",
    },
    solution: {
      pt: "Site em React com páginas de serviços, orientações ao paciente, formulário de contato e agendamento via WhatsApp.",
      en: "A React site with service pages, patient guidance, a contact form, and WhatsApp booking.",
    },
    result: { pt: "Site publicado e em uso.", en: "Site live and in use." },
    stack: ["Figma", "React", "Node.js", "Chakra UI"],
    url: "https://www.clinicahochheim.com.br/",
    preview: { src: "/images/projects/clinica-hochheim.webp", width: 1280, height: 800 },
  },
  {
    slug: "hochheim-kids",
    title: { pt: "Hochheim Kids", en: "Hochheim Kids" },
    org: "Freelance",
    categories: ["web"],
    summary: {
      pt: "Site de uma escola de natação infantil, com estrutura, depoimentos e agendamento de aula experimental.",
      en: "Website for a children's swim school, with facilities, testimonials, and trial class booking.",
    },
    problem: {
      pt: "Apresentar a escola às famílias e facilitar o agendamento de aulas.",
      en: "Introduce the school to families and make booking classes easier.",
    },
    role: {
      pt: "Projeto individual: design no Figma, front-end e back-end.",
      en: "Solo project: Figma design, front end, and back end.",
    },
    solution: {
      pt: "Site em React com galeria da estrutura, formulário de contato e agendamento via WhatsApp.",
      en: "A React site with a facilities gallery, a contact form, and WhatsApp booking.",
    },
    result: { pt: "Site publicado e em uso.", en: "Site live and in use." },
    stack: ["Figma", "React", "Node.js", "Chakra UI"],
    url: "https://hochheimkids.com.br/",
    preview: { src: "/images/projects/hochheim-kids.webp", width: 1280, height: 800 },
  },
  {
    slug: "grupo-selecionar",
    title: { pt: "Grupo Selecionar", en: "Grupo Selecionar" },
    org: "Freelance",
    categories: ["web"],
    summary: {
      pt: "Site institucional de um grupo de terceirização, com serviços, cases e contato.",
      en: "Corporate website for an outsourcing group, with services, case studies, and contact.",
    },
    problem: {
      pt: "Apresentar o ecossistema de serviços da empresa e gerar contatos comerciais.",
      en: "Present the company's range of services and generate sales leads.",
    },
    role: {
      pt: "Projeto individual: design no Figma, front-end e back-end.",
      en: "Solo project: Figma design, front end, and back end.",
    },
    solution: {
      pt: "Site em React com páginas de serviços, cases, integração com portal de carreiras e formulário de contato.",
      en: "A React site with service pages, case studies, a link to the careers portal, and a contact form.",
    },
    result: { pt: "Site publicado e em uso.", en: "Site live and in use." },
    stack: ["Figma", "React", "Node.js", "Chakra UI"],
    url: "https://gruposelecionar.com.br/",
    preview: { src: "/images/projects/grupo-selecionar.webp", width: 1280, height: 800 },
  },
  {
    slug: "mendi",
    title: { pt: "Mendi", en: "Mendi" },
    org: "Freelance",
    categories: ["web"],
    summary: {
      pt: "Site de uma empresa de saúde emocional corporativa, com soluções, blog e contato comercial.",
      en: "Website for a corporate emotional health company, with solutions, a blog, and sales contact.",
    },
    problem: {
      pt: "Apresentar as soluções para empresas e converter visitantes em contatos comerciais.",
      en: "Present the company's solutions and turn visitors into sales leads.",
    },
    role: {
      pt: "Projeto individual: design no Figma, front-end e back-end.",
      en: "Solo project: Figma design, front end, and back end.",
    },
    solution: {
      pt: "Site em React com páginas de soluções, blog, formulário de contato e atendimento via WhatsApp.",
      en: "A React site with solution pages, a blog, a contact form, and WhatsApp support.",
    },
    result: { pt: "Site publicado e em uso.", en: "Site live and in use." },
    stack: ["Figma", "React", "Node.js", "Chakra UI"],
    url: "https://mendihub.com/",
    preview: { src: "/images/projects/mendi.webp", width: 1280, height: 800 },
  },
];
