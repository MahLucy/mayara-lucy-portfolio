// Captures above-the-fold previews of the public freelance sites listed in src/content/projects.ts.
// Usage: node scripts/capture-previews.mjs
import { chromium } from "@playwright/test";
import sharp from "sharp";

const sites = {
  // day-spa-hochheim is behind bot verification; add its preview manually.
  "clinica-hochheim": "https://www.clinicahochheim.com.br/",
  "hochheim-kids": "https://hochheimkids.com.br/",
  "grupo-selecionar": "https://gruposelecionar.com.br/",
  mendi: "https://mendihub.com/",
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const [slug, url] of Object.entries(sites)) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2500);
    // Hide fixed overlays (cookie banners, chat buttons) without interacting with them.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if ((cs.position === "fixed" || cs.position === "sticky") && el.getBoundingClientRect().top > 200) {
          el.style.setProperty("display", "none", "important");
        }
      }
    });
    const png = await page.screenshot({ type: "png" });
    await sharp(png).resize(1280, 800).webp({ quality: 78 }).toFile(`public/images/projects/${slug}.webp`);
    console.log("ok", slug);
  } catch (e) {
    console.error("failed", slug, e.message);
  }
}
await browser.close();
