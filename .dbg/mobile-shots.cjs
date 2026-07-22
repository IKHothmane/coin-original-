/* Capture mobile screenshots of key pages using system Chrome. */
const { chromium } = require("playwright-core");

const PAGES = [
  { name: "boutique", url: "http://localhost:3000/boutique" },
  { name: "panier", url: "http://localhost:3000/panier" },
  { name: "checkout", url: "http://localhost:3000/checkout" },
  { name: "merci", url: "http://localhost:3000/merci?ref=rjzdSgNTNGRtsyMNlD8q&status=confirmation" },
  { name: "home", url: "http://localhost:3000/" },
];

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });

  // Seed the cart so panier/checkout render their filled state
  await context.addInitScript(() => {
    try {
      const keys = ["coin-original-cart", "cart", "cart-items"];
      const items = [
        {
          id: "retro-high-og-42",
          slug: "retro-high-og",
          name: "Retro High OG",
          brand: "Original Drop",
          size: "42",
          price: 1200,
          quantity: 1,
          image: "",
        },
      ];
      keys.forEach((k) => window.localStorage.setItem(k, JSON.stringify(items)));
    } catch (e) {}
  });

  const page = await context.newPage();
  for (const p of PAGES) {
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const overflowX = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    console.log(`${p.name}: horizontalOverflow=${overflowX}px`);
    await page.screenshot({ path: `shots/${p.name}-mobile.png`, fullPage: true });
  }

  await browser.close();
})();
