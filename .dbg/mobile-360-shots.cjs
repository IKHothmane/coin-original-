const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const pages = [
    { name: "boutique-360", url: "http://localhost:3000/boutique", width: 360 },
    { name: "panier-360", url: "http://localhost:3000/panier", width: 360 },
    { name: "checkout-360", url: "http://localhost:3000/checkout", width: 360 },
    { name: "merci-360", url: "http://localhost:3000/merci?ref=rjzdSgNTNGRtsyMNlD8q&status=confirmation", width: 360 },
  ];
  for (const p of pages) {
    const context = await browser.newContext({
      viewport: { width: p.width, height: 844 },
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
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
          },
        ];
        window.localStorage.setItem("coin-original-cart", JSON.stringify(items));
      } catch (e) {}
    });
    const page = await context.newPage();
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const overflowX = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    console.log(`${p.name}: horizontalOverflow=${overflowX}px`);
    await page.screenshot({ path: `shots/${p.name}.png`, fullPage: true });
    await context.close();
  }
  await browser.close();
})();
