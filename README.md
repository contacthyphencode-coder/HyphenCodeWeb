# Hyphen Code - Company Website

Static, dependency-free website for **Hyphen Code** (software · scraping · automation · AI). Pure HTML/CSS/JS - no build step, deploys directly to GitHub Pages.

## Folder structure

```
hyphen-code/
├── index.html          # single page, all sections
├── css/
│   └── style.css       # design tokens, layout, animations
├── js/
│   └── main.js         # starfield, carousel, reveals, tilt, magnetic buttons
├── assets/
│   └── logo.png        # brand logo (also used as favicon)
└── README.md
```

## Sections

| Section  | What it does |
|----------|--------------|
| Navbar   | Fixed, transparent → blurred glass on scroll; mobile burger menu |
| Hero     | Interactive starfield canvas + rotating "We build …" word carousel |
| Marquee  | Infinite scrolling strip of service keywords |
| Services | 6 angular cards (web, backend, frontend, scraping, automation, AI) with 3D tilt |
| Process  | 4-step numbered timeline (Scope → Build → Ship → Maintain) |
| Founders | Ahsan Tahir & Muhammad Qais with roles and email links |
| Contact  | Second ambient starfield + mailto CTA to both founders |
| Footer   | Brand, links, auto-updating year |

## Design system

- Palette: `#050505` background, `#0d0d0d` surfaces, `#222` lines, `#ededed` text, `#9a9a9a` grey
- Fonts: Chakra Petch (display), Manrope (body), JetBrains Mono (labels) via Google Fonts
- Signature: the **hyphen** as a recurring motif, and an angular corner-notch (`clip-path`) on cards/buttons echoing the logo's cut geometry
- `prefers-reduced-motion` fully respected

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
