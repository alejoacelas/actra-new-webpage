# actra.ngo rebuild

Rebuilt [actra.ngo](https://www.actra.ngo) from Wix to Astro using Claude Code in two sessions.

**Deployed site:** https://2026-03-08-actra-webpage.vercel.app

**Conversation transcripts:**
1. [Part 1: Extraction and planning](https://gisthost.github.io/?95a79649e7f70bb88838dfc97b60b726/index.html) — screenshot the Wix site, extract design tokens/content, create the implementation plan
2. [Part 2: Implementation and deploy](https://gisthost.github.io/?aaa790f3690604b24c1545b5f03a4552/index.html) — build all pages/components, deploy to Vercel

## What I did

I asked Claude Code to help rebuild actra.ngo from Wix. I pointed it at the live site and accepted its suggestions to use Playwright to screenshot every page, extract design tokens and content, and write an aesthetic guide—so we could replicate the look without manual inspection. It also suggested Astro (which I haven't heard before, but their webpage had the logos of many big companies so seemed good). Then I asked it to organize the directory and plan the full build + Vercel deploy (Vercel is the first option any AI will give you if you ask where to deploy your website).

What's marked above as Part 2 is mostly the Claude following the plan we'd made above (using Plan mode which you get with Shift + Tab) after it asked me a few irrelevant questions.
