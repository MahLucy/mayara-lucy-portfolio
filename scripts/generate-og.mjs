// Generates the Open Graph / Twitter card image shared by both locales.
// Usage: node scripts/generate-og.mjs
import { copyFileSync } from "node:fs";
import sharp from "sharp";

const W = 1200;
const H = 630;
const layers = ["#f1f5fa", "#486bff", "#8fa6ff", "#52e6d0", "#d8ff68"];
const cx = 900;
const slabs = layers
  .map((c, i) => ({ c, y: 170 + i * 62 }))
  .reverse()
  .map(
    ({ c, y }) => `
  <polygon points="${cx - 150},${y} ${cx},${y + 75} ${cx},${y + 87} ${cx - 150},${y + 12}" fill="${c}" opacity=".6"/>
  <polygon points="${cx + 150},${y} ${cx},${y + 75} ${cx},${y + 87} ${cx + 150},${y + 12}" fill="${c}" opacity=".4"/>
  <polygon points="${cx},${y - 75} ${cx + 150},${y} ${cx},${y + 75} ${cx - 150},${y}" fill="${c}"/>`,
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#0b1020"/>
  ${slabs}
  <polygon points="${cx},70 ${cx + 175},170 ${cx + 175},430 ${cx},540 ${cx - 175},430 ${cx - 175},170" fill="none" stroke="#ff755e" stroke-width="2.5" stroke-dasharray="9 9"/>
  <text x="80" y="150" font-family="Consolas, monospace" font-size="20" letter-spacing="4" fill="#a9b3cc">PORTFOLIO · SÃO PAULO</text>
  <text x="76" y="270" font-family="Segoe UI, Arial, sans-serif" font-weight="300" font-size="104" fill="#f1f5fa">Mayara</text>
  <text x="76" y="372" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="104" fill="#f1f5fa">Lucy</text>
  <text x="80" y="450" font-family="Consolas, monospace" font-size="24" fill="#52e6d0">Full Stack · AI · AWS Cloud · AppSec</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("src/app/(pt)/opengraph-image.png");
copyFileSync("src/app/(pt)/opengraph-image.png", "src/app/(pt)/twitter-image.png");
copyFileSync("src/app/(pt)/opengraph-image.png", "src/app/(en)/en/opengraph-image.png");
copyFileSync("src/app/(pt)/opengraph-image.png", "src/app/(en)/en/twitter-image.png");
console.log("ok");
