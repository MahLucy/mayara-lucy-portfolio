import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const sections = ["projects", "architecture", "stack", "about", "journey", "contact"];

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

test.describe("content and navigation", () => {
  test("renders every section in PT-BR with real content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Mayara Lucy/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Mayara");
    for (const id of sections) await expect(page.locator(`#${id}`)).toBeAttached();
    await expect(page.locator("#journey")).toContainText("Analista de Soluções de Segurança");
    await expect(page.locator("#journey")).toContainText("TecBan");
    await expect(page.locator("#about")).toContainText("Ciência da Computação");
  });

  test("all in-page anchors resolve and external links are safe", async ({ page }) => {
    await page.goto("/");
    const anchors = await page.locator("a[href^='#']").evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
    for (const a of new Set(anchors)) await expect(page.locator(a), a).toBeAttached();
    const rels = await page.locator("a[target='_blank']").evaluateAll((els) => els.map((e) => e.getAttribute("rel") ?? ""));
    expect(rels.length).toBeGreaterThan(0);
    for (const rel of rels) expect(rel).toContain("noopener");
  });

  test("CV, images and SEO files are served", async ({ request }) => {
    for (const path of ["/cv/mayara-lucy-cv.pdf", "/images/mayara-lucy.webp", "/icon.svg", "/robots.txt", "/sitemap.xml"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });

  test("unknown routes return 404", async ({ request }) => {
    const res = await request.get("/nao-existe");
    expect(res.status()).toBe(404);
  });

  test("SEO metadata is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("meta[name='description']")).toHaveAttribute("content", /full stack/i);
    await expect(page.locator("meta[property='og:title']")).toHaveAttribute("content", /Mayara Lucy/);
    await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveCount(1);
    await expect(page.locator("script[type='application/ld+json']")).toHaveCount(1);
  });
});

test.describe("projects", () => {
  test("filters narrow the list and announce the count", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("[data-project-card]");
    await expect(cards).toHaveCount(14);
    const appsec = page.getByRole("button", { name: "AppSec & DevSecOps" });
    await appsec.scrollIntoViewIfNeeded();
    await appsec.click();
    await expect(appsec).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveCount(1);
    await expect(page.getByText("1 projeto", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Todos" }).click();
    await expect(cards).toHaveCount(14);
  });

  test("dialog opens, focuses close, closes with Escape and restores focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /Ver detalhes.*RAG e busca semântica/ });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "RAG e busca semântica" });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\?p=rag-busca-semantica/);
    await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/\?p=/);
    await expect(trigger).toBeFocused();
  });

  test("deep link opens the project dialog", async ({ page }) => {
    await page.goto("/?p=portal-seguranca-aws");
    await expect(page.getByRole("dialog", { name: /Portal de Segurança/ })).toBeVisible();
  });

  test("freelance project links to the live site", async ({ page }) => {
    await page.goto("/?p=mendi");
    const link = page.getByRole("dialog").getByRole("link", { name: /Visitar site/ });
    await expect(link).toHaveAttribute("href", "https://mendihub.com/");
  });
});

test.describe("language", () => {
  test("EN page is fully translated", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: "See projects" })).toBeVisible();
    await expect(page.locator("#journey")).toContainText("Security Solutions Analyst");
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", /\/en$/);
  });

  test("switching language keeps query parameters and the current section", async ({ page }) => {
    await page.goto("/?ref=test#stack");
    await page.evaluate(() => document.getElementById("stack")?.scrollIntoView({ behavior: "instant", block: "start" }));
    await page.waitForTimeout(300);
    await page.getByRole("link", { name: "Read in English" }).click();
    await expect(page).toHaveURL(/\/en\?ref=test#stack$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("contact", () => {
  test("copy email gives accessible confirmation", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Copiar e-mail" }).click();
    await expect(page.getByRole("status")).toHaveText("E-mail copiado");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("mayara-lucy@live.com");
  });
});

test.describe("layout", () => {
  for (const width of [375, 768, 1024, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/en"]) {
        await page.goto(path);
        expect(await horizontalOverflow(page), path).toBeLessThanOrEqual(0);
      }
    });
  }

  test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const menu = page.getByRole("dialog", { name: "Navegação principal" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: /Contato/ }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#contact/);
  });
});

test.describe("motion and 3D fallbacks", () => {
  test("reduced motion: content visible, static illustration, no canvas", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("html")).not.toHaveClass(/can-motion/);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("img", { name: /cinco camadas/ })).toBeVisible();
    // Architecture stays fully lit and unpinned.
    await expect(page.locator("#architecture li[aria-current]")).toHaveCount(0);
    await context.close();
  });

  test("no WebGL: falls back to the static illustration", async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        value(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
          if (type.startsWith("webgl")) return null;
          return (original as (...a: unknown[]) => unknown).call(this, type, ...args);
        },
      });
    });
    await page.goto("/");
    await page.waitForTimeout(1500);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("WebGL scene loads lazily when supported", async ({ page, isMobile }) => {
    await page.goto("/");
    // Static illustration first; the scene waits for the first interaction.
    await expect(page.getByRole("img", { name: /cinco camadas|five stacked/ })).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(page.locator("#top canvas")).toHaveCount(0);
    if (isMobile) await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    else await page.mouse.move(400, 300);
    await expect(page.locator("#top canvas")).toHaveCount(1, { timeout: 15_000 });
  });

  test("no runtime errors on load and scroll", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto("/");
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });
});

test.describe("scroll scenes", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        const st = document.createElement("style");
        st.textContent = "html{scroll-behavior:auto !important}";
        document.head.append(st);
      });
    });
  });

  test("hero opening converges on scroll and reverses", async ({ page }) => {
    await page.goto("/");
    const reveal = page.locator("[data-hero-reveal]").first();
    const scaleOf = () =>
      page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector("[data-hero-anchor]")!).transform).a);
    expect(await scaleOf()).toBeGreaterThan(1.3);
    const end = await page.evaluate(() => document.querySelector<HTMLElement>("[data-hero-spacer]")!.offsetHeight);
    for (let y = 0; y <= end + 50; y += 150) await page.evaluate((v) => window.scrollTo(0, v), y);
    await expect.poll(scaleOf).toBeLessThan(1.02);
    await expect.poll(() => reveal.evaluate((e) => Number(getComputedStyle(e).opacity))).toBeGreaterThan(0.95);
    for (let y = end; y > 0; y -= 150) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(scaleOf).toBeGreaterThan(1.3);
  });

  test("keyboard focus on hidden hero CTAs jumps to the settled state", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard flow checked on desktop");
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/motion-live/);
    await page.getByRole("link", { name: "Ver projetos" }).focus();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  });

  test("stack: horizontal sequence on desktop reaches the last card, then releases", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop scene");
    await page.goto("/");
    await expect(page.locator("[data-stack-card]")).toHaveCount(5);
    const { top, runway } = await page.evaluate(() => ({
      top: document.getElementById("stack")!.getBoundingClientRect().top + window.scrollY,
      runway: document.querySelector<HTMLElement>("[data-stack-spacer]")!.offsetHeight,
    }));
    expect(runway).toBeGreaterThan(500);
    for (let y = top - 400; y < top + runway; y += 200) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.evaluate((v) => window.scrollTo(0, v), top + runway);
    // The track ends exactly where its last card meets the right edge.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const t = document.querySelector<HTMLElement>(".stack-track")!;
            return Math.abs(new DOMMatrix(getComputedStyle(t).transform).e + (t.scrollWidth - window.innerWidth));
          }),
        { timeout: 15_000 },
      )
      .toBeLessThan(3);
    await page.evaluate((v) => window.scrollTo(0, v), top + runway + 1200);
    await expect(page.locator("#about")).toBeInViewport();
  });

  test("stack: mobile shows a vertical sequence without pinning", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile layout");
    await page.goto("/");
    expect(await page.evaluate(() => document.querySelector<HTMLElement>("[data-stack-spacer]")!.offsetHeight)).toBe(0);
    const cards = page.locator("[data-stack-card]");
    await expect(cards).toHaveCount(5);
    const xs = await cards.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
    expect(new Set(xs).size).toBe(1);
  });

  test("all expertise from the content is listed", async ({ page }) => {
    await page.goto("/");
    for (const name of ["React", "NestJS", "watsonx.ai", "AWS ECS/Fargate", "PostgreSQL", "Semgrep", "Kubernetes", "Angular"]) {
      await expect(page.locator("#stack").getByText(name, { exact: true }).first()).toBeAttached();
    }
  });

  test("chapter wipes complete and leave no clip behind", async ({ page }) => {
    await page.goto("/");
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 300) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(500);
    const clips = await page.evaluate(() =>
      ["projects", "architecture", "stack", "about", "journey"].map((id) => document.getElementById(id)!.style.clipPath),
    );
    expect(clips.every((c) => c === "")).toBe(true);
  });
});

test.describe("accessibility", () => {
  for (const path of ["/", "/en"]) {
    test(`axe: no serious violations on ${path}`, async ({ browser }) => {
      test.setTimeout(90_000);
      // Reduced motion so reveals don't leave text mid-animation during the scan.
      const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      await context.close();
    });
  }

  test("project dialog passes axe", async ({ page }) => {
    await page.goto("/?p=pdf-ocr-ia");
    await expect(page.getByRole("dialog")).toBeVisible();
    const results = await new AxeBuilder({ page }).include("dialog[open]").analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => v.id)).toEqual([]);
  });

  test("keyboard: skip link moves focus to main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard flow checked on desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#content$/);
  });
});
