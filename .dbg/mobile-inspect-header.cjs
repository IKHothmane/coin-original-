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
  const data = await page.evaluate(() => {
    const header = document.querySelector(".site-header.md\\:hidden");
    const logoSpan = document.querySelector(".site-header.md\\:hidden .roca-display");
    const logoImg = document.querySelector(".site-header.md\\:hidden .theme-logo--dark");
    const container = document.querySelector(".site-header.md\\:hidden .container-site");
    const icons = Array.from(
      document.querySelectorAll(".site-header.md\\:hidden a, .site-header.md\\:hidden button"),
    ).map((el) => ({
      tag: el.tagName,
      text: el.textContent.trim().slice(0, 20),
      w: el.getBoundingClientRect().width,
      h: el.getBoundingClientRect().height,
      x: el.getBoundingClientRect().left,
      y: el.getBoundingClientRect().top,
    }));
    return {
      headerW: header?.getBoundingClientRect().width,
      containerW: container?.getBoundingClientRect().width,
      logoSpan: logoSpan?.getBoundingClientRect(),
      logoImg: logoImg?.getBoundingClientRect(),
      icons,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
