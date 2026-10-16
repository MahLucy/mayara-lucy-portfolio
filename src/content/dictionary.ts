import type { Locale } from "@/lib/i18n";

const pt = {
  meta: {
    title: "Mayara Lucy · Full Stack Developer, IA e AWS Cloud",
    description:
      "Portfólio de Mayara Lucy, desenvolvedora full stack em São Paulo. Aplicações web, IA com RAG e LLMs, migração para AWS e segurança de aplicações.",
  },
  skipLink: "Pular para o conteúdo",
  nav: {
    label: "Navegação principal",
    projects: "Projetos",
    architecture: "Arquitetura",
    stack: "Stack",
    about: "Sobre",
    timeline: "Trajetória",
    contact: "Contato",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    backToTop: "voltar ao início",
  },
  lang: {
    label: "Idioma",
    switchTo: "Read in English",
    short: "EN",
  },
  hero: {
    eyebrow: "Portfólio",
    ctaProjects: "Ver projetos",
    ctaStack: "Especialidades",
    ctaContact: "Entrar em contato",
    sceneLabel:
      "Ilustração de cinco camadas empilhadas: interface, APIs, dados, IA e cloud, envolvidas por uma linha de segurança.",
    scroll: "Role para explorar",
  },
  marquee: {
    label: "Áreas de atuação",
    items: ["Full Stack", "Inteligência Artificial", "AWS Cloud", "Engenharia de Software", "Segurança de Aplicações", "Automação", "Bancos de Dados"],
  },
  projects: {
    kicker: "Projetos",
    title: "Trabalho real, camada por camada",
    intro:
      "Uma seleção de projetos na IBM, na TecBan e como freelancer. Abra um projeto para ver o problema, o meu papel e a solução.",
    filterLabel: "Filtrar projetos por área",
    all: "Todos",
    count: (n: number) => (n === 1 ? "1 projeto" : `${n} projetos`),
    open: "Ver detalhes",
    visit: "Visitar site",
    close: "Fechar",
    problem: "Problema",
    role: "Meu papel",
    solution: "Solução",
    result: "Resultado",
    stack: "Tecnologias",
    flow: "Fluxo simplificado",
    org: { IBM: "IBM", TecBan: "TecBan", Freelance: "Freelance" },
    github: "Ver mais no GitHub",
    confidential: "Detalhes internos omitidos por confidencialidade.",
    illustrative: "Ilustração conceitual",
    highlights: "O que fiz",
    featured: "Destaque",
  },
  architecture: {
    kicker: "Arquitetura",
    title: "Como as camadas se conectam",
    intro:
      "Um fluxo conceitual de análise de documentos com IA, da interface à nuvem. Ele mostra o tipo de sistema que construo, não a arquitetura interna de uma empresa.",
    conceptual: "Diagrama conceitual",
  },
  stack: {
    kicker: "Especialidades",
    title: "Stack com contexto",
    intro: "As tecnologias estão agrupadas pela função no sistema e marcadas pelo tipo de uso, sem porcentagens inventadas.",
    legend: "Legenda dos níveis",
    hint: "Role para percorrer as especialidades",
    progress: "Progresso das especialidades",
  },
  about: {
    kicker: "Sobre",
    title: "Design e engenharia, desde o início",
    credentials: "Certificações e cursos",
    viewCredential: "Ver credencial",
    location: "Localização",
  },
  timeline: {
    kicker: "Trajetória",
    title: "Da comunicação visual à nuvem",
    present: "atual",
    work: "Experiência",
    education: "Formação",
  },
  contact: {
    kicker: "Contato",
    title: "Vamos construir a próxima camada?",
    intro:
      "Estou aberta a oportunidades em times de produto e engenharia, no Brasil ou remotas, e a projetos freelance de aplicações web, IA e cloud.",
    email: "Enviar e-mail",
    copy: "Copiar e-mail",
    copied: "E-mail copiado",
    copyFailed: "Não consegui copiar. O endereço é",
    linksLabel: "Links profissionais",
  },
  footer: {
    rights: "Feito com Next.js, GSAP e Three.js.",
    backToTop: "Voltar ao início",
  },
  external: "(abre em nova aba)",
  months: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  meta: {
    title: "Mayara Lucy · Full Stack Developer, AI and AWS Cloud",
    description:
      "Portfolio of Mayara Lucy, a full stack developer in São Paulo. Web applications, AI with RAG and LLMs, AWS migrations, and application security.",
  },
  skipLink: "Skip to content",
  nav: {
    label: "Main navigation",
    projects: "Projects",
    architecture: "Architecture",
    stack: "Stack",
    about: "About",
    timeline: "Journey",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToTop: "back to top",
  },
  lang: {
    label: "Language",
    switchTo: "Ler em português",
    short: "PT",
  },
  hero: {
    eyebrow: "Portfolio",
    ctaProjects: "See projects",
    ctaStack: "Expertise",
    ctaContact: "Get in touch",
    sceneLabel:
      "Illustration of five stacked layers: interface, APIs, data, AI, and cloud, wrapped by a security outline.",
    scroll: "Scroll to explore",
  },
  marquee: {
    label: "Areas of work",
    items: ["Full Stack", "Artificial Intelligence", "AWS Cloud", "Software Engineering", "Application Security", "Automation", "Databases"],
  },
  projects: {
    kicker: "Projects",
    title: "Real work, layer by layer",
    intro:
      "A selection of projects at IBM, at TecBan, and as a freelancer. Open a project to see the problem, my role, and the solution.",
    filterLabel: "Filter projects by area",
    all: "All",
    count: (n: number) => (n === 1 ? "1 project" : `${n} projects`),
    open: "View details",
    visit: "Visit site",
    close: "Close",
    problem: "Problem",
    role: "My role",
    solution: "Solution",
    result: "Outcome",
    stack: "Technologies",
    flow: "Simplified flow",
    org: { IBM: "IBM", TecBan: "TecBan", Freelance: "Freelance" },
    github: "More on GitHub",
    confidential: "Internal details omitted for confidentiality.",
    illustrative: "Conceptual illustration",
    highlights: "What I did",
    featured: "Featured",
  },
  architecture: {
    kicker: "Architecture",
    title: "How the layers connect",
    intro:
      "A conceptual AI document analysis flow, from interface to cloud. It shows the kind of system I build, not a company's internal architecture.",
    conceptual: "Conceptual diagram",
  },
  stack: {
    kicker: "Expertise",
    title: "A stack with context",
    intro: "Technologies are grouped by their role in the system and tagged by how I've used them, with no made-up percentages.",
    legend: "Level legend",
    hint: "Scroll through the areas of expertise",
    progress: "Expertise progress",
  },
  about: {
    kicker: "About",
    title: "Design and engineering, from the start",
    credentials: "Certifications and courses",
    viewCredential: "View credential",
    location: "Location",
  },
  timeline: {
    kicker: "Journey",
    title: "From visual communication to the cloud",
    present: "present",
    work: "Experience",
    education: "Education",
  },
  contact: {
    kicker: "Contact",
    title: "Shall we build the next layer?",
    intro:
      "I'm open to product and engineering roles, in Brazil or remote, and to freelance projects in web applications, AI, and cloud.",
    email: "Send an email",
    copy: "Copy email",
    copied: "Email copied",
    copyFailed: "Couldn't copy. The address is",
    linksLabel: "Professional links",
  },
  footer: {
    rights: "Built with Next.js, GSAP, and Three.js.",
    backToTop: "Back to top",
  },
  external: "(opens in a new tab)",
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
