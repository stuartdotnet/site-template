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

## Content editing (CMS)

`/contenteditor/` is a [Sveltia CMS](https://github.com/sveltia/sveltia-cms) editor for
non-technical editors: log in with GitHub, edit articles/authors/about/contact
in forms, hit Save. Behind the scenes it commits straight to `main` (no draft
step) and Cloudflare Pages rebuilds from that commit, same as any other push.
`hugo.toml` — title, tagline, social links, menu, markup/security config — is
deliberately **not** exposed there and stays a code change; see
`static/contenteditor/config.yml`'s header comment for why.

The folder is named `contenteditor` rather than the more common `admin` —
Sveltia doesn't care what it's called, it's just a static folder with an
`index.html` and a `config.yml`. Renaming it is safe and has no effect on the
GitHub OAuth flow, which is keyed to the Worker's own `/callback` path, not
this one.

### One-time setup (shared across every house-stack site — do this once, not per clone)

Sveltia has no built-in auth backend the way Netlify Identity does, so GitHub
OAuth needs a small relay. [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth)
is the CMS author's own Cloudflare Worker built for exactly this:

1. Deploy that repo to Cloudflare Workers (the README has a one-click deploy
   button, or clone it and run `wrangler deploy`).
2. Note the Worker URL — `https://sveltia-cms-auth.<subdomain>.workers.dev`.
3. Create a GitHub OAuth App at
   [github.com/settings/developers](https://github.com/settings/developers):
   homepage URL = the Worker URL, authorization callback URL = `<worker URL>/callback`.
4. In the Worker's settings (dashboard → Settings → Variables, or `.dev.vars`
   locally), set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from that OAuth
   App, and optionally `ALLOWED_DOMAINS` to a comma-separated list of every
   site's hostname that will use it.

Reuse this one Worker and OAuth App for every site on the stack — add a new
site's domain to `ALLOWED_DOMAINS` rather than standing up a second one.

### Per-site setup (do this for every clone, same as `baseURL`)

In `static/contenteditor/config.yml`, replace the two placeholders:

```yaml
backend:
  repo: OWNER/REPO-NAME       # this site's GitHub repo
  base_url: https://sveltia-cms-auth.<subdomain>.workers.dev   # the shared Worker
site_url: https://example.com # must match hugo.toml's baseURL
```

`bash "C:/Code/.claude/skills/site-build/scripts/preflight.sh"` catches either
placeholder left unset, the same way it catches an unset `baseURL`.

An editor needs push access to the site's GitHub repo — there is no separate
CMS user list; GitHub permissions *are* the permission system.

### Trying it before any of the above is deployed

`hugo server`, then open `http://localhost:1313/contenteditor/` in Chrome or Edge and
click **Work with Local Repository** (needs a Chromium browser — this uses the
File System Access API, not Firefox/Safari-compatible). It edits the working
copy on disk directly, no GitHub or Worker required, which is enough to check
that the collections and fields in `config.yml` are sane before wiring up
real auth.

## What's deliberately not here

Videos, a resources/links directory, and a shop page existed in the site
this was templated from but are specific enough to one use case that they're
not included here. Add a new content section and layout the same way
`articles/` is built if a future site needs one.
