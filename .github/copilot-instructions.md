# Review Guidelines

# Copilot Agent Instructions — riqllcsite (prodbyriq.com)

> Trust these instructions first. Only search the codebase if the information below is incomplete or appears out of date.

## What This Repo Is

The frontend for **prodbyriq.com** — a music producer/mix-engineer e-commerce site. Features: beat marketplace with licensing (Lease $50 / Exclusive $200), mixing & mastering service booking, studio session booking, and Stripe-powered checkout. The backend (Stripe webhooks, Google Sheets) lives on the `backend` branch in the same repo and is a separate service. **This repo is the `frontend` branch only.**

- **GitHub**: `RiqCodedIt/riqllcsite`, default branch: `frontend`
- **Deployment**: Docker (multi-stage: `node:20-alpine` → `caddy`) → Railway. The `Dockerfile` and `Caddyfile` are in the root.
- **Stack**: React 19 · TypeScript 5.7 · Vite 6 · React Router DOM 7 · Stripe (`@stripe/react-stripe-js` + `@stripe/stripe-js`) · CSS3 (no Tailwind, no component library)
- **Runtime**: Node 22 · npm 10. **Always run `npm install` before any other command.**

---

## Build, Lint, and Run — Validated Commands

**Install (always run first):**
```bash
npm install
```

**Development server** (hot reload, port 5173):
```bash
npm run dev
```

**Production build** (outputs to `dist/`; takes ~1s):
```bash
npm run build
# runs: tsc -b && vite build
```
✅ Build passes cleanly. Manual chunks are defined in `vite.config.ts`: `vendor` (react/react-dom), `router` (react-router-dom), `stripe`.

**Lint** — `npm run lint` fails in CI because `eslint` is not in `$PATH`. Always use the local binary:
```bash
./node_modules/.bin/eslint .
```
⚠️ There are **13 pre-existing lint errors** (all `@typescript-eslint/no-explicit-any`) and **3 warnings** in the existing codebase. Do not introduce new errors. The build does **not** fail on lint errors — `tsc -b` is the type gate.

**Preview production build** (port 4173):
```bash
npm run build && npm run preview
```

**No test suite exists.** There are no test files or test scripts. Validate changes with `npm run build` + `./node_modules/.bin/eslint .`.

**Environment variables** — required for runtime but **not needed for build/lint**. For local dev, create `.env.local` (gitignored):
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=...
VITE_GOOGLE_API_KEY=...
VITE_GOOGLE_SHEET_ID=...
```
The build will succeed without these; features that call the backend will fail at runtime.

---

## Project Layout

```
/                       ← repo root
├── index.html          ← SPA entry; <title> and favicon must be changed here (currently default Vite scaffold)
├── vite.config.ts      ← build config; manual chunks defined here
├── tsconfig.json       ← references tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json   ← app compiler options; strict mode ON (noUnusedLocals, noUnusedParameters, strict)
├── eslint.config.js    ← ESLint flat config; react-hooks + react-refresh plugins
├── Dockerfile          ← multi-stage: node:20-alpine build → caddy serve
├── Caddyfile           ← SPA fallback (try_files → index.html), PORT env var, gzip
├── server.js           ← Express fallback server (alternative to Caddy); not used in Docker
├── src/
│   ├── main.tsx        ← app entry; wraps App in <BrowserRouter>
│   ├── App.tsx         ← route definitions (see Routes section below)
│   ├── App.css         ← global app styles
│   ├── index.css       ← CSS reset/base
│   ├── components/
│   │   ├── NavBar.tsx  ← site navigation; styles: src/styles/NavBar.css
│   │   ├── Footer.tsx  ← copyright year (currently hardcoded 2025); styles: src/styles/Footer.css
│   │   ├── beats/
│   │   │   ├── BeatCard.tsx    ← renders single beat; handles add-to-cart
│   │   │   └── BeatFilters.tsx ← filter sidebar (genre, key, BPM range, search)
│   │   ├── cart/
│   │   │   ├── CartProvider.tsx ← React Context + useReducer; persists to localStorage key 'riq-cart'
│   │   │   └── CartDrawer.tsx   ← slide-out cart; "Proceed to Checkout" calls redirectToCheckout()
│   │   └── checkout/
│   │       └── CheckoutForm.tsx ← modal form (customer info + order summary); also calls redirectToCheckout()
│   ├── pages/          ← one file per route
│   ├── services/
│   │   ├── stripe.ts       ← createCheckoutSession() POSTs to VITE_API_URL/create-checkout-session → redirects to Stripe hosted checkout
│   │   ├── googleCalendar.ts
│   │   └── googleSheets.ts ← stub; actual Sheet writes handled by backend via webhook
│   ├── data/
│   │   ├── beats.json      ← static beat catalog (8 entries); add beats here
│   │   └── services.json   ← static service catalog (6 entries); add/edit services here
│   ├── types/
│   │   ├── beats.ts    ← Beat, CartItem, BeatCartItem, StudioCartItem, BeatFilters, GENRES, KEYS constants
│   │   └── services.ts ← Service, ServiceCartItem, ServicesData
│   ├── hooks/
│   │   ├── useAvailability.ts      ← mock availability data; no live backend call yet
│   │   └── useBookingValidation.ts
│   ├── styles/         ← one .css file per page/component
│   └── utils/
│       └── dateUtils.ts
└── public/
    ├── covers/         ← beat cover images (cover001.png – cover010.jpg); referenced as /covers/filename
    └── vite.svg        ← default Vite favicon; should be replaced with branded asset
```

---

## Routes (defined in `src/App.tsx`)

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Hero, Featured Work (Spotify embeds), service cards |
| `/about` | `About` | Bio, no checkout path |
| `/beats` | `Beats` | Beat catalog, filters, add-to-cart |
| `/services` | `Services` | Service cards, add-to-cart |
| `/booking` | `Booking` | Studio booking form (external studio, therecordco.org) |
| `/featured-work` | `FeaturedWork` | Extended portfolio; not in NavBar |
| `/success` | `Success` | Stripe post-payment success page |
| `/admin` | `Admin` | Internal admin; not in NavBar |

> ⚠️ There is **no `/checkout` route**. Checkout is handled entirely via `CartDrawer` → `redirectToCheckout()` which calls the backend API and redirects to Stripe's hosted checkout URL. Do not add a `/checkout` route that expects a Stripe Elements embed — the flow is Stripe-hosted checkout, not embedded.

---

## Key Conventions

- **CSS**: No Tailwind. Each page/component has a matching `.css` file in `src/styles/`. Co-locate new styles there.
- **Data editing**: Beats and services are static JSON in `src/data/`. Add a beat by appending to `beats.json`; beat cover images go in `public/covers/`. Beat audio previews are hosted on S3 (`riqbeatstorebucket.s3.us-east-2.amazonaws.com`).
- **TypeScript strict mode is ON**: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`. Every new variable, prop, and parameter must be used or prefixed with `_`.
- **Cart access**: Always use the `useCart()` hook from `src/components/cart/CartProvider.tsx`. Never import `CartContext` directly.
- **Pricing**: All prices shown on the site must match the canonical rate card: WAV Lease $50 · Exclusive $200 · Mixing $75 · M&M $100 · Full Production $250 minimum · Session retainer $175/mo · Studio retainer $300/mo.
- **No CI/CD pipeline exists yet.** There are no GitHub Actions workflows. Validate all PRs locally with `npm run build` and `./node_modules/.bin/eslint .` before pushing.
- **Branch**: All feature work goes on `frontend` branch. Do not push to `backend` branch.
