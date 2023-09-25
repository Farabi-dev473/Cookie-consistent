import puppeteer from "puppeteer";
import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import fetch from "cross-fetch";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage()
const blocker = await PuppeteerBlocker.fromLists(fetch, [
    'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt',
    'https://easylist.to/easylist/easylist.txt'
])
await blocker.enableBlockingInPage(page)

await page.goto('https://www.onetrust.com/products/cookie-consent/', 
    {waitUntil: "networkidle0"}
)

// const acceptBtn = await  page.waitForSelector('#onetrust-accept-btn-handler', {timeout: 1000}).catch(() => {console.log("consent btn not found")})
// if(acceptBtn){
//     await acceptBtn.click()
// }

await page.screenshot({path: 'data/consent.png'})

await page.close()
await browser.close()