# Mayara Lucy — Portfólio

Portfólio pessoal bilíngue (PT-BR em `/`, EN em `/en`) de Mayara Lucy, desenvolvedora Full Stack com foco em IA aplicada, AWS e segurança de aplicações.

Direção criativa **"Camadas"**: o stack é contado como camadas, e cada cor representa uma delas.

| Cor | Camada |
| --- | --- |
| Soft Ice | Interface |
| Electric Blue | APIs |
| Azul suave | Dados |
| Digital Cyan | IA |
| Acid Lime | Cloud |
| Coral | Segurança (envolve todas as outras) |

O hero tem um monólito 3D que se separa em vista explodida durante o scroll. A seção de arquitetura reaproveita essa linguagem.

## Stack

- **Next.js 16** (App Router, páginas 100% estáticas) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4**, com tokens próprios em `src/styles/tokens.css`
- **GSAP 3** + ScrollTrigger, SplitText e Flip (Flip carrega só no primeiro uso), com `@gsap/react`. Não usei biblioteca de smooth scroll: o `scrub` numérico já suaviza, e o scroll nativo é preservado
- **Three.js** + **React Three Fiber** + **Drei**: a cena 3D carrega sob demanda, na primeira interação
- CSS scroll-driven animations (`animation-timeline`), com `@supports`
- Lucide (ícones) · Sora + IBM Plex Mono via `next/font`
- **Playwright** + **axe-core** para os testes

## Executar localmente

Requer Node.js 20.9 ou superior.

```bash
npm install
npx playwright install chromium   # só para rodar os testes
npm run dev                       # http://localhost:3000
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run lint` | ESLint (regras Next.js + TypeScript) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm test` | Playwright em desktop (1440px) e mobile (375px). Sobe o build de produção na porta 3100, então rode `npm run build` antes |
| `npm run check` | lint + typecheck + build |
| `npm run previews` | Recaptura os screenshots dos sites freelance |
| `node scripts/generate-og.mjs` | Regenera a imagem Open Graph |

## Onde editar o conteúdo

Todo o conteúdo fica em `src/content/`. Os componentes não guardam texto.

| Arquivo | Conteúdo |
| --- | --- |
| `profile.ts` | Nome, título, headline, bio, foto, contatos e currículo |
| `projects.ts` | Projetos e categorias (filtros), com problema, papel, solução, resultado, stack e links |
| `experience.ts` | Timeline (experiência e formação) e certificações |
| `skills.ts` | Grupos de tecnologias e nível de uso (`pro` / `used` / `study`) |
| `architecture.ts` | Camadas do diagrama conceitual |
| `dictionary.ts` | Textos da interface e metadados de SEO, em PT e EN |

Cada texto público tem as versões `pt` e `en`, e o TypeScript acusa erro se alguma faltar.

**Para adicionar um projeto:** inclua um objeto em `projects`. Para usar um screenshot, salve um `.webp` de 1280×800 em `public/images/projects/` e preencha o campo `preview`. Sem `preview`, o card mostra a ilustração de camadas com a cor da categoria.

## Estrutura

```
src/
  app/
    (pt)/              layout + página PT-BR (raiz "/")
    (en)/en/           layout + página EN ("/en")
    global-not-found   404 compartilhado
    sitemap.ts · robots.ts · icon.svg
  components/
    layout/            Header, LangSwitch, Footer, RootDocument
    sections/          Hero, Marquee, Projects, Architecture, Stack, About, Timeline, Contact
    projects/          ProjectsGallery (filtros + Flip), ProjectCard, ProjectDialog (<dialog> nativo)
    3d/                StrataScene (R3F), HeroVisual (carregamento + fallback), StackGlyph (SVG estático)
    animations/        MotionDirector (revelação de títulos)
  content/             dados do portfólio
  lib/                 i18n, gsap, metadata/SEO, cores das camadas
  styles/              tokens e estilos globais
tests/                 Playwright
scripts/               captura de screenshots e imagem OG
```

## Coreografia de scroll

O scroll é dividido em capítulos, e cada capítulo tem uma cor da camada que representa:

| Capítulo | Tema | Cena |
| --- | --- | --- |
| Hero | Deep Space | **Abertura fixada** (`pin` + `scrub`): o monólito começa grande e explodido e converge para a composição final. O texto restante se revela no caminho. Reversível |
| Projetos | Soft Ice | Grid editorial assimétrico. Capa revelada por máscara (`clip-path` com scrub), imagem com parallax, texto em sequência, foco no card central e tilt 3D no hover |
| Arquitetura | Deep Space | Cena fixada: as camadas acendem uma a uma, as conexões se desenham, um "pacote" percorre a espinha e a luz assume a cor da camada em foco |
| Stack | Electric Blue | **Sequência horizontal fixada**: 5 cards, cada um com diagrama próprio que se constrói no scroll (`containerAnimation`). No mobile vira uma lista vertical |
| Sobre | Acid Lime | A bio ganha contraste palavra por palavra, e a foto é revelada por recorte |
| Trajetória | Soft Ice | Trilho que se preenche e marcos que acendem |
| Contato | Deep Space | Anéis com parallax em velocidades diferentes |

**Transição entre capítulos.** Cada capítulo entra por um losango isométrico (a face de uma camada) que se abre a partir da borda superior, precedido por um contorno (`src/components/animations/ChromaDirector.tsx`). Não há mistura de cores: o texto fica sempre sobre o fundo sólido do próprio capítulo.

**Fonte única de movimento.**
- No hero, o GSAP anima um elemento "anchor" no DOM. A cena WebGL (`StrataScene`) só lê a caixa desse anchor e o progresso (`sceneStore`), e o SVG estático segue o mesmo anchor.
- O espaço de scroll das cenas fixadas é reservado em CSS (`[data-*-spacer]`, `pinSpacing: false`), então o layout é o mesmo antes e depois da hidratação.
- As cenas abaixo da dobra são montadas em momentos ociosos (`src/lib/idle.ts`), uma parte por vez.

## Acessibilidade e movimento

- Com `prefers-reduced-motion: reduce`, o site não tem animações nem cenas fixadas, não carrega a cena WebGL, mostra a ilustração estática, deixa a arquitetura toda acesa e mostra a Stack em grade, com os diagramas completos.
- Sem suporte a WebGL, ou com erro na cena, o site mostra a ilustração SVG estática.
- As cenas fixadas dependem do tamanho da tela: Arquitetura com ≥ 1024×820px, Stack com ≥ 1024×700px. A abertura do hero fica mais curta no mobile.
- Modais usam `<dialog>` nativo: foco gerenciado, fechamento com Esc e retorno do foco ao card de origem.
- Há skip link, foco visível, nomes acessíveis e links externos com `rel="noopener noreferrer"`.

## Publicação (Vercel)

O deploy ainda não foi feito.

1. Suba o repositório para o GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório e aceite o preset Next.js, sem configuração extra.
3. Opcional: defina `NEXT_PUBLIC_SITE_URL` (ex.: `https://seudominio.com`) para canonical, sitemap e Open Graph. Sem ela, o site usa a URL de produção da Vercel.
4. Domínio próprio: em **Settings → Domains**, adicione o domínio e configure no registrador o DNS indicado pela Vercel (registro `A` / `CNAME`).

O plano Hobby da Vercel é gratuito para uso pessoal e não comercial. Se o site for usado comercialmente (por exemplo, para captar clientes freelance), os termos pedem o plano Pro.
