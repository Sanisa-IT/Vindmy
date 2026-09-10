# Vindmy Website UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Vindmy marketing site into a modern editorial product site (dark photographic hero, light rest of site) while keeping brand colors, all existing images/copy, and leaving support/verification form JS untouched.

**Architecture:** Static multi-page HTML under `Site/`. One rebuilt `Site/css/styles.css` (design tokens + page sections). Shared nav/footer markup patterns on every page. Homepage restructured into hero → product strip → get-the-app → safer connections. Inner pages restyled in place. Only isolated CTA-alert removal in `script.js`; form submit handlers stay byte-identical.

**Tech Stack:** HTML5, CSS3 (custom properties, flex/grid, media queries), existing `Site/js/script.js`, Manrope via Google Fonts, YouTube iframe embeds, iubenda iframes.

## Global Constraints

- Brand colors only as accents: `#2563EB`, `#06B6D4`, `#7C3AED` — no full-bleed cyan/purple section walls.
- Reuse existing images only; no new photo assets.
- Keep every current sentence/label somewhere on the site.
- Do **not** change support/verification submit handlers, FormData logic, reCAPTCHA checks, fetches to `/support` or `/verification`, URL autofill, or Profile example-modal script.
- Keep form IDs/names: `#supportForm`, `#submitButton`, `#supportStatus`, `#verificationForm`, `#submitBtn`, `#verificationStatus`, and all field `id`/`name`s.
- Mobile-first responsive; spot-check ~375 / 768 / 1024 / 1440; no horizontal scroll; touch targets ≥44px.
- Respect `prefers-reduced-motion`.
- Branch: `ui-overhaul`. Commit after each task.

## File map

| File | Responsibility |
|---|---|
| `Site/css/styles.css` | Full visual system rebuild (tokens, chrome, all page sections, responsive, motion) |
| `Site/index.html` | Homepage structure (hero, product strip, app, solutions, footer) |
| `Site/Pages/about.html` | About layout |
| `Site/Pages/Contact.html` | Support form layout (IDs preserved) |
| `Site/Pages/Profile.html` | Verification form layout (IDs preserved) |
| `Site/Pages/FAQ.html` | FAQ accordion on light canvas |
| `Site/Pages/HowTo.html` | Dummy YouTube grid |
| `Site/Pages/DeleteAccount.html` | Delete-account content column |
| `Site/Pages/privacy.html` | Privacy iframe chrome |
| `Site/Pages/ts&cs.html` | Terms iframe chrome |
| `Site/js/script.js` | **Only** remove `.cta-btn` alert hijack; leave form blocks untouched |

---

### Task 1: Design tokens + base + shared chrome CSS

**Files:**
- Modify: `Site/css/styles.css` (replace/rebuild from top; keep later section class names used by HTML until subsequent tasks update markup)
- Test: visual via local static server + browser

**Interfaces:**
- Consumes: existing class names `.navbar`, `.nav-container`, `.logo`, `.logo-text`, `.menu-toggle`, `.nav-links`, `.site-footer`, `.footer-grid`, `.container`
- Produces: CSS variables `--color-primary`, `--color-accent`, `--color-secondary`, `--color-canvas`, `--color-ink`, `--color-footer`, `--font-sans`, spacing scale; light nav + charcoal footer; mobile drawer

- [ ] **Step 1: Backup note — open styles and rewrite `:root` + base**

Replace the design-system block at the top of `Site/css/styles.css` with:

```css
:root {
  --color-primary: #2563EB;
  --color-accent: #06B6D4;
  --color-secondary: #7C3AED;
  --color-ink: #0F172A;
  --color-ink-muted: #475569;
  --color-canvas: #F7F8FA;
  --color-surface: #FFFFFF;
  --color-footer: #0B1220;
  --color-hero-scrim: rgba(4, 2, 8, 0.45);
  --font-sans: "Manrope", system-ui, sans-serif;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-pill: 999px;
  --shadow-soft: 0 12px 40px rgba(15, 23, 42, 0.08);
  --nav-height: 72px;
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-5: 3rem;
  --space-6: 4.5rem;
  --max-width: 1120px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--color-canvas);
  color: var(--color-ink);
  line-height: 1.6;
  min-height: 100%;
  overflow-x: hidden;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: var(--color-primary);
}

.container {
  width: min(var(--max-width), 100%);
  margin: 0 auto;
  padding: 0 var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Keep aliases if needed for gradual migration:

```css
:root {
  --primary: var(--color-primary);
  --accent: var(--color-accent);
  --secondary: var(--color-secondary);
  --dark: var(--color-ink);
  --white: #FFFFFF;
}
```

- [ ] **Step 2: Restyle navbar (light, not cyan fill)**

```css
nav.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(247, 248, 250, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  padding: 0;
}

body.home-page nav.navbar {
  position: absolute;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(4, 2, 8, 0.55), transparent);
  border-bottom: none;
}

body.home-page .nav-links li a,
body.home-page .logo-text {
  color: #fff;
}

body.home-page .menu-toggle span {
  background: #fff;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--nav-height);
  gap: var(--space-2);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: inherit;
}

.logo img {
  height: 48px;
  width: auto;
}

.logo-text {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--color-ink);
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.nav-links li a {
  text-decoration: none;
  color: var(--color-ink);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.nav-links li a:hover,
.nav-links li a:focus-visible,
.nav-links li a[aria-current="page"] {
  color: var(--color-secondary);
}

.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: 12px;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-ink);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    left: auto;
    height: 100vh;
    width: min(300px, 86vw);
    background: var(--color-surface);
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 96px var(--space-4) var(--space-4);
    transform: translateX(105%);
    transition: transform 0.3s ease;
    box-shadow: var(--shadow-soft);
    z-index: 1050;
  }

  .nav-links.active {
    transform: translateX(0);
  }

  .nav-links li a {
    color: var(--color-ink);
    width: 100%;
  }
}
```

Remove old cyan `#06B6D4` navbar fills and purple `#7C3AED` mobile drawer backgrounds wherever they remain in this file later in the task (search and replace those rules).

- [ ] **Step 3: Restyle footer (charcoal, not cyan)**

```css
.site-footer {
  background: var(--color-footer);
  color: #E2E8F0;
  text-align: left;
  padding: var(--space-5) var(--space-3) var(--space-3);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.footer-grid h4 {
  color: #fff;
  margin: 0 0 var(--space-2);
  font-size: 0.95rem;
}

.footer-grid ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-grid li {
  margin-bottom: 0.5rem;
}

.footer-grid a {
  color: #CBD5E1;
  text-decoration: none;
}

.footer-grid a:hover {
  color: var(--color-accent);
}

.social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: var(--space-2);
}

.social-icons img {
  height: 24px;
  width: auto;
}

.store-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.store-buttons img {
  height: 40px;
  margin: 0;
}

.footer-divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  margin: var(--space-3) 0;
}

.site-footer > p {
  text-align: center;
  color: #94A3B8;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .social-icons,
  .store-buttons {
    justify-content: center;
  }
}
```

- [ ] **Step 4: Verify chrome on an existing page**

Run from repo:

```bash
cd Site && python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/Pages/about.html` — nav should be light (not cyan wall); footer dark charcoal. Mobile width: hamburger opens light panel.

Expected: no purple full-screen drawer; logo readable.

- [ ] **Step 5: Commit**

```bash
git add Site/css/styles.css
git commit -m "Rebuild base design tokens, nav, and footer styles."
```

---

### Task 2: Homepage HTML + hero / sections CSS

**Files:**
- Modify: `Site/index.html`
- Modify: `Site/css/styles.css`
- Test: browser homepage desktop + mobile

**Interfaces:**
- Consumes: chrome from Task 1; images under `Site/Images/`
- Produces: `body.home-page`; sections `.hero-section`, `.product-strip`, `.app-section`, `.solutions-section`; product cards without marquee duplicates

- [ ] **Step 1: Update `index.html` shell**

- Add `class="home-page"` on `<body>`.
- Ensure Manrope + `css/styles.css` links remain.
- Mark Home nav link with `aria-current="page"`.
- Keep all existing wording and image paths listed in the spec.

- [ ] **Step 2: Replace hero markup**

Hero must contain only brand-adjacent existing copy + one CTA (nav already has logo):

```html
<main>
  <section class="hero-section" aria-label="Welcome">
    <div class="hero-scrim"></div>
    <div class="container hero-content">
      <h1>Welcome to Vindmy</h1>
      <p>The New Way Of Connecting People</p>
      <a
        href="https://play.google.com/store/apps/details?id=com.ads.vindmy"
        class="cta-btn"
        target="_blank"
        rel="noopener noreferrer"
        >Get Started</a
      >
    </div>
  </section>
```

- [ ] **Step 3: Replace services marquee with product strip (nine screens once)**

Use existing images/labels exactly once (no duplicate track for infinite scroll):

| Label | Image |
|---|---|
| SIGN UP | `Images/Sign up.png` |
| COMPLETE ACCOUNT | `Images/Complete account.png` |
| CONNECT | `Images/Connect.png` |
| VIEW USER | `Images/View users2.png` |
| LIKE USER | `Images/Like users.png` |
| MESSAGE | `Images/Messages.png` |
| SEARCH | `Images/Search Users.png` |
| CHATS | `Images/Communicate.png` |
| TRAVEL SAFE | `Images/Girls.png` |

Header text to keep: `VindMy` and `Where meaningful connections begin.`

Structure:

```html
<section class="product-strip">
  <div class="container">
    <header class="product-strip-header">
      <h2>VindMy</h2>
      <p>Where meaningful connections begin.</p>
    </header>
    <div class="product-strip-track" tabindex="0">
      <!-- one .product-card per row in the table above -->
      <figure class="product-card">
        <img src="Images/Sign up.png" alt="Sign up screen" />
        <figcaption>SIGN UP</figcaption>
      </figure>
      <!-- ... remaining eight ... -->
    </div>
  </div>
</section>
```

Delete the duplicated second set of cards and `vindmyScroll` marquee dependency from HTML.

- [ ] **Step 4: Keep Get the App + Safer Connections content**

Preserve verbatim:

- H1: `Get The App and Explore New Opportunities To Connect` (with highlight span on `Connect` if already present)
- Paragraph starting `Vindmy helps people discover meaningful connections...`
- Images `home_screen_2_vindmy_2.png`, `onboarding_2_graphic.png`
- Store badges + `Get the App` button
- H1 `Building Safer Digital Connections`, intro paragraph, all eight ✔ list items, `Find Out More` → `Pages/about.html`

Fix any broken HTML in the solutions list (current file has a mismatched `</div>`).

- [ ] **Step 5: Add homepage section CSS**

```css
.hero-section {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: calc(var(--nav-height) + 3rem) var(--space-3) 4rem;
  background: #040208 url("../Images/Home_screen.jpg") center / cover no-repeat;
  color: #fff;
  text-align: center;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background: var(--color-hero-scrim);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease both;
}

.hero-section h1 {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  margin: 0 0 var(--space-2);
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
}

.hero-section p {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  margin: 0 0 var(--space-4);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.85rem 1.75rem;
  background: var(--color-ink);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  border-radius: var(--radius-sm);
  transition: background 0.25s ease, transform 0.25s ease;
}

.cta-btn:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-strip {
  background: var(--color-canvas);
  padding: var(--space-6) 0;
}

.product-strip-header {
  text-align: center;
  margin-bottom: var(--space-4);
}

.product-strip-header h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0 0 var(--space-1);
  color: var(--color-ink);
}

.product-strip-header p {
  margin: 0;
  color: var(--color-ink-muted);
}

.product-strip-track {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}

.product-card {
  margin: 0;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-card img {
  width: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  object-position: top;
}

.product-card figcaption {
  padding: var(--space-2);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  color: var(--color-ink);
}

.app-section {
  background: var(--color-surface);
  padding: var(--space-6) var(--space-3);
}

.app-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  align-items: center;
  max-width: var(--max-width);
  margin: 0 auto;
}

.app-image {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}

.app-image img {
  max-width: 200px;
  width: 45%;
}

.app-text h1 {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1.2;
  margin: 0 0 var(--space-2);
}

.highlight {
  color: var(--color-secondary);
}

.getApp-btn,
.signup2-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.9rem 2rem;
  border-radius: var(--radius-pill);
  background: var(--color-secondary);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.25);
}

.getApp-btn:hover,
.signup2-btn:hover {
  background: var(--color-accent);
}

.solutions-section {
  background: var(--color-canvas);
  padding: var(--space-6) var(--space-3);
  text-align: center;
}

.solutions-section h1 {
  margin: 0 0 var(--space-2);
}

.section-intro {
  max-width: 720px;
  margin: 0 auto var(--space-4);
  color: var(--color-ink-muted);
}

.solutions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3) var(--space-5);
  max-width: 800px;
  margin: 0 auto var(--space-4);
  text-align: left;
}

.solutions-grid ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.solutions-grid li {
  margin-bottom: 0.75rem;
  color: var(--color-secondary);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .product-strip-track {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .product-strip-track {
    display: flex;
    overflow-x: auto;
    gap: var(--space-2);
    scroll-snap-type: x mandatory;
    padding-bottom: var(--space-2);
    -webkit-overflow-scrolling: touch;
  }

  .product-card {
    flex: 0 0 200px;
    scroll-snap-align: start;
  }

  .app-grid,
  .solutions-grid {
    grid-template-columns: 1fr;
  }

  .app-text {
    text-align: center;
  }

  .store-buttons {
    justify-content: center;
  }
}
```

Remove obsolete `.services-showcase*` and `@keyframes vindmyScroll` rules from CSS.

- [ ] **Step 6: Visual verify homepage**

Open `http://127.0.0.1:8766/index.html`.

Expected:
- First viewport: street photo + welcome lines + Get Started only
- No purple full-bleed strip
- Nine product screens once
- App + solutions sections readable on light canvas
- Width 375: horizontal swipe for phones; stacked app/solutions

- [ ] **Step 7: Commit**

```bash
git add Site/index.html Site/css/styles.css
git commit -m "Restructure homepage into editorial hero and product sections."
```

---

### Task 3: Apply consistent chrome + Manrope to all Pages

**Files:**
- Modify: `Site/Pages/about.html`, `Contact.html`, `Profile.html`, `FAQ.html`, `HowTo.html`, `DeleteAccount.html`, `privacy.html`, `ts&cs.html`
- Test: spot-check nav links and footer on two Pages URLs

**Interfaces:**
- Consumes: Task 1 chrome CSS
- Produces: every page has Manrope link, matching nav (with correct relative paths), `aria-current` on active item, matching footer

- [ ] **Step 1: Add Manrope to any page missing it**

In each `Site/Pages/*.html` `<head>` (if missing):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Normalize nav markup**

On every Pages file, ensure:

```html
<nav class="navbar">
  <div class="container nav-container">
    <a class="logo" href="../index.html">
      <img src="../Images/vindmy_logo.png" alt="Vindmy Logo" />
      <span class="logo-text">VINDMY</span>
    </a>
    <button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation" aria-controls="nav-links" aria-expanded="false" type="button">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      <li><a href="../index.html">Home</a></li>
      <li><a href="about.html">About Us</a></li>
      <li><a href="Contact.html">Contact</a></li>
      <li><a href="Profile.html">Profile Verification</a></li>
      <li><a href="FAQ.html">FAQ</a></li>
      <li><a href="HowTo.html">How to</a></li>
    </ul>
  </div>
</nav>
```

Set `aria-current="page"` on the link for the current page. Fix FAQ’s invalid structure if `<body>` is after `<nav>` — wrap so `<nav>` is inside `<body>`.

- [ ] **Step 3: Normalize footer** on all Pages to the same Company / Legal / Follow Us / store / copyright content (paths relative to `Pages/`). Keep existing social URLs and image paths.

- [ ] **Step 4: Verify**

```bash
# structural sanity
rg -n "menu-toggle" Site/Pages/*.html | wc -l
# expect 8 (one per page)
```

Open About + FAQ: sticky light nav, charcoal footer, mobile menu works.

- [ ] **Step 5: Commit**

```bash
git add Site/Pages/*.html
git commit -m "Normalize nav, footer, and fonts across all pages."
```

---

### Task 4: About + Delete Account + Legal pages

**Files:**
- Modify: `Site/Pages/about.html`, `DeleteAccount.html`, `privacy.html`, `ts&cs.html`
- Modify: `Site/css/styles.css` (about / delete / legal sections)
- Test: browser those four URLs

**Interfaces:**
- Consumes: chrome; `PastedGraphic-1.png`; iubenda iframe srcs unchanged
- Produces: readable light layouts; all About/Delete copy preserved

- [ ] **Step 1: About markup**

Keep all three paragraphs, Core Values list items (Safety First … Community Building), Contact Us button. Structure:

```html
<section class="about-section">
  <div class="container about-grid">
    <div class="about-image">
      <img src="../Images/PastedGraphic-1.png" alt="About Company" />
    </div>
    <div class="about-content">
      <p class="section-tag">About Us</p>
      <!-- three existing <p> blocks -->
      <h2>Our Core Values</h2>
      <ul class="values-list">
        <li>Safety First</li>
        <!-- ... remaining values without leading ✔ required in list text if ✔ already in copy — keep exact wording including ✔ if present -->
      </ul>
      <div class="about-buttons">
        <a href="Contact.html" class="btn-outline">Contact Us</a>
      </div>
    </div>
  </div>
</section>
```

Preserve exact value lines as currently written (`✔ Safety First` etc. if that is the live copy).

- [ ] **Step 2: About / delete / legal CSS**

```css
.about-section {
  padding: var(--space-6) 0;
  background: var(--color-canvas);
  opacity: 1;
  transform: none;
  animation: none;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  align-items: center;
}

.about-image img {
  width: 100%;
  max-width: 520px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
}

.section-tag {
  display: inline-block;
  background: rgba(124, 58, 237, 0.1);
  color: var(--color-secondary);
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-pill);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.values-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-3);
}

.values-list li {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.7rem 1.5rem;
  border: 2px solid var(--color-secondary);
  color: var(--color-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.btn-outline:hover {
  background: var(--color-secondary);
  color: #fff;
}

body.delete-page {
  background: var(--color-canvas) !important;
}

main.delete-wrapper {
  min-height: calc(100vh - 200px);
  display: block;
  padding: var(--space-5) var(--space-3);
}

.delete-container {
  max-width: 760px;
  margin: 0 auto;
  background: transparent;
  padding: 0;
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.delete-container h1 {
  color: var(--color-secondary);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
}

.delete-container h2 {
  color: var(--color-accent);
  font-size: 1.2rem;
}

.legal-section {
  padding: var(--space-5) var(--space-3);
  background: var(--color-canvas);
  text-align: left;
}

.legal-section h2 {
  color: var(--color-secondary);
  margin-bottom: var(--space-3);
}

.legal-section iframe {
  width: 100%;
  min-height: 70vh;
  border: 0;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-content {
    text-align: left;
  }
}
```

- [ ] **Step 3: Delete Account + Legal**

- Delete: keep all headings/lists/emails; remove heavy white card look via CSS above.
- Privacy/Terms: keep iframe `src` values exactly; only chrome/CSS.

- [ ] **Step 4: Verify**

Open About, DeleteAccount, privacy, ts&cs. Confirm copy intact; About image not crushed; iframes usable on ~375 width.

- [ ] **Step 5: Commit**

```bash
git add Site/Pages/about.html Site/Pages/DeleteAccount.html Site/Pages/privacy.html "Site/Pages/ts&cs.html" Site/css/styles.css
git commit -m "Restyle About, Delete Account, and legal pages."
```

---

### Task 5: Contact + Profile Verification (markup/CSS only)

**Files:**
- Modify: `Site/Pages/Contact.html`, `Site/Pages/Profile.html`
- Modify: `Site/css/styles.css`
- Test: grep form contracts; visual layout only (no API submit)

**Interfaces:**
- Consumes: existing form field set
- Produces: light form layouts; **identical** IDs/names for JS

- [ ] **Step 1: Contract lock — record required IDs**

Before editing, confirm these exist and must still exist after:

Contact: `supportForm`, `name`, `surname`, `email`, `mobile`, `alias`, `vindmyTag`, `category`, `subject`, `message`, `documents`, `consent`, `submitButton`, `supportStatus`, `g-recaptcha`.

Profile: `verificationForm`, `name`, `surname`, `email`, `mobile`, `alias`, `vindmyTag`, `documents`, `consent`, `submitBtn`, `verificationStatus`, `exampleTrigger`, `exampleModalOverlay`, `exampleModalClose`, plus inline modal script unchanged.

- [ ] **Step 2: Restyle support/verification sections in CSS**

```css
.support-section,
.verification-section {
  background: var(--color-canvas);
  padding: var(--space-6) var(--space-3);
}

.support-grid,
.verification-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-4);
  max-width: var(--max-width);
  margin: 0 auto;
}

.support-container,
.verification-container {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-soft);
}

.support-container h2,
.verification-container h2 {
  text-align: left;
  font-size: clamp(1.6rem, 3vw, 2rem);
  margin: 0 0 var(--space-3);
}

.support-form label,
.verification-form label {
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.support-form input,
.support-form select,
.support-form textarea,
.verification-form input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  margin-bottom: var(--space-2);
  border: 1px solid #E2E8F0;
  border-radius: var(--radius-sm);
  background: #fff;
  font: inherit;
}

.support-form input:focus,
.support-form select:focus,
.support-form textarea:focus,
.verification-form input:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.support-form button,
.verification-form button {
  width: 100%;
  min-height: 48px;
  padding: 0.9rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-secondary);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: var(--space-2);
}

.support-form button:hover,
.verification-form button:hover {
  background: var(--color-accent);
}

.contact-details {
  background: var(--color-secondary);
  color: #fff;
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.contact-details h3,
.contact-details p {
  color: #fff;
}

.upload-instructions {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  margin: 0 0 var(--space-2);
}

@media (max-width: 768px) {
  .support-grid,
  .verification-grid {
    grid-template-columns: 1fr;
  }
}
```

Move shared `.form-status` rules from inline `<style>` in Contact/Profile into `styles.css` if convenient, **without** changing class names used by JS (`form-status`, `status-success`, `status-error`, `status-icon`).

- [ ] **Step 3: HTML layout only**

Restructure wrappers for grid/spacing. Do not rename inputs. Keep FAQ/How to help links on Contact. Keep Profile upload instructions + example modal markup and the page-bottom `<script>` for the modal exactly (or copy-identical).

- [ ] **Step 4: Contract verify (required)**

```bash
rg -n "id=\"supportForm\"|id=\"submitButton\"|id=\"supportStatus\"|name=\"g-recaptcha-response\"|id=\"verificationForm\"|id=\"submitBtn\"|id=\"verificationStatus\"|id=\"exampleTrigger\"" Site/Pages/Contact.html Site/Pages/Profile.html
```

Expected: all IDs present. Then:

```bash
# Ensure form submit handlers in script.js were not modified
git diff Site/js/script.js
```

Expected for this task: **no** `script.js` changes yet (or empty).

- [ ] **Step 5: Visual verify**

Open Contact + Profile at 375 and 1024. Forms readable; purple submit; cyan focus; help column stacks on mobile.

- [ ] **Step 6: Commit**

```bash
git add Site/Pages/Contact.html Site/Pages/Profile.html Site/css/styles.css
git commit -m "Restyle Contact and Profile Verification forms without changing form contracts."
```

---

### Task 6: FAQ restyle (keep search + accordion JS)

**Files:**
- Modify: `Site/Pages/FAQ.html`
- Modify: `Site/css/styles.css`
- Test: search filter + expand in browser

**Interfaces:**
- Consumes: existing `.section`, `.section-title`, `.section-content`, `.question-btn`, `.answer`, `#faq-search`, `#faq-search-status`
- Produces: light readable FAQ; same class hooks for `script.js`

- [ ] **Step 1: Fix FAQ document structure**

Ensure valid HTML: `<body>` wraps nav + content. Keep every section title and Q&A text.

- [ ] **Step 2: FAQ CSS**

```css
.faq-page,
.faq-header {
  background: var(--color-canvas);
}

.faq-header {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-5) var(--space-3) var(--space-2);
}

.faq-header h1 {
  color: var(--color-secondary);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin: 0 0 var(--space-3);
}

.faq-search-input {
  width: 100%;
  max-width: 560px;
  min-height: 48px;
  padding: 0.85rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: var(--radius-md);
  font: inherit;
}

.faq-search-input:focus {
  outline: 2px solid var(--color-accent);
  border-color: var(--color-accent);
}

.faq-search-status {
  color: var(--color-ink-muted);
  font-size: 0.95rem;
}

.faq-list {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-3) var(--space-6);
}

.section {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  box-shadow: var(--shadow-soft);
  opacity: 1;
  transform: none;
  animation: none;
  overflow: hidden;
}

.section-title {
  color: var(--color-ink);
  background: transparent;
  padding: 1rem 1.15rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.section-content {
  display: none;
  padding: 0 1rem 1rem;
}

.question-btn {
  width: 100%;
  text-align: left;
  padding: 0.85rem 1rem;
  margin: 0.35rem 0;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  border-radius: var(--radius-sm);
  font-weight: 600;
  min-height: 44px;
  cursor: pointer;
}

.question-btn:hover {
  background: rgba(6, 182, 212, 0.15);
  color: var(--color-ink);
  transform: none;
}

.answer {
  display: none;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: #FAFAFA;
  border-left: 4px solid var(--color-secondary);
  border-radius: var(--radius-sm);
  color: var(--color-ink);
  line-height: 1.6;
}

/* Optional smooth open if using max-height later; keep display toggle compatible with existing JS */
```

Remove FAQ dark-body contrast issues (no black page background for FAQ content). Prefer wrapping FAQ sections in `.faq-list` but **keep** `.section` / `.section-title` / `.question-btn` / `.answer` class names.

- [ ] **Step 3: Verify interaction**

Open FAQ. Click a category title → content shows. Click a question → answer shows. Type `location` in search → matching questions remain; status text updates.

- [ ] **Step 4: Commit**

```bash
git add Site/Pages/FAQ.html Site/css/styles.css
git commit -m "Restyle FAQ for light canvas and readable accordion."
```

---

### Task 7: How to — dummy YouTube embeds

**Files:**
- Modify: `Site/Pages/HowTo.html`
- Modify: `Site/css/styles.css`
- Test: browser How to page; embeds load

**Interfaces:**
- Consumes: page title `How to`
- Produces: responsive video grid with 6 placeholder YouTube embeds

- [ ] **Step 1: Replace empty content**

Keep `<h1>How to</h1>`. Add:

```html
<section class="howto-section">
  <div class="container">
    <header class="howto-header">
      <h1>How to</h1>
      <p class="howto-note">Placeholder videos — replace with official Vindmy guides when ready.</p>
    </header>
    <div class="howto-grid">
      <div class="howto-video">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="How to — placeholder 1"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <!-- repeat placeholders 2–6 with titles How to — placeholder 2 … 6; same embed URL is fine for dummies -->
    </div>
  </div>
</section>
```

Use the same well-known public YouTube embed URL for all dummies (easy to find/replace later). Do not invent new brand imagery.

- [ ] **Step 2: How-to CSS**

```css
.howto-section {
  padding: var(--space-6) 0;
  background: var(--color-canvas);
}

.howto-header h1 {
  margin: 0 0 var(--space-1);
}

.howto-note {
  color: var(--color-ink-muted);
  margin: 0 0 var(--space-4);
}

.howto-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}

.howto-video {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.howto-video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

@media (max-width: 1024px) {
  .howto-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .howto-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify**

Open How to at 375 / 1024. Six 16:9 embeds; no horizontal overflow; title “How to” present.

- [ ] **Step 4: Commit**

```bash
git add Site/Pages/HowTo.html Site/css/styles.css
git commit -m "Add placeholder YouTube embeds to the How to page."
```

---

### Task 8: Fix Get Started CTA alert (isolated script change)

**Files:**
- Modify: `Site/js/script.js` (lines ~21–27 only)
- Test: click Get Started on homepage; confirm no alert; store opens

**Interfaces:**
- Consumes: `.cta-btn` link href
- Produces: native navigation; form handlers untouched

- [ ] **Step 1: Remove only the CTA hijack block**

Delete this block from `Site/js/script.js`:

```javascript
  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Welcome to Vindmy! Let's get you started.");
    });
  }
```

Optionally also remove the dead `.signup-btn` alert block and `animateValue` / `tickets`/`cards` `onload` if present — **only if** those edits do not touch the `DOMContentLoaded` form submit region starting at the `supportForm` listener. Prefer minimal: CTA block only.

- [ ] **Step 2: Prove form region unchanged**

```bash
git diff Site/js/script.js
```

Expected: diff shows only removal near CTA/signup/counters — **zero** changes inside the `supportForm` / `verificationForm` submit handlers.

- [ ] **Step 3: Manual verify**

Click Get Started on homepage → Play Store URL (no alert). Open Contact page and confirm submit button still present (do not need successful API).

- [ ] **Step 4: Commit**

```bash
git add Site/js/script.js
git commit -m "Allow Get Started to open the store without an alert."
```

---

### Task 9: Motion polish + responsive sweep + final QA

**Files:**
- Modify: `Site/css/styles.css` (and tiny HTML tweaks only if a QA bug requires)
- Test: full page walkthrough

**Interfaces:**
- Consumes: all prior sections
- Produces: reduced-motion-safe polish; no horizontal scroll

- [ ] **Step 1: Confirm motion rules**

Ensure hero `fadeInUp`, product-card hover lift, and FAQ open/close remain; `@media (prefers-reduced-motion: reduce)` from Task 1 still present. No marquee animation remains (`rg vindmyScroll Site/css/styles.css` → no matches).

- [ ] **Step 2: Responsive sweep**

With server running, check each URL at ~375, 768, 1440:

- `/index.html`
- `/Pages/about.html`
- `/Pages/Contact.html`
- `/Pages/Profile.html`
- `/Pages/FAQ.html`
- `/Pages/HowTo.html`
- `/Pages/DeleteAccount.html`
- `/Pages/privacy.html`
- `/Pages/ts&cs.html`

Checklist per page: no horizontal scroll; nav works; footer stacks; text contrast OK.

- [ ] **Step 3: Final contract grep**

```bash
rg -n "getElementById\\(\"(supportForm|verificationForm|submitButton|submitBtn|supportStatus|verificationStatus|faq-search|menu-toggle)\"" Site/js/script.js
rg -n "id=\"(supportForm|verificationForm|submitButton|submitBtn|supportStatus|verificationStatus)\"" Site/Pages
```

Expected: all IDs still referenced and present.

- [ ] **Step 4: Commit any polish**

```bash
git add Site/css/styles.css Site/Pages Site/index.html
git commit -m "Polish motion and responsive layout for the UI overhaul."
```

(Skip empty commit if nothing changed.)

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| Split atmosphere (dark hero / light rest) | 1–2 |
| Brand colors as accents | 1–2, 5 |
| Homepage sections + no marquee duplicates | 2 |
| Shared nav/footer | 1, 3 |
| About / Contact / Profile / FAQ / How to / Delete / Legal | 4–7 |
| Dummy YouTube embeds | 7 |
| Forms JS untouched; IDs preserved | 5, 8 |
| CTA alert fix isolated | 8 |
| Responsive all sizes | 1–2, 9 |
| Motion 2–3 + reduced motion | 2, 6, 9 |
| No new images / keep copy | all tasks |

## Placeholder scan

No TBD/TODO steps. Verification is browser + grep (appropriate for static HTML without local API keys).
