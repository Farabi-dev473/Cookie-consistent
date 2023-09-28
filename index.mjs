import puppeteer from "puppeteer";
import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import fetch from "cross-fetch";

class WebScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();

    const blocker = await PuppeteerBlocker.fromLists(fetch, [
      'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt',
      'https://easylist.to/easylist/easylist.txt'
    ]);
    await blocker.enableBlockingInPage(this.page);
  }

  async scrapeWebsite(url) {
    await this.page.goto(url, { waitUntil: "networkidle0" });
    await this.page.screenshot({ path: 'data/consent.png' });
  }

  async close() {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

(async () => {
  const scraper = new WebScraper();

  try {
    await scraper.initialize();
    await scraper.scrapeWebsite('https://www.onetrust.com/products/cookie-consent/');
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await scraper.close();
  }
})();
