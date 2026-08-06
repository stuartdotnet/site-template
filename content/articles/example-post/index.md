---
title: "Welcome to Your New Site"
date: 2026-08-06T09:00:00+10:00
draft: false
description: "A quick tour of what this template gives you out of the box, and what to change first."
tags: ["Getting Started", "Design"]
authors: ["jane-doe"]
image: ""               # filename of an image in THIS folder, e.g. "hero.jpg". Leave "" for the placeholder thumbnail.
---

This is a sample article so the Articles list, tag pages, and author profile aren't empty on first run. Edit or delete it once you have real content.

## What's already wired up

- **Tags** — every tag above is a real link to a `/tags/<name>/` archive page listing everything with that tag. Try clicking one.
- **Authors** — the byline below is a real profile at `/authors/jane-doe/`, with its own bio and a list of everything they've written.
- **SEO** — title, meta description, Open Graph tags, Twitter card, canonical URL, and JSON-LD structured data are all derived automatically from this front matter. You rarely need to touch `layouts/partials/head.html`.
- **Images** — drop a file next to this one and reference it by filename (no path) to get automatic resizing, WebP conversion, and a caption if you add a Markdown title.

## What to change first

1. Edit `hugo.toml` — site title, tagline, description, social links.
2. Replace or delete this article and the sample author in `content/authors/jane-doe/`.
3. Swap the color tokens at the top of `static/css/styles.css` if you want a different palette — everything else references those variables.
4. Wire up the contact form in `layouts/_default/contact.html` (see the note in `scripts.js`).

That's it — no build step, no dependencies beyond Hugo itself.
