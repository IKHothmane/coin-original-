const { chromium } = require("playwright-core");

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
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/boutique", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2500);

  const chips = await page.$$eval('a[href^="/boutique"]', (els) =>
    els.map((el) => el.textContent.trim()),
  );
  console.log("Chips:", JSON.stringify(chips));

  const heading = await page
    .$eval("h1.section-title", (el) => ({
      text: el.textContent.trim(),
      whiteSpace: window.getComputedStyle(el).whiteSpace,
      width: el.getBoundingClientRect().width,
      parentWidth: el.parentElement.getBoundingClientRect().width,
    }))
    .catch(() => null);
  console.log("h1:", heading);

  const logo = await page
    .$eval(".site-header span.roca-display", (el) => ({
      text: el.textContent.trim(),
      width: el.getBoundingClientRect().width,
    }))
    .catch(() => null);
  console.log("logo text:", logo);

  await browser.close();
})();
