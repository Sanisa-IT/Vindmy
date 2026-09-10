# Vindmy Website

Marketing site for Vindmy (HTML/CSS/JS) hosted on Cloudflare Pages, with form endpoints as Pages Functions.

## Layout

- `Site/index.html` — homepage
- `Site/Pages/` — secondary pages (Contact, Profile verification, FAQ, etc.)
- `Site/css/styles.css` / `Site/js/script.js`
- `Site/functions/support.js` — `POST /support`
- `Site/functions/verification.js` — `POST /verification`
- `Site/functions/_utils.js` — shared upload limits, HTML escaping

## Cloudflare env vars

Set these in Pages → Settings → Environment variables:

- `RESEND_API_KEY`
- `RECAPTCHA_SECRET_KEY`

## Uploads

Forms accept images only (JPG, PNG, WEBP, HEIC), max **3** files, **20MB** total. Enforced client- and server-side.

## Local preview

```bash
cd Site && python3 -m http.server 8766
```

Form email sending requires Cloudflare Pages Functions + the env vars above.
