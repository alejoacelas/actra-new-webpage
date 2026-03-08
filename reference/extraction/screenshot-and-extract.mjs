import { chromium } from "playwright";
import { writeFile, mkdir } from "fs/promises";

// Focus on the main pages — skip service/event subpages which are dynamic Wix widgets
const PAGES = [
  { slug: "home", url: "https://www.actra.ngo" },
  { slug: "what-we-do", url: "https://www.actra.ngo/what-we-do" },
  { slug: "support-us", url: "https://www.actra.ngo/support-us" },
  { slug: "book-online", url: "https://www.actra.ngo/book-online" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function extractDesignTokens(page) {
  return page.evaluate(() => {
    const computed = getComputedStyle(document.documentElement);
    const tokens = {};

    // Extract all CSS custom properties from stylesheets
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.style) {
            for (const prop of rule.style) {
              if (prop.startsWith("--")) {
                tokens[prop] = computed.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch {
        // Cross-origin stylesheet, skip
      }
    }

    // Extract computed styles from key elements
    const elementStyles = {};
    const selectors = {
      h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
      body: "body", p: "p", a: "a", button: "button",
      nav: "nav", header: "header", footer: "footer",
    };

    for (const [name, sel] of Object.entries(selectors)) {
      const el = document.querySelector(sel);
      if (el) {
        const s = getComputedStyle(el);
        elementStyles[name] = {
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          color: s.color,
          backgroundColor: s.backgroundColor,
        };
      }
    }

    // Collect unique colors
    const colors = new Set();
    const bgColors = new Set();
    document.querySelectorAll("*").forEach((el) => {
      const s = getComputedStyle(el);
      if (s.color && s.color !== "rgba(0, 0, 0, 0)") colors.add(s.color);
      if (s.backgroundColor && s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent")
        bgColors.add(s.backgroundColor);
    });

    return { cssVariables: tokens, elementStyles, textColors: [...colors], backgroundColors: [...bgColors] };
  });
}

async function extractPageContent(page) {
  return page.evaluate(() => {
    const content = { headings: [], paragraphs: [], links: [], images: [] };

    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => {
      const text = el.innerText.trim();
      if (text) content.headings.push({ tag: el.tagName, text });
    });

    document.querySelectorAll("p").forEach((el) => {
      const text = el.innerText.trim();
      if (text && text.length > 5) content.paragraphs.push(text);
    });

    document.querySelectorAll("a[href]").forEach((el) => {
      const text = el.innerText.trim();
      if (text) content.links.push({ text, href: el.getAttribute("href") });
    });

    document.querySelectorAll("img[src]").forEach((el) => {
      content.images.push({ src: el.src, alt: el.alt || "", width: el.naturalWidth, height: el.naturalHeight });
    });

    return content;
  });
}

async function main() {
  const outDir = new URL("./output", import.meta.url).pathname;
  const screenshotDir = `${outDir}/screenshots`;
  await mkdir(`${screenshotDir}/desktop`, { recursive: true });
  await mkdir(`${screenshotDir}/mobile`, { recursive: true });

  // Use headed mode — Wix sometimes behaves differently in headless
  const browser = await chromium.launch({ headless: false });

  const allDesignTokens = {};
  const allContent = {};

  for (const vp of VIEWPORTS) {
    for (const p of PAGES) {
      console.log(`[${vp.name}] Screenshotting ${p.slug}...`);

      // Fresh context per page to avoid Wix SPA navigation issues
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      try {
        // Use "load" instead of "networkidle" — Wix never stops making requests
        await page.goto(p.url, { waitUntil: "load", timeout: 45000 });
        // Wait for Wix content to render + animations to settle
        await page.waitForTimeout(5000);

        await page.screenshot({
          path: `${screenshotDir}/${vp.name}/${p.slug}.png`,
          fullPage: true,
        });
        console.log(`  ✓ Screenshot saved`);

        // Only extract tokens and content on desktop pass
        if (vp.name === "desktop") {
          console.log(`  Extracting design tokens and content...`);
          allDesignTokens[p.slug] = await extractDesignTokens(page);
          allContent[p.slug] = await extractPageContent(page);
          console.log(`  ✓ Extracted`);
        }
      } catch (err) {
        console.error(`  ERROR on ${p.slug}: ${err.message}`);
      }

      await context.close();
    }
  }

  await browser.close();

  // Write extracted data
  await writeFile(`${outDir}/design-tokens.json`, JSON.stringify(allDesignTokens, null, 2));
  await writeFile(`${outDir}/page-content.json`, JSON.stringify(allContent, null, 2));

  console.log(`\nDone! Output saved to ${outDir}/`);
  console.log(`  Screenshots: ${screenshotDir}/desktop/ and ${screenshotDir}/mobile/`);
  console.log(`  Design tokens: ${outDir}/design-tokens.json`);
  console.log(`  Page content: ${outDir}/page-content.json`);
}

main().catch(console.error);
