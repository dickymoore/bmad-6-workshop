import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Browser, type Page } from "@playwright/test";

const projectRoot = process.cwd();
const officialEvidenceDir = join(projectRoot, "docs", "sprint-artifacts", "5-7-design-parity-evidence");
const transientEvidenceDir = join(projectRoot, "test-results", "public-board-visual");
const evidenceDir = process.env.PUBLIC_BOARD_EVIDENCE === "1" ? officialEvidenceDir : transientEvidenceDir;
const designHtml = readFileSync(join(projectRoot, "docs", "design-inputs", "code.html"), "utf8");
const designScreenPng = readFileSync(join(projectRoot, "docs", "design-inputs", "screen.png"));

const designContract = (() => {
  const headlineFont = designHtml.match(/"headline"\s*:\s*\["([^"]+)"\]/)?.[1];
  const bodyFont = designHtml.match(/"body"\s*:\s*\["([^"]+)"\]/)?.[1];
  const leftSpan = designHtml.match(/<!-- Left Column: Primary Status -->[\s\S]*?<div class="lg:col-span-(\d+)/)?.[1];
  const rightSpan = designHtml.match(/<!-- Right Column: Contextual Brief -->[\s\S]*?<div class="lg:col-span-(\d+)/)?.[1];

  if (!headlineFont || !bodyFont || !leftSpan || !rightSpan) {
    throw new Error("Story 5.7 could not derive the approved design contract from docs/design-inputs/code.html.");
  }

  return {
    headlineFont,
    bodyFont,
    leftSpan: Number(leftSpan),
    rightSpan: Number(rightSpan),
    expectedDominanceRatio: Number(leftSpan) / Number(rightSpan),
  };
})();

const viewports = [
  {
    key: "foyer-1366x900",
    width: 1366,
    height: 900,
    compareToScreenReference: true,
  },
  {
    key: "desktop-1024x768",
    width: 1024,
    height: 768,
    compareToScreenReference: false,
  },
  {
    key: "compact-height-1366x800",
    width: 1366,
    height: 800,
    compareToScreenReference: false,
  },
] as const;

type ZoneMetric = {
  selector: string;
  exists: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
};

type SurfaceMetric = {
  selector: string;
  exists: boolean;
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
};

type ScreenshotReferenceComparison = {
  source: string;
  sampleWidth: number;
  sampleHeight: number;
  diffPixelRatio: number;
  meanChannelDelta: number;
  meanLuminanceDelta: number;
};

type BoardMetrics = {
  innerHeight: number;
  documentScrollHeight: number;
  bodyScrollHeight: number;
  shell: {
    rect: {
      top: number;
      bottom: number;
      height: number;
    };
    backgroundColor: string;
    boxShadow: string;
  } | null;
  masthead: {
    fontFamily: string;
  } | null;
  headline: {
    fontFamily: string;
  } | null;
  body: {
    fontFamily: string;
  } | null;
  gutterPx: number | null;
  zones: ZoneMetric[];
  surfaceSamples: SurfaceMetric[];
  referenceChecks: {
    codeHtmlContract: {
      expectedHeadlineFont: string;
      expectedBodyFont: string;
      expectedDominanceRatio: number;
      actualDominanceRatio: number;
      gutterPx: number | null;
    };
    screenReference: ScreenshotReferenceComparison | null;
  };
};

function getZone(metrics: BoardMetrics, selector: string) {
  const zone = metrics.zones.find((entry) => entry.selector === selector);

  if (!zone?.exists || zone.width == null || zone.height == null || zone.x == null || zone.y == null) {
    throw new Error(`Missing zone metrics for ${selector}.`);
  }

  return zone as Required<ZoneMetric>;
}

async function waitForBoardToSettle(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    if ("fonts" in document) {
      await document.fonts.ready;
    }
  });

  let previousSignature: string | null = null;
  let stablePasses = 0;

  for (let attempt = 0; attempt < 8 && stablePasses < 2; attempt += 1) {
    const signature = await page.evaluate(() => {
      const selectors = [
        '.dashboard-shell[data-live-shell="calm-fixed"]',
        ".dashboard-lower-grid__modes",
        ".dashboard-lower-grid__locality",
        ".dashboard-lower-grid__map",
      ];

      return JSON.stringify(
        selectors.map((selector) => {
          const element = document.querySelector(selector);

          if (!element) {
            return null;
          }

          const rect = element.getBoundingClientRect();

          return [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)];
        }),
      );
    });

    if (signature === previousSignature) {
      stablePasses += 1;
    } else {
      stablePasses = 0;
      previousSignature = signature;
    }

    await page.waitForTimeout(250);
  }

  if (stablePasses < 2) {
    throw new Error("The canonical public board did not settle into a stable layout before capture.");
  }
}

async function compareAgainstReferenceScreen(
  browser: Browser,
  screenshotBuffer: Buffer,
  viewport: { width: number; height: number },
): Promise<ScreenshotReferenceComparison> {
  const sampleWidth = 180;
  const sampleHeight = Math.round((viewport.height / viewport.width) * sampleWidth);
  const context = await browser.newContext({
    viewport: {
      width: sampleWidth,
      height: sampleHeight,
    },
  });
  const page = await context.newPage();

  try {
    return await page.evaluate(
      async ({
        actualBase64,
        referenceBase64,
        viewportWidth,
        viewportHeight,
        sampleWidth: comparisonWidth,
        sampleHeight: comparisonHeight,
      }) => {
        const loadImage = (base64: string) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Failed to decode comparison image."));
            image.src = `data:image/png;base64,${base64}`;
          });

        const renderToSample = (
          image: HTMLImageElement,
          mode: "stretch" | "scale-width-crop-top",
        ) => {
          const viewportCanvas = document.createElement("canvas");
          viewportCanvas.width = viewportWidth;
          viewportCanvas.height = viewportHeight;
          const viewportContext = viewportCanvas.getContext("2d");

          if (!viewportContext) {
            throw new Error("Failed to create viewport comparison canvas.");
          }

          if (mode === "scale-width-crop-top") {
            const scaledHeight = Math.round((image.height / image.width) * viewportWidth);

            viewportContext.drawImage(image, 0, 0, viewportWidth, scaledHeight);
          } else {
            viewportContext.drawImage(image, 0, 0, viewportWidth, viewportHeight);
          }

          const sampleCanvas = document.createElement("canvas");
          sampleCanvas.width = comparisonWidth;
          sampleCanvas.height = comparisonHeight;
          const sampleContext = sampleCanvas.getContext("2d");

          if (!sampleContext) {
            throw new Error("Failed to create sampled comparison canvas.");
          }

          sampleContext.drawImage(viewportCanvas, 0, 0, comparisonWidth, comparisonHeight);

          return sampleContext.getImageData(0, 0, comparisonWidth, comparisonHeight).data;
        };

        const [actualImage, referenceImage] = await Promise.all([
          loadImage(actualBase64),
          loadImage(referenceBase64),
        ]);

        const actualData = renderToSample(actualImage, "stretch");
        const referenceData = renderToSample(referenceImage, "scale-width-crop-top");
        let diffPixels = 0;
        let totalChannelDelta = 0;
        let totalLuminanceDelta = 0;
        const pixelCount = comparisonWidth * comparisonHeight;

        for (let index = 0; index < actualData.length; index += 4) {
          const redDelta = Math.abs(actualData[index] - referenceData[index]);
          const greenDelta = Math.abs(actualData[index + 1] - referenceData[index + 1]);
          const blueDelta = Math.abs(actualData[index + 2] - referenceData[index + 2]);
          const alphaDelta = Math.abs(actualData[index + 3] - referenceData[index + 3]);
          const channelDelta = (redDelta + greenDelta + blueDelta + alphaDelta) / 4;
          const actualLuminance =
            0.2126 * actualData[index] +
            0.7152 * actualData[index + 1] +
            0.0722 * actualData[index + 2];
          const referenceLuminance =
            0.2126 * referenceData[index] +
            0.7152 * referenceData[index + 1] +
            0.0722 * referenceData[index + 2];

          totalChannelDelta += channelDelta;
          totalLuminanceDelta += Math.abs(actualLuminance - referenceLuminance);

          if (channelDelta > 22) {
            diffPixels += 1;
          }
        }

        return {
          source: "docs/design-inputs/screen.png",
          sampleWidth: comparisonWidth,
          sampleHeight: comparisonHeight,
          diffPixelRatio: Number((diffPixels / pixelCount).toFixed(4)),
          meanChannelDelta: Number((totalChannelDelta / pixelCount).toFixed(2)),
          meanLuminanceDelta: Number((totalLuminanceDelta / pixelCount).toFixed(2)),
        };
      },
      {
        actualBase64: screenshotBuffer.toString("base64"),
        referenceBase64: designScreenPng.toString("base64"),
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
        sampleWidth,
        sampleHeight,
      },
    );
  } finally {
    await context.close();
  }
}

test.describe.configure({ mode: "serial" });

for (const viewport of viewports) {
  test(`captures the canonical public board at ${viewport.key}`, async ({ browser, page }) => {
    mkdirSync(evidenceDir, { recursive: true });

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await waitForBoardToSettle(page);

    const shell = page.locator('.dashboard-shell[data-live-shell="calm-fixed"]');

    await expect(shell).toBeVisible();
    await expect(page.locator(".dashboard-masthead")).toBeVisible();
    await expect(page.locator(".dashboard-lower-grid__modes")).toBeVisible();
    await expect(page.locator(".dashboard-lower-grid__locality")).toBeVisible();
    await expect(page.locator(".dashboard-lower-grid__map")).toBeVisible();
    await expect(page.locator("main button, main input, main form, main select, main textarea, main a[href]")).toHaveCount(0);

    const screenshotBuffer = await page.screenshot({
      animations: "disabled",
      fullPage: false,
    });

    const metrics = (await page.evaluate(
      ({ expectedHeadlineFont, expectedBodyFont, expectedDominanceRatio }) => {
        const findSurfaceMetric = (selector: string) => {
          const element = document.querySelector(selector);

          if (!element) {
            return {
              selector,
              exists: false,
            };
          }

          const styles = getComputedStyle(element);

          return {
            selector,
            exists: true,
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
            boxShadow: styles.boxShadow,
          };
        };

        const zones = [".dashboard-lower-grid__modes", ".dashboard-lower-grid__locality", ".dashboard-lower-grid__map"].map(
          (selector) => {
            const element = document.querySelector(selector);

            if (!element) {
              return {
                selector,
                exists: false,
              };
            }

            const rect = element.getBoundingClientRect();
            const styles = getComputedStyle(element);

            return {
              selector,
              exists: true,
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderColor,
              boxShadow: styles.boxShadow,
            };
          },
        );

        const modesZone = zones.find((zone) => zone.selector === ".dashboard-lower-grid__modes");
        const mapZone = zones.find((zone) => zone.selector === ".dashboard-lower-grid__map");
        const gutterPx =
          modesZone?.exists &&
          mapZone?.exists &&
          modesZone.x != null &&
          modesZone.width != null &&
          mapZone.x != null
            ? Math.round(mapZone.x - (modesZone.x + modesZone.width))
            : null;
        const actualDominanceRatio =
          modesZone?.exists &&
          mapZone?.exists &&
          modesZone.width != null &&
          mapZone.width != null &&
          mapZone.width > 0
            ? Number((modesZone.width / mapZone.width).toFixed(3))
            : 0;

        return {
          innerHeight: window.innerHeight,
          documentScrollHeight: document.documentElement.scrollHeight,
          bodyScrollHeight: document.body.scrollHeight,
          shell: document.querySelector(".dashboard-shell")
            ? {
                rect: {
                  top: Math.round((document.querySelector(".dashboard-shell") as Element).getBoundingClientRect().top),
                  bottom: Math.round((document.querySelector(".dashboard-shell") as Element).getBoundingClientRect().bottom),
                  height: Math.round((document.querySelector(".dashboard-shell") as Element).getBoundingClientRect().height),
                },
                backgroundColor: getComputedStyle(document.querySelector(".dashboard-shell") as Element).backgroundColor,
                boxShadow: getComputedStyle(document.querySelector(".dashboard-shell") as Element).boxShadow,
              }
            : null,
          masthead: document.querySelector(".dashboard-masthead__venue")
            ? {
                fontFamily: getComputedStyle(document.querySelector(".dashboard-masthead__venue") as Element).fontFamily,
              }
            : null,
          headline: document.querySelector(".atmospheric-header__headline")
            ? {
                fontFamily: getComputedStyle(document.querySelector(".atmospheric-header__headline") as Element).fontFamily,
              }
            : null,
          body: {
            fontFamily: getComputedStyle(document.body).fontFamily,
          },
          gutterPx,
          zones,
          surfaceSamples: [
            findSurfaceMetric(".atmospheric-header"),
            findSurfaceMetric(".mode-summary-card"),
            findSurfaceMetric(".locality-reference-panel__item"),
            findSurfaceMetric(".local-map-panel__overlay-card"),
          ],
          referenceChecks: {
            codeHtmlContract: {
              expectedHeadlineFont,
              expectedBodyFont,
              expectedDominanceRatio,
              actualDominanceRatio,
              gutterPx,
            },
            screenReference: null,
          },
        };
      },
      {
        expectedHeadlineFont: designContract.headlineFont,
        expectedBodyFont: designContract.bodyFont,
        expectedDominanceRatio: designContract.expectedDominanceRatio,
      },
    )) as BoardMetrics;

    expect(metrics.shell?.rect.bottom ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(metrics.innerHeight + 1);
    expect(metrics.masthead?.fontFamily ?? "").toContain(designContract.headlineFont);
    expect(metrics.headline?.fontFamily ?? "").toContain(designContract.headlineFont);
    expect(metrics.body?.fontFamily ?? "").toContain(designContract.bodyFont);

    const modesZone = getZone(metrics, ".dashboard-lower-grid__modes");
    const mapZone = getZone(metrics, ".dashboard-lower-grid__map");
    const localityZone = getZone(metrics, ".dashboard-lower-grid__locality");
    const actualDominanceRatio = modesZone.width / mapZone.width;

    expect(actualDominanceRatio).toBeGreaterThanOrEqual(designContract.expectedDominanceRatio - 0.05);
    expect(actualDominanceRatio).toBeLessThanOrEqual(designContract.expectedDominanceRatio + 0.2);
    expect(metrics.gutterPx ?? 0).toBeGreaterThanOrEqual(12);
    expect(mapZone.y).toBeLessThan(localityZone.y);
    expect(
      metrics.surfaceSamples.filter((sample) => sample.exists).some((sample) => sample.backgroundColor !== "rgba(0, 0, 0, 0)"),
    ).toBeTruthy();

      if (viewport.compareToScreenReference) {
        const screenReference = await compareAgainstReferenceScreen(browser, screenshotBuffer, viewport);

        metrics.referenceChecks.screenReference = screenReference;

        expect(screenReference.meanChannelDelta).toBeLessThanOrEqual(18.5);
        expect(screenReference.meanLuminanceDelta).toBeLessThanOrEqual(22);
        expect(screenReference.diffPixelRatio).toBeLessThanOrEqual(0.18);
      }

    writeFileSync(join(evidenceDir, `${viewport.key}.png`), screenshotBuffer);
    writeFileSync(join(evidenceDir, `${viewport.key}.json`), JSON.stringify(metrics, null, 2));
  });
}
