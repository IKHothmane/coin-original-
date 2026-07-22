const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 320, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await context.addInitScript(() => {
    try {
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
      window.localStorage.setItem("coin-original-cart", JSON.stringify(items));
    } catch (e) {}
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/boutique", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log(`boutique-320: horizontalOverflow=${overflowX}px`);
  await page.screenshot({ path: "shots/boutique-320.png", fullPage: true });
  await browser.close();
})();
