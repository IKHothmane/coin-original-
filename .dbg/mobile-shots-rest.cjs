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
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
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
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
        },
      ];
      window.localStorage.setItem("coin-original-cart", JSON.stringify(items));
    } catch (e) {}
  });
  const page = await context.newPage();
  for (const p of [
    { name: "checkout", url: "http://localhost:3000/checkout" },
    { name: "merci", url: "http://localhost:3000/merci?ref=rjzdSgNTNGRtsyMNlD8q&status=confirmation" },
    { name: "home", url: "http://localhost:3000/" },
  ]) {
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
