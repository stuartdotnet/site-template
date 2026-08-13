# Site Template

A lightweight Hugo starter for content sites: articles with tags and author
profiles, full SEO metadata, social links, and an unwired contact form. No
build step, no JS framework, no webfonts, no shipped images — clone it,
rename it, and start editing.

## Use this for a new site

1. Copy this folder to a new name.
2. Edit `hugo.toml` — title, tagline, description, `baseURL`, and the social
   links under `[params.social]` (delete any platform you don't use).
3. Replace the sample content:
   - `content/articles/example-post/` — delete or overwrite
   - `content/authors/jane-doe/` — delete or overwrite; rename the folder to
     match the slug you reference in an article's `authors:` front matter
   - `content/about.md`, `content/contact.md` — swap the placeholder copy
   - `content/photography/index.md` — drop photos into the folder and list
     them in the `photos` front matter, or delete the whole `photography/`
     folder and its `[[menu.main]]` entry in `hugo.toml` if a given site has
     no use for a gallery
4. Wire up the contact form — it's intentionally not connected to anything.
   See the comment in `static/js/scripts.js` and either post to a form
   service (Formspree, Netlify Forms) or your own backend.
5. Re-theme if you want — every color and font in `static/css/styles.css` is
   a CSS custom property at the top of the file. Nothing below it should
   need to change for a basic re-skin.

## Run it

```
hugo server -D
```

`-D` includes draft content. Drop it for a production-like preview.

## Deploy it

Build command `hugo --gc --minify`, output directory `public`.

**Pin the Hugo version on your host.** `.tool-versions` pins it for build images
that read the file, but most hosts also want an environment variable — on
Cloudflare Pages set `HUGO_VERSION` to match. Hosts default to a much older Hugo
than you're likely running locally, and the mismatch fails the build or silently
changes output. This template's `locale` key in `hugo.toml`, for instance, only
exists from Hugo 0.158; an older build ignores it and drops the language
attribute from the RSS feed and sitemap.

Bump the version in `.tool-versions` and the host variable together.

## How content is organized

- **Articles** (`content/articles/`) are the one content type. Each is a page
  bundle (`index.md` in its own folder) so images can live beside the text.
- **Tags** and **authors** are both Hugo taxonomies, not hand-built pages —
  every tag and every author automatically gets an archive page listing their
  articles. Author archive pages are richer: `content/authors/<slug>/_index.md`
  holds a bio, an optional avatar, and social links, and doubles as that
  author's profile page.
- Authors without an `avatar` image get a generated initials mark instead —
  the template ships with zero binary image assets by default.
- `about.md` and `contact.md` are plain top-level pages using a `layout:`
  override (see their front matter) rather than a section.
- **Photography** (`content/photography/`) is a single page bundle, not a
  section with a listing page — there's one gallery, not a directory of
  them. Each photo is an entry in the `photos` front-matter list (`image`
  is the filename, sitting in the same folder as `index.md`; `alt` is
  required; `caption` is optional). Hugo generates a grid thumbnail and a
  larger lightbox image per photo at build time — drop in the original
  file and don't pre-resize it. Ships with `photos: []` and zero image
  files, consistent with the rest of the template; the page renders an
  empty state until photos are added. The grid (`.gallery-grid`) and the
  native `<dialog>` lightbox (`static/js/scripts.js`) are both no-ops with
  nothing to select if you delete the folder — see step 3 above to remove
  the feature entirely.

## What's deliberately not here

Videos, a resources/links directory, and a shop page existed in the site
this was templated from but are specific enough to one use case that they're
not included here. Add a new content section and layout the same way
`articles/` is built if a future site needs one.
