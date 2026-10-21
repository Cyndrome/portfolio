# 🌐 Personal Portfolio Template

A modern, responsive, single-page portfolio for a Computer Science undergraduate.
Built with plain **HTML, CSS and JavaScript** — no frameworks, no build step.
Dark/light theme, animated particles, typing effect, project filters, and a
working contact form (via Formspree).

---

## 📁 Project structure

```
.
├── index.html          ← all content lives here (5 sections)
├── css/
│   └── style.css       ← design + theme (colours are CSS variables at the top)
├── js/
│   └── main.js         ← all interactivity (numbered, independent blocks)
├── assets/
│   └── favicon.svg     ← browser tab icon
├── CNAME               ← your custom domain (for GitHub Pages)
├── robots.txt          ← tells search engines what to crawl
├── sitemap.xml         ← search-engine sitemap
├── .gitignore
└── README.md
```

---

## 🚀 Run it locally

**Option A — just open it.** Double-click `index.html`. Everything works.

**Option B — a tiny local server** (closer to how GitHub Pages serves it).
From this folder, run *one* of:

```bash
# Python (usually preinstalled on macOS/Linux; on Windows via the Store or python.org)
python -m http.server 8000

# or, if you have Node.js
npx serve .
```

Then open <http://localhost:8000> in your browser.

---

## ✏️ Step 1 — Fill in the placeholders

Every placeholder looks like `{{LIKE_THIS}}`. The fastest way:

> Open `index.html` in your editor and **search for `{{`** — it will jump you
> through every spot that needs changing. A few also live in `CNAME`,
> `robots.txt` and `sitemap.xml`.

### Master placeholder list

| Placeholder | What to put there | Where it appears |
|---|---|---|
| `{{YOUR_NAME}}` | Your full name (e.g. *Jane Doe*) | Title, hero, about, footer, meta tags |
| `{{YOUR_INITIALS}}` | 1–2 letters (e.g. *JD*) — shown in the navbar logo and the avatar | Navbar, About photo fallback, favicon is a generic `</>` |
| `{{UNIVERSITY_NAME}}` | Your university | Hero blurb, about paragraph, code card |
| `{{CITY_COUNTRY}}` | Where you are (e.g. *Dhaka, Bangladesh*) | Code card, About facts, Contact info |
| `{{YOUR_EMAIL}}` | Your email address | Hero social icon, Contact section, `mailto:` link |
| `{{GITHUB_USERNAME}}` | GitHub handle (just the username) | Hero, project links, footer "more" link, Contact |
| `{{LINKEDIN_USERNAME}}` | LinkedIn handle — the part after `linkedin.com/in/` | Hero, Contact |
| `{{TWITTER_USERNAME}}` | X/Twitter handle (delete that `<a>` block if you don't use it) | Contact |
| `{{YOUR_DOMAIN}}` | Your custom domain (e.g. *janedoe.com*) | `CNAME`, meta tags, `robots.txt`, `sitemap.xml` |
| `{{GRADUATION_YEAR}}` | Expected graduation year | About facts |
| `{{SPOKEN_LANGUAGES}}` | e.g. *English, Bangla* | About facts |
| `{{CURRENTLY_LEARNING}}` | e.g. *React and DSA* | Hero blurb, code card |
| `{{INTEREST}}` | A third interest for the code card | Hero code card |
| `{{FUN_FACT}}` | One line of trivia about you | Hero code card |
| `{{FORM_ID}}` | Formspree form ID — see Step 3 | Contact form `action` |

**Add your photo:** in the About section there's a placeholder SVG avatar
(marked with a `TODO` comment). Replace the whole `<svg>…</svg>` inside
`<div class="avatar-frame">` with:

```html
<img src="assets/me.jpg" alt="Portrait of Jane Doe" />
```

and drop your photo into the `assets/` folder as `me.jpg` (square, ~400×400 px
or larger looks best).

---

## 🧩 Step 2 — Customise the content

All of these are simple find-and-edit jobs in `index.html`:

- **Typing animation phrases** — in the hero, find
  `data-roles='["Computer Science student.", …]'` and edit the list.
- **Skills chips** — the About section has two chip groups (Languages /
  Web & Tools). Add or remove `<li class="chip">Name</li>` freely.
- **Stats counters** — each stat has `data-count="10"` and `data-suffix="+"`;
  change the numbers (Projects Built, Hours of Coding, …).
- **Projects** — there are 6 sample `<article class="project-card">` blocks.
  Edit title, description, links and tech chips. To add a 7th, copy a whole
  `<article>` block. Each card's `data-category` must be one of
  `web`, `app`, `ml`, `other` so the filter buttons work.
- **Project banners** — each card has a gradient banner class
  (`banner-1` … `banner-6`) and an emoji. Colours live in `css/style.css`
  under the "Each banner has its own gradient" comment.
- **Hobbies** — six sample cards; copy/edit/remove freely.

### Change the colour scheme

Open `css/style.css` — every colour is a CSS variable at the very top:

```css
:root {
  --accent: #22d3ee;    /* cyan  */
  --accent-2: #a78bfa;  /* violet */
}
```

Change those two (and their light-theme versions in `[data-theme="light"]`)
and the whole site — buttons, glows, links, progress bar — follows along.

---

## 📮 Step 3 — Connect the contact form

The form uses [Formspree](https://formspree.io) (free tier: 50 submissions/month,
no server needed).

1. Create a free account at formspree.io and click **New form**.
2. Name it (e.g. "Portfolio contact") and enter **your email address** —
   submissions are forwarded there. Formspree will email you a confirmation
   link the first time, so confirm it.
3. Copy your form ID from the generated endpoint — it looks like
   `https://formspree.io/f/xpzvqwer` → the ID is `xpzvqwer`.
4. In `index.html`, replace `{{FORM_ID}}` in the form's `action` attribute.

That's it — until you do this, the form runs in **demo mode**: it validates
fields and shows a "sent" toast but doesn't send anything anywhere.

---

## 📦 Step 4 — Push to GitHub

```bash
# inside this folder
git init
git add .
git commit -m "Initial portfolio"
git branch -M main

# create an empty repo named e.g. "portfolio" on github.com first, then:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/portfolio.git
git push -u origin main
```

---

## 🌍 Step 5 — Deploy to GitHub Pages with your custom domain

1. **Repo settings** — on GitHub, go to your repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, pick **Deploy from a branch**,
   then choose branch `main` and folder `/ (root)`. Click **Save**.
3. Under **Custom domain**, type your domain (e.g. `janedoe.com`) and save.
   GitHub writes/validates the `CNAME` file that's already in this repo.
4. **DNS records** — at your domain registrar, add (removing conflicting old
   records):

   | Type | Name/Host | Value |
   |---|---|---|
   | `A` | `@` | `185.199.108.153` |
   | `A` | `@` | `185.199.109.153` |
   | `A` | `@` | `185.199.110.153` |
   | `A` | `@` | `185.199.111.153` |
   | `CNAME` | `www` | `<YOUR_GITHUB_USERNAME>.github.io` |

   DNS can take from a few minutes up to 24–48 h to propagate.
5. Back in **Settings → Pages**, once the DNS check passes, tick
   **Enforce HTTPS** (it may take a few minutes for the certificate to be issued).
6. Visit your domain — your site should be live. 🎉

> **Apex vs www:** using `janedoe.com` (the A records above) serves the site at
> the bare domain and redirects `www.` to it. Either works — the `CNAME` file
> content decides which one GitHub treats as canonical.

### Updating the site later

Just edit, commit, push — GitHub Pages redeploys automatically (usually within
a minute or two):

```bash
git add .
git commit -m "Update projects"
git push
```

---

## ✨ Features included

- 🌗 **Dark / light theme** with a toggle; respects OS preference, remembers your choice
- ⌨️ **Typing animation** in the hero
- 🫧 **Particle network background** (canvas, pauses when the tab is hidden)
- 🖱️ **3D tilt** on project cards, hover effects everywhere
- 🔍 **Project filtering** by category
- 🔢 **Animated stat counters** on scroll
- 📮 **Contact form** with real-time validation + Formspree integration (demo mode until configured)
- 📱 **Fully responsive** — mobile drawer menu, tablet and phone layouts
- ♿ **Accessible** — keyboard navigation, skip link, ARIA labels, reduced-motion support
- 📈 **SEO basics** — meta description, Open Graph tags, robots.txt, sitemap.xml

## 🛠 Built with

Plain HTML5, CSS3 and vanilla JavaScript. Fonts from Google Fonts
(Inter, Space Grotesk, JetBrains Mono). No build step, no dependencies.

---

Made as a template — fill it in and make it yours. Good luck with the degree! 🎓
