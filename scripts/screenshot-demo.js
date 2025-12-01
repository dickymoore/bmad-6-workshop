const path = require("path");
const { chromium } = require("playwright");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const port = process.env.DEMO_PORT || "3000";
  await page.goto(`http://localhost:${port}/demo-floorplans`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const screenshotPath = path.join(process.cwd(), "demo-floorplan.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
