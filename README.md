# HyphenCode - Company Website

Static, dependency-free website for **HyphenCode** (software · scraping · automation · AI). Pure HTML/CSS/JS - no build step, deploys directly to GitHub Pages.

## Folder structure

```
hyphen-code/
├── index.html          # single page, all sections
├── css/
│   └── style.css       # design tokens, layout, animations
├── js/
│   └── main.js         # starfield, carousel, reveals, tilt, magnets, cursor, counters
├── assets/
│   ├── HYPHEN CODE.jpg      # source logo (mark + wordmark) - keep, everything below derives from it
│   ├── mark.png             # triangle mark only, transparent - navbar, footer, hero watermark
│   ├── favicon-32.png       # white mark, for dark browser chrome
│   ├── favicon-32-dark.png  # dark mark, for light browser chrome
│   ├── favicon-512.png      # large icon / social preview
│   ├── apple-touch-icon.png # 180x180, brand background baked in (iOS ignores alpha)
│   └── og-image.jpg         # 1200x630 social card
├── robots.txt
├── sitemap.xml
└── README.md
```

The favicons are generated from `HYPHEN CODE.jpg` by cropping to the mark and
mapping luminance to alpha, so the black backdrop drops out. If the logo ever
changes, regenerate all five - don't hand-edit them.

### Tech stack icons

The `<svg class="sprite">` block at the top of `index.html` holds the brand marks
as `<symbol>`s, referenced by `<use href="#i-slug">`. They're inlined rather than
loaded from a CDN so the site stays dependency-free and works offline.

- Source: [Simple Icons](https://simpleicons.org) (icons CC0; the marks remain
  the trademarks of their respective owners).
- Each path carries its own `fill` with the official brand colour. **Don't set
  `fill` on `.stack__icon` in CSS** - it would beat the presentation attribute
  and flatten every icon to one colour.
- Brand colours too dark to see on `#050505` (Django, curl, OpenAI) are lifted in
  HSL, preserving hue. Colours that are essentially black (Anthropic) invert to
  near-white instead, which is what brand guidelines prescribe on dark grounds.
- Tools with no published mark (BeautifulSoup, Requests, httpx, proxy rotation,
  anti-bot handling) use `#i-mark`, an in-house hyphen glyph that inherits
  `currentColor`.

## Sections

| Section  | What it does |
|----------|--------------|
| Navbar   | Fixed, transparent → blurred glass on scroll; mobile burger menu |
| Hero     | Interactive starfield canvas + rotating "We build …" word carousel |
| Marquee  | Infinite scrolling strip of service keywords |
| Stats    | Projects / experience / response time, count-up on scroll — **placeholder numbers, replace before sharing** |
| Services | 6 angular cards (web, backend, frontend, scraping, automation, AI) with 3D tilt |
| Stack    | Tools grouped by area, each with its brand icon |
| Work     | 4 anonymised project cards — **placeholder copy, replace with real engagements** |
| Process  | 4-step numbered timeline (Scope → Build → Ship → Maintain) |
| Founders | Ahsan Tahir & Muhammad Qais with roles and email links |
| Contact  | Second ambient starfield + mailto CTA to both founders |
| Footer   | Brand, links, auto-updating year |

## Design system

- Palette: `#050505` background, `#0d0d0d` surfaces, `#222` lines, `#ededed` text, `#9a9a9a` grey
- Fonts: Chakra Petch (display), Manrope (body), JetBrains Mono (labels) via Google Fonts
- Signature: the **hyphen** as a recurring motif, and an angular corner-notch (`clip-path`) on cards/buttons echoing the logo's cut geometry
- Alt sections sit on a slab skewed `-1.1deg`, so section edges cut diagonally like the logo's angles (flattened under 760px)
- Custom cursor (dot + trailing ring) on fine-pointer devices only
- `prefers-reduced-motion` fully respected — it disables the preloader, cursor, watermark drift and count-up

## Accessibility notes

- `--dim` is the lightest colour that still clears WCAG AA on `--surface` (4.53:1). Don't darken it — it's used for 11–13px text where the large-text exemption doesn't apply.
- The mobile menu uses `visibility: hidden` when closed, not just `translateY`. A translated menu keeps its links in the tab order and traps keyboard users on off-screen items.
- The hero carousel is `aria-live="off"` on purpose: it rotates forever, and announcing it would hijack a screen reader for the whole visit.
- `:focus-visible` is styled with an offset outline so it clears the `clip-path` notch on buttons.

## Run locally

Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/<your-username>/hyphen-code.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
Site goes live at `https://<your-username>.github.io/hyphen-code/` within ~2 minutes.

### Custom domain

1. Settings → Pages → Custom domain → enter `hyphencode.com` → Save (this creates a `CNAME` file).
2. At your DNS provider:
   - `A` records for apex domain → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `<your-username>.github.io`
3. Back in Pages settings, tick **Enforce HTTPS** once the certificate is issued.
