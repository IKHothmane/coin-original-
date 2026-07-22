const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  for (const width of [390, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 800 },
      deviceScaleFactor: width === 390 ? 2 : 1,
      isMobile: width === 390,
      hasTouch: width === 390,
    });
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem("coin-original-favorites", JSON.stringify(["retro-high-og", "heavy-box-hoodie"]));
      } catch (e) {}
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/favoris", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const overflowX = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    console.log(`favoris-${width}: horizontalOverflow=${overflowX}px`);
    await page.screenshot({ path: `shots/favoris-${width}.png`, fullPage: true });
    await context.close();
  }
  await browser.close();
})();
