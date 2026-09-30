# muglee·mugs — Sip & Crochet workshop site

Single-page site (React + Vite + Tailwind CSS v4) for Mugdha's beginner
crochet workshops in Ellicott City, MD.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build & deploy

```bash
npm run build
```

Deploy the `dist/` folder to Netlify, Vercel, or Cloudflare Pages
(drag-and-drop works on all three).

## Customize

Everything editable lives at the top of `src/App.jsx`:

- `BOOKING_URL` — currently opens an Instagram DM (`ig.me/m/muglee_mugs`).
  Swap in your Tally / Google Form / Eventbrite link when ready.
- `WORKSHOPS` — dates, times, venues, spots left. Update per batch.
- `PRICE`, `DURATION` — used across hero, cards, and CTAs.
- `FAQS` — add/remove questions freely.

Photos: drop workshop shots into `public/` as `photo-1.jpg` … `photo-4.jpg`
and reference them in the `Gallery` section of `App.jsx`. `public/hero.jpg`
is the hero image.

## Notes

- No backend, no accounts — intentionally. Booking is a DM/form link for v1.
- Colors and fonts are defined via `@theme` in `src/index.css`.
