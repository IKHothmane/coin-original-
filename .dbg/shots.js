// Screenshot helper: node .dbg/shots.js <outdir> [pages...]
// Captures key pages at mobile/tablet/desktop/large widths.
const { chromium } = require("playwright-core");
const CHROME = process.env.CHROME_PATH ||
  "C:/Users/hp/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const path = require("path");
const fs = require("fs");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PAGES = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/boutique", "/panier", "/contact", "/faq", "/login", "/admin"];
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 900 },
  { name: "large", width: 1920, height: 1080 },
];

(async () => {
  const outdir = process.argv[2] || ".dbg/shots";
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    for (const p of PAGES) {
      const slug = p === "/" ? "home" : p.replace(/\//g, "_").replace(/^_/, "");
      try {
        await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 45000 });
      } catch (e) {
        console.log("goto warning", p, e.message);
      }
      await page.waitForTimeout(1200);
      const file = path.join(outdir, `${slug}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: vp.name === "desktop" || vp.name === "mobile" });
      console.log("saved", file);
    }
    await page.close();
  }
  await browser.close();
})();
