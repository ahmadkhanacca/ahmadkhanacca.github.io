# Ahmad Khan — Portfolio ("The Deal Cosmos")

An interactive, single-page portfolio for **Ahmad Khan, ACCA** — Deal Advisory / M&A finance professional.
Built with vanilla HTML, CSS and JavaScript plus **Three.js** for the WebGL cosmic background. No build step, no framework lock-in — drop it on GitHub Pages and it's live 24/7.

---

## ✨ What's inside

- **WebGL galaxy background** (Three.js): drifting star field + wireframe geometry with mouse parallax
- **Live ticker** of real career metrics (Bloomberg-style)
- **Animated counters, skill bars, and an SVG competency radar**
- **Scroll-reveal** animations via IntersectionObserver
- **Dark / light theme** toggle (remembers your choice)
- **Live Lahore clock** + rotating "signal" quotes
- **Procedural ambient audio** toggle (generated with the Web Audio API — no audio file required)
- **Contact form** wired for Formspree, with client-side validation
- **Scripted AK Assistant** chatbot (answers FAQs offline — no API key)
- **Downloadable résumé** (PDF included)
- SEO meta tags, Open Graph, JSON-LD `Person` schema
- Accessible: skip link, ARIA labels, keyboard focus, `prefers-reduced-motion` respected
- Fully responsive (desktop / tablet / mobile)

---

## 📁 Structure

```
.
├── index.html              # all markup
├── assets/
│   ├── css/styles.css      # all styling + themes
│   ├── js/main.js          # all interactivity (Three.js, charts, form, assistant)
│   └── files/
│       └── Ahmad_Khan_Resume.pdf
├── .nojekyll               # tells GitHub Pages to serve files as-is
└── .github/workflows/deploy.yml   # optional auto-deploy
```

---

## 🚀 Deploy on GitHub Pages (5 minutes)

1. Create a new repository. For a personal site at `https://USERNAME.github.io`, name it **`USERNAME.github.io`**. Any other name gives `https://USERNAME.github.io/repo-name/`.
2. Upload **all files in this folder** to the repo (keep the folder structure).
3. In the repo: **Settings → Pages → Build and deployment**.
   - Source: **Deploy from a branch**
   - Branch: **main** / root (`/`)
4. Wait ~1 minute. Your site is live at the URL shown on that page.

> The included GitHub Actions workflow (`.github/workflows/deploy.yml`) also works — if you prefer it, set Pages source to **GitHub Actions** instead of a branch.

---

## ✏️ Things to personalize (search & replace)

| What | Where | Replace |
|------|-------|---------|
| **Contact form** | `index.html` → `<form action="https://formspree.io/f/YOUR_FORM_ID">` | Your real Formspree form ID |
| **LinkedIn / GitHub links** | `index.html` → `.socials` and `#contact` (look for `href="#"`) | Your profile URLs |
| **Canonical / OG URLs** | `index.html` `<head>` → `your-username.github.io` | Your real domain |
| **Google Analytics** | `index.html` `<head>` → commented GA block + `G-XXXXXXX` | Your GA4 ID, then uncomment |

### Connect the contact form (Formspree, free)
1. Sign up at [formspree.io](https://formspree.io) and create a form.
2. Copy your form endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. Paste the ID into the form `action` in `index.html`. Done — submissions arrive in your email.

Until you do this, the form shows a friendly "not connected yet" message instead of failing silently.

---

## 🔄 Updating content later

All copy lives in `index.html` under clearly-labelled `<section>` blocks (About, Impact, Skills, Experience, Engagements, Education, Contact). Edit the text, commit, and GitHub Pages redeploys automatically.

- **Add a metric:** copy a `<article class="metric">` block and edit the `data-count`, `data-prefix`, `data-suffix`.
- **Add a timeline role:** copy a `<li class="tl-item">` block.
- **Tune skill levels:** change `data-level="92"` on any `.skill`.
- **Replace the résumé:** drop a new PDF at `assets/files/Ahmad_Khan_Resume.pdf` (same name) or update the two download links.

---

## 🛠 Tech notes

- Three.js is loaded from a pinned CDN (`r128`). No npm install needed.
- The ambient sound is synthesized in the browser, so there's no copyrighted track to license.
- Animations automatically disable for visitors who set "reduce motion" in their OS.

---

## License

Personal portfolio content © Ahmad Khan. Code is yours to reuse and adapt.
