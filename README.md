# actra.ngo rebuild

Rebuilt [actra.ngo](https://www.actra.ngo) from Wix to Astro using Claude Code in two sessions.

**Deployed site:** https://2026-03-08-actra-webpage.vercel.app

**Conversation transcripts:**
1. [Part 1: Extraction and planning](https://gisthost.github.io/?95a79649e7f70bb88838dfc97b60b726/index.html) — screenshot the Wix site, extract design tokens/content, create the implementation plan
2. [Part 2: Implementation and deploy](https://gisthost.github.io/?aaa790f3690604b24c1545b5f03a4552/index.html) — build all pages/components, deploy to Vercel

## What I did

In session 1, I asked Claude Code to help rebuild actra.ngo from Wix. I pointed it at the live site and told it to use Playwright to screenshot every page, extract design tokens and content, and write an aesthetic guide—so we could replicate the look without manual inspection. I chose Astro with Tailwind v4 and asked it to set up bilingual EN/ES routing. Then I asked it to organize the directory and plan the full build + Vercel deploy.

In session 2, I gave it the implementation plan from session 1 and let it execute end-to-end. Key choices I made along the way: 3 pages only (Home, Our Program, Support Us) matching the current site; localized URL slugs (`/programa`, `/apoyo`); JSON content files instead of a CMS; Formspree for forms; Vercel for hosting. Claude Code built all components, downloaded images from Wix CDN, wired up language switching, and deployed—I mostly just approved tool calls.
