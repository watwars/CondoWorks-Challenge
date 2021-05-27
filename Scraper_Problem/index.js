const puppeteer = require("puppeteer");

(async () => {
  const EMAIL = "coop.test@condoworks.co";
  const PW = "MyTesting711";

  const WIDTH = 1100;
  const HEIGHT = 869;

  const browser = await puppeteer.launch();
  const page = await browser.newPage({
    defaultViewport: { width: WIDTH, height: HEIGHT },
  });
  page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.goto("https://app-dev.condoworks.co");

  // login
  await page.focus("#Email");
  await page.keyboard.type(EMAIL);
  await page.focus("#Password");
  await page.keyboard.type(PW);
  await page.click("#btnSubmit");
  console.log("Login complete");

  // find the file
  await page.click("a[class='nav-link dropdown-toggle']");
  await page.click("a[href='/invoices/all']");
  console.log("Waiting for files to load...");
  await page.waitForTimeout(1000);
  await page.focus("input[name='invoices.InvoiceNumber']");
  await page.keyboard.type("123");
  await page.waitForTimeout(400);

  const goodFile = await page.$("td[title='123444']");
  const parent = await goodFile.getProperty("parentNode");
  const magnifyingGlass = await parent.getProperty("children");
  console.log(magnifyingGlass);
  // const magnifyingGlass = parent.children[0];

  // await magnifyingGlass.click();

  // await page.screenshot({ path: "example.png" });

  await browser.close();
})();
