# Vindmy Website UI/UX Overhaul — Design Spec

**Date:** 2026-08-26  
**Branch:** `ui-overhaul`  
**Status:** Approved for planning (pending final user review of this file)

## Product context

Vindmy is a South African, location-enabled discovery and messaging app focused on real-world, often vehicle-adjacent situations: connect with people nearby, message by context (e.g. number plate / parking), discover profiles, and share safety alerts (medical, hijacking, accident, reckless driver, panic). Profile verification uses vehicle rear + licence disc photos. The marketing site must reflect that product — not a generic “digital identity” brochure.

## Goals

- Make the site modern, sleek, and non–AI-slop.
- Keep brand colors, existing images, and all existing wording.
- Design for phones, tablets, and desktops (no horizontal scroll; usable touch targets).
- Preserve working Contact (support) and Profile Verification form submissions.

## Non-negotiable constraints

| Constraint | Rule |
|---|---|
| Colors | Keep `#2563EB`, `#06B6D4`, `#7C3AED` (and related neutrals). Use as **accents**, not full-bleed section walls. |
| Images | Reuse existing assets only. No new photos/illustrations. |
| Copy | Every current sentence/label must still appear somewhere. Restructuring OK. |
| Forms JS | Do **not** change support/verification submit handlers, FormData/multipart logic, reCAPTCHA checks, fetch to `/support` and `/verification`, URL autofill, or Profile licence-disc example modal script. Form field `id`/`name`s and form `id`s stay the same. |
| Backend | No changes to Cloudflare/Express function contracts. |
| Local testing | Form APIs cannot be end-to-end tested without keys; rely on not touching those scripts. |

## Approach (chosen)

**Editorial product site** with **split atmosphere**:

- Homepage first viewport: dark photographic hero.
- Rest of site: calm light canvas.
- Homepage restructured; shared chrome; inner pages restructured for clarity while keeping content.

Rejected: full-dark site (hurts forms/legal readability); phone-first cliché landing; template-only kit feel.

## Visual system

### Color roles

- **Light canvas:** warm off-white / soft light gray for body pages and below-fold homepage.
- **Dark hero only:** near-black + `Home_screen.jpg` with a light scrim for type.
- **Cyan `#06B6D4`:** primary actions, focus rings.
- **Purple `#7C3AED`:** secondary accent, highlights, submit buttons where already purple.
- **Blue `#2563EB`:** links sparingly.
- **Footer:** dark charcoal (not cyan fills).
- No purple/cyan full-bleed section backgrounds. Gradients only on small UI (e.g. button fill).

### Typography

- Keep **Manrope**.
- Clear hierarchy: large hero display; restrained H2s; comfortable body line-height.
- Fix existing contrast failures (e.g. dark text on dark FAQ/About backgrounds).

### Shared chrome

- **Nav:** sticky. Light translucent bar on light pages; over hero photo with scrim on homepage. Logo + VINDMY left; links right on desktop. Mobile: hamburger → light full-height panel (not purple wall). Active page state. Same link set.
- **Footer:** charcoal. Same Company / Legal / Follow Us / store badges / © 2026. Stacks on mobile. Existing social and store images.

### Responsive

- Mobile-first. Rough breakpoints: under 640px, 640–1024px, over 1024px. Spot-check ~375 / 768 / 1024 / 1440.
- Touch targets ≥44px. Forms single-column on mobile.
- Images and phone mockups scale; embeds 16:9; no horizontal overflow.

## Homepage

1. **Hero (first viewport only)**  
   Full-bleed `Home_screen.jpg`. Existing lines only: “Welcome to Vindmy”, “The New Way Of Connecting People”. One CTA: “Get Started” → Play Store (real navigation). No badges/stats/chips on the photo.

2. **Product strip**  
   Keep “VindMy” + “Where meaningful connections begin.” Show the nine existing screens once (Sign up → Travel safe) with existing labels. No duplicated infinite purple marquee. Desktop: calm grid or controlled horizontal row; mobile: swipe or stacked grid.

3. **Get the app**  
   Existing headline, paragraph, `home_screen_2_vindmy_2.png`, `onboarding_2_graphic.png`, store badges, “Get the App”. Desktop: phones + copy side by side; mobile: stack.

4. **Safer connections**  
   Existing H1, intro, all eight ✔ bullets, “Find Out More” → About. Light background. Two columns of bullets on desktop; one on mobile.

5. **Footer** as above.

## Inner pages

| Page | Treatment |
|---|---|
| **About** | All three paragraphs + Core Values + Contact Us. Image beside copy on desktop; stacked on mobile. Values as a simple list. |
| **Contact** | Same fields/labels/consent/reCAPTCHA/FAQ·How to links. Form primary; contact details beside (desktop) / below (mobile). Light chrome; cyan focus; purple submit. Keep `#supportForm`, field names, `#submitButton`, `#supportStatus`. |
| **Profile Verification** | Same fields, upload instructions, example modal, consent, reCAPTCHA, Need Help block. Keep `#verificationForm`, field names, `#submitBtn`, `#verificationStatus`, modal IDs. |
| **FAQ** | Keep search + all sections/Q&A. Accordion UX on light background. Search still filters. |
| **How to** | Keep title. Replace empty placeholder with a responsive grid of **dummy YouTube embeds** (4–6) until real videos exist. Easy URL swap later. |
| **Delete Account** | All current content; single readable column (no heavy floating lavender card). |
| **Privacy / Terms** | Keep iubenda iframes; shared chrome; mobile-usable iframe area. |

## Motion

1. Hero copy/CTA: short fade-up on load.  
2. Product phones: subtle scroll-in or hover lift.  
3. FAQ accordion: smooth height.  

Respect `prefers-reduced-motion`. No continuous marquee; no excessive button bounce.

## Behavior / JS policy

- **Forms:** Leave support and verification submit handlers, autofill, and Profile example-modal script **unchanged**. Keep form/`input`/`button`/`status` IDs and `name`s identical so existing listeners keep working.
- **Allowed without touching form JS:** HTML/CSS restructuring around forms; nav/FAQ presentation; How to embeds; homepage structure.
- **CTA alert hijack:** “Get Started” currently `preventDefault` + `alert` in `script.js`. Fix only that isolated block (or equivalent) so store links navigate; do not edit the support/verification submit blocks. Prefer leaving those regions byte-identical.
- Dead `tickets`/`cards` counters: optional cleanup only outside form code; otherwise leave alone.

## Tech

- Static HTML/CSS/JS. No new framework.
- Rebuild `styles.css` around design tokens; restructure page HTML as needed.
- Shared patterns for nav/footer across pages.
- Server functions and package deps unchanged.

## Success criteria

- Site reads as one modern brand from phone to desktop.
- Brand colors present but not as garish full-bleed fills.
- All prior wording and images still present.
- Support and verification markup/JS contracts unchanged so submissions still work when APIs/keys are available.
- How to shows dummy YouTube embeds.
- Get Started / store buttons navigate to store URLs.
- No horizontal scroll; readable contrast; accordion FAQ usable.

## Out of scope

- Rewriting marketing copy.
- New imagery or logo redesign.
- Changing form field set or API payloads.
- End-to-end form testing without local API keys.
- App (native) UI redesign.
