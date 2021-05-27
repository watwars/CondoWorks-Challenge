const puppeteer = require("puppeteer");
const path = require("path");

const downloadPath = path.resolve("./");

(async () => {
  try {
    const EMAIL = "coop.test@condoworks.co";
    const PW = "MyTesting711";

    const WIDTH = 1100;
    const HEIGHT = 869;

    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 75,
    });
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

    // accessing file page
    let goodFile = await page.$("td[title='123444']");
    for (let i = 1; i <= 7; i++) {
      goodFile = await page.evaluateHandle(
        (el) => el.previousElementSibling,
        goodFile
      );
    }
    const fileLink = await page.evaluateHandle((e) => e.children[0], goodFile);
    const fileLinkURL = await (await fileLink.getProperty("href")).jsonValue();
    await page.goto(fileLinkURL, { waitUntil: "networkidle2" });
    console.log("File found, preparing to download...");

    // downloading the file
    await page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });
    await page.click("a[title='Download file']");
    await page.waitForTimeout(3000);
    console.log("File downloaded..");
    console.log(
      `You can find the file in the current directory, or with the following absolute path ${__dirname}`
    );

    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
