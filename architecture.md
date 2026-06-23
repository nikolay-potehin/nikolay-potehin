# Portfolio Website

A personal portfolio website built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

## Structure

```
portfolio-website/
├── index.html              # Main portfolio page
├── css/
│   └── style.css           # All styles (dark/light theme, responsive)
├── js/
│   └── main.js             # Theme toggle, contact modal, email copy
├── assets/
│   └── images/             # Avatars, cover images, favicon (add these)
├── docs/
│   ├── index.html          # Document hub (view PDFs in browser)
│   ├── resume.pdf          # Your resume (add this)
│   └── certificates/       # Certificates and awards
├── placeholders.txt        # List of all placeholders to fill in
└── README.md
```

## Getting started

1. Open `placeholders.txt` and replace every `PLACEHOLDER_*` value with your real data.
2. Add your images to `assets/images/` (see `placeholders.txt` for the full list).
3. Add your `resume.pdf` to `docs/` and any certificates to `docs/certificates/`.
4. Open `index.html` in a browser, or serve locally:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source: Deploy from branch**, **Branch: main**, **Folder: / (root)**.
4. Save — your site goes live at `https://<username>.github.io/<repo>/`.

> All links use relative paths (`./docs/...`) so they work on GitHub Pages project sites.

## Features

- Dark/light theme toggle with system preference detection and localStorage persistence
- Responsive layout (desktop, tablet, mobile)
- Contact modal with email copy-to-clipboard
- Accessible navigation, ARIA labels, keyboard support (Esc to close modal)
- Document hub at `/docs/` for viewing PDFs in-browser
- No dependencies — just static files