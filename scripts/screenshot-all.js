const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");
const offices = require("../assets/floorplans/offices.json").offices;

async function main() {
  const port = process.env.DEMO_PORT || "3000";
  const baseUrl = `http://localhost:${port}/demo-floorplans`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1.5,
  });

  for (const office of offices) {
    for (const floor of office.floors) {
      await page.goto(baseUrl, { waitUntil: "load" });
      await page.waitForSelector("#office-select", { timeout: 15000 });
      await page.selectOption("#office-select", office.id);
      await page.waitForSelector("#floor-select", { timeout: 15000 });
      await page.selectOption("#floor-select", floor.id);
      await page.waitForTimeout(500);
      const filename = `demo-${office.code}-${floor.id}.png`;
      const screenshotPath = path.join(process.cwd(), filename);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved ${screenshotPath}`);
    }
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
