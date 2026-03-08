# Actra webpage rebuild: technical plan

## Current state

- Site lives at [actra.ngo](https://www.actra.ngo/), built on Wix.
- Wix renders everything client-side (heavy JS), so the actual content isn't in the HTML source—it's loaded dynamically. This makes migration harder (content will need to be manually extracted or screen-scraped via browser automation).
- The site needs updated content reflecting Actra's evolved program and role, plus full bilingual support (English + Spanish).

## Requirements

1. **Bilingual (EN/ES)** with easy language switching.
2. **Updated content**—new copy, possibly new structure.
3. **Easy to maintain** by non-developers once launched.
4. **Low cost** (NGO budget).
5. **Good SEO**—static/SSR HTML, proper `hreflang` tags, clean URLs.
6. **Simple hosting**—ideally free or near-free.

## Options

### Option A: Static site generator (Astro) — recommended

**Stack:** Astro + Tailwind CSS, deployed on Netlify/Vercel/Cloudflare Pages.

| Pros | Cons |
|---|---|
| Zero runtime JS by default, extremely fast | Non-developers need to edit Markdown/files (or use a CMS layer) |
| Astro has first-class i18n routing (`/en/`, `/es/`) | Initial setup effort |
| Free hosting on Netlify/Vercel/Cloudflare Pages | |
| Content lives in Markdown or MDX—easy to version-control | |
| No vendor lock-in | |
| Great Lighthouse scores out of the box | |

**i18n approach:** Astro's built-in i18n routing creates `/en/about`, `/es/about`, etc. Content files live in `src/content/en/` and `src/content/es/`. A language switcher in the nav links to the equivalent page in the other language.

**CMS layer (optional):** If non-devs need to edit content without touching code, add a headless CMS like [Tina](https://tina.io/) (free tier, git-backed, visual editing) or [Decap CMS](https://decapcms.org/) (free, git-backed). This gives a browser-based editor that commits changes to the repo, triggering a rebuild.

**Estimated cost:** $0/month (free-tier hosting + free CMS). Domain already owned.

### Option B: Stay on Wix (redesign in place)

| Pros | Cons |
|---|---|
| No migration needed | Wix multilingual plugin (Wix Multilingual) costs extra on some plans |
| Drag-and-drop editing for non-developers | Vendor lock-in, poor export options |
| Built-in hosting | Heavier pages, worse performance/SEO than static |
| | Harder to version-control or review content changes |
| | Monthly cost for premium plan (~$17–32/month for a proper custom domain + features) |

**i18n approach:** Wix Multilingual auto-duplicates pages and adds a language switcher. Translation is done page-by-page in the Wix editor.

**When this makes sense:** Only if the team strongly prefers visual drag-and-drop editing and nobody is comfortable with Markdown/git workflows, even with a CMS layer.

### Option C: Next.js (overkill unless future interactivity is planned)

| Pros | Cons |
|---|---|
| Full React ecosystem if interactive features are needed later | Heavier than necessary for a mostly-static NGO site |
| `next-intl` or `next-i18next` for i18n | More complex to maintain |
| Can do SSG for content pages | Slower builds, more moving parts |

**When this makes sense:** Only if the site will eventually need authenticated areas, dashboards, or complex interactive features beyond a standard informational site.

## Recommendation

**Option A (Astro)** is the best fit. Reasons:

- An NGO site is primarily static content—Astro is purpose-built for this.
- Bilingual routing is a first-class feature.
- $0 hosting cost matters for an NGO.
- Content in Markdown is easy to hand off for translation.
- If non-dev editing is needed, Tina or Decap CMS can be added later without changing the architecture.
- Performance will be dramatically better than Wix.

## Proposed site structure

```
/                     → redirects to /en/ (or /es/ based on browser locale)
/en/                  → Home
/en/about             → About Actra
/en/programs          → Programs / what we do
/en/team              → Team / people
/en/contact           → Contact
/es/                  → Inicio
/es/about             → Sobre Actra
/es/programs          → Programas
/es/team              → Equipo
/es/contact           → Contacto
```

This is a starting point—pages will change as content is defined.

## Extracting content and design from the current Wix site

Since Wix is a fully JS-rendered SPA, traditional scraping tools (wget, HTTrack) produce blank pages. We have admin access, which opens up several better paths. The Wayback Machine is also unreliable for Wix sites.

### Content extraction

**1. Wix REST APIs (best for structured/CMS content)**

With admin access, create an API key in the [API Keys Manager](https://dev.wix.com/docs/rest/articles/get-started/api-keys). Requests need two headers: `Authorization: <api-key>` and `wix-site-id: <site-id>` (found in the dashboard URL).

- **CMS collections:** The [Data Items API](https://dev.wix.com/docs/rest/business-solutions/cms/data-items/introduction) can query any collection. Also exportable as CSV from the dashboard (CMS > Collections > More Actions > Export to CSV).
- **Blog posts:** The [Blog Posts API](https://dev.wix.com/docs/rest/business-solutions/blog/posts-stats/list-posts) returns up to 100 posts per request with full rich content if you request the `RICH_CONTENT` field.
- **Contacts/CRM:** Exportable as CSV from the dashboard.

**Limitation:** These APIs only cover CMS-backed content. Static page content (text/images placed directly in the Wix Editor, not from a collection) is stored in Wix's proprietary format and is **not exposed by any API**.

**2. Playwright scraping (best for static page content)**

Since Wix renders everything client-side, we need a real browser. Playwright (96% success rate on JS-heavy sites) is the best tool:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://www.actra.ngo/some-page")
    page.wait_for_load_state("networkidle")
    content = page.content()   # full rendered HTML
    text = page.inner_text("body")  # just text
```

Workflow: get all page URLs from `actra.ngo/sitemap.xml`, visit each with Playwright, extract text + image URLs from the rendered DOM.

**3. Wix dashboard CSV export (simplest)**

From the Wix dashboard, any CMS collection (blog posts, products, custom collections) can be exported as CSV. This is the easiest path for structured data but won't include static page content or layout.

**4. Third-party tools**

- [CMS2CMS](https://cms2cms.com/) — automated Wix migration, mostly handles blog posts. Paid, essentially automated scraping.
- [wix-blog-export](https://github.com/everappz/wix-blog-export) — open-source Python tool, uses Selenium to scrape blog posts and converts to Markdown.

### Media/asset extraction

**Wix Media Manager REST API (recommended for bulk download)**

- [List files](https://dev.wix.com/docs/api-reference/assets/media/media-manager/introduction) in the media library.
- [Generate Files Download URL](https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/generate-files-download-url) — creates a zip of up to 1,000 files per request.
- [Generate Folder Download URL](https://dev.wix.com/docs/rest/assets/media/media-manager/folders/generate-folder-download-url) — downloads an entire folder as a compressed file.

Script a loop: list all files/folders → generate download URLs → download the zips. This is far better than the dashboard's manual multi-select download, which has no "download all" option.

Alternatively, when scraping pages with Playwright, extract all `<img src>` attributes and `background-image` CSS values (images are served from `static.wixstatic.com`) and batch-download with `curl`.

### Design/aesthetics extraction

**1. Wix CSS variables (most precise)**

Wix exposes its theme as CSS custom properties with the `--wst-` prefix on the rendered page. Extract them via browser DevTools or Playwright:

```javascript
// Run in browser console on the live site
const styles = getComputedStyle(document.documentElement);
const tokens = {};
for (const prop of styles) {
  if (prop.startsWith('--wst-')) {
    tokens[prop] = styles.getPropertyValue(prop).trim();
  }
}
console.log(JSON.stringify(tokens, null, 2));
```

Key variables:
- **Colors:** `--wst-color-fill-background-primary`, `-secondary`, `--wst-color-title`, `--wst-color-text-primary`, `--wst-color-action`, `--wst-color-fill-accent-1` through `-4`, `--wst-color-fill-base-1/2`, `--wst-color-line`
- **Button states:** `--wst-button-color-fill-primary`, `-hover`, `-disabled` (+ border/text variants)
- **Fonts:** `--wst-font-style-h1` through `-h6`, `--wst-font-style-body-large`, `-body-medium`, `-body-small`

**2. Wix Editor panels (admin access)**

Inside the Wix Editor, the **Site Design** panel shows:
- Color theme (primary/secondary backgrounds, text colors, link colors, etc.)
- Text theme (H1–H6 and paragraph font families + sizes)

There is **no export** from these panels—you need to screenshot or manually note the values. But this is the authoritative source.

**3. html.to.design (Wix page → Figma)**

A [Chrome extension](https://chromewebstore.google.com/detail/htmltodesign/ldnheaepmnmbjjjahokphckbpgciiaed) + [Figma plugin](https://www.figma.com/community/plugin/1159123024924461424/html-to-design-by-divriots-import-websites-to-figma-designs-web-html-css) that captures the rendered DOM and imports it as editable Figma layers with auto layout, local styles, and variables. Works on JS-heavy Wix pages because the extension captures from the browser. 12 free imports/month.

This gives you an editable design reference file in Figma—useful if you want to iterate on the design before coding.

**4. Browser extensions for quick extraction**

- [Peek](https://trypeek.app/) — extracts colors, typography, and assets. Exports to CSS, SCSS, Tailwind, JSON. Free, all processing is local.
- [Extract Colors DevTool](https://chromewebstore.google.com/detail/extract-colors-devtool/nfliekkcalinkhldnlpjgfigimdngchm) — extracts typography, color palette, and screenshots.
- [CSS Grabber](https://cssgrabber.com/) — generates a brand style guide with logo, typography, and colors.

**5. Screenshot → code scaffold**

Take full-page screenshots (Chrome DevTools: Cmd+Shift+P > "Capture full size screenshot") and feed them into:
- [v0.dev](https://v0.dev) — outputs React + Tailwind + shadcn/ui (~72% visual accuracy)
- [screenshot-to-code](https://github.com/abi/screenshot-to-code) — open source, outputs HTML/Tailwind/React/Vue, supports Claude and Gemini

These produce a starting scaffold, not pixel-perfect reproductions. Useful for eliminating the blank-canvas problem.

**6. Site archival**

- [ArchiveWeb.page](https://chromewebstore.google.com/detail/webrecorder-archivewebpag/fpeoodllldobpkbkabpblcfaogecpndd) — Chrome extension that records network traffic and stores it as a WARC/WACZ archive. Works on JS-heavy sites. Has specific support for Wix image replay. View archives with [ReplayWeb.page](https://replayweb.page/).
- Full-page screenshots + screen recordings for animated/scroll-effect sections.

### What you won't get

- Wix's internal layout system (grid, sections, containers) is proprietary. The rendered DOM is deeply nested with Wix-specific classes. You'll capture the *output* of the design system but need to rebuild layout structure manually in Tailwind/CSS.
- Animations, parallax, and interactive behaviors need to be observed and reimplemented—they don't extract cleanly.

### Recommended extraction workflow

1. **Archive the live site** with ArchiveWeb.page + full-page screenshots of every page while the site is still up.
2. **Extract design tokens** by running the `--wst-*` CSS variable script in the browser console. Also note colors/fonts from the Wix Editor's Site Design panel.
3. **Capture pages into Figma** using html.to.design (each key page) for a design reference file.
4. **Export CMS content** as CSV from the Wix dashboard, and use the Media Manager API to bulk-download all media assets.
5. **Scrape static page content** with a Playwright script that visits each page from the sitemap and extracts text + image URLs.
6. **(Optional)** Feed screenshots into v0.dev or screenshot-to-code for a code scaffold.

## Implementation steps

1. **Extract current content and design** (see section above).
2. **Set up Astro project** with Tailwind, i18n routing, and a basic layout (header, footer, language switcher).
3. **Design.** Either replicate the current look or create a new design. A simple, clean design with Tailwind is fast to build. Alternatively, use an Astro theme as a starting point.
4. **Build out pages** with placeholder content in both languages.
5. **Content phase.** Work with Actra to finalize copy in both languages. Drop Markdown files into the content directories.
6. **Deploy** to Netlify/Vercel/Cloudflare Pages. Point the `actra.ngo` domain to the new host.
7. **(Optional) Add CMS** if the team wants browser-based editing.

## Open questions

- Does the team want to preserve the current visual design, or is a fresh design preferred?
- Are there any interactive features needed beyond static content (forms, donation, member login)?
- Who will manage translations—will both languages be written by the team, or is one auto-translated?
- Is there a preference for where the site is hosted?
- Does the domain DNS need to stay with the current registrar, or can it move?
