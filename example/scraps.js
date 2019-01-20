const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.mymoneymantra.com/");
  await page.screenshot({ path: "bedbathandbeyond.png" });

  await browser.close();
})();
