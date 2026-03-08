# actra.ngo rebuild

Rebuilt [actra.ngo](https://www.actra.ngo) from Wix to Astro using Claude Code in two sessions.

**Deployed site:** https://2026-03-08-actra-webpage.vercel.app

**Conversation transcripts:**
1. [Part 1: Extraction and planning](https://gisthost.github.io/?95a79649e7f70bb88838dfc97b60b726/index.html) — screenshot the Wix site, extract design tokens/content, create the implementation plan
2. [Part 2: Implementation and deploy](https://gisthost.github.io/?aaa790f3690604b24c1545b5f03a4552/index.html) — build all pages/components, deploy to Vercel

## What I did

Extraction happened in a prior session—screenshots, design tokens, and page content were pulled from the live Wix site using Playwright. For this session, I gave Claude Code a step-by-step implementation plan and let it execute. Key choices I made: 3 pages only (Home, Our Program, Support Us) matching the current site; bilingual EN/ES with localized URL slugs (`/programa`, `/apoyo`); Astro with Tailwind v4 and static output; JSON content files instead of a CMS; Formspree for forms; Vercel for hosting. Design tokens, colors, and typography were extracted from Wix CSS variables to match the original look. The plan included directory reorganization, component architecture, and deployment steps.
