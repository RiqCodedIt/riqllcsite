# Copilot Agent Instructions — riqllcsite backend (prodbyriq.com)

> Trust these instructions first. Only search the codebase if the information below is incomplete or appears out of date.

## What This Repo Is

The **backend** service for **prodbyriq.com** — a music producer/mix-engineer e-commerce site. This service handles Stripe checkout sessions, Stripe webhooks, Google Sheets logging, and studio availability syncing from The Record Co's booking calendar.

- **GitHub**: `RiqCodedIt/riqllcsite`, branch: `backend`
- **Deployment**: Railway reads the `Procfile` (`web: bundle exec ruby server.rb`) to start the service. No Docker build step — Railway's Nixpacks/Heroku buildpack handles the Ruby environment.
- **Stack**: Ruby 3.1 · Sinatra · Stripe · Google APIs (Sheets v4, Calendar v3) · Sequel · SQLite · Puma · whenever (cron)
- **Runtime**: Bundler. **Always run `bundle install` before any other command.**

---

## Setup and Run — Validated Commands

**Install dependencies (always run first):**
```bash
bundle install
```

**Start the server** (binds to `$PORT`, defaults to the PORT env var):
```bash
bundle exec ruby server.rb
```

**Database migration** (creates the SQLite availability tables; uses `DATABASE_URL` env var or defaults to `sqlite://availability.db`):
```bash
bundle exec sequel -m db/migrate ${DATABASE_URL:-sqlite://availability.db}
```

**Update cron schedule** (uses the `whenever` gem):
```bash
bundle exec whenever --update-crontab
```

**No test suite exists.** There are no test files or test scripts. Validate changes by running the server and exercising the relevant endpoints.

**Environment variables** — required for runtime. Create a `.env` file (gitignored) for local development:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
recordco_user=your_email@example.com
recordco_pass=your_password
DATABASE_URL=sqlite://availability.db
ENABLE_CALENDAR_SYNC=true
PORT=4000
```

---

## Project Layout

```
/                               ← repo root
├── server.rb                   ← main Sinatra application; all HTTP routes defined here
├── Procfile                    ← Railway start command: `bundle exec ruby server.rb`
├── Gemfile                     ← Ruby dependencies (sinatra, stripe, google-apis-*, sequel, whenever, etc.)
├── Gemfile.lock                ← locked dependency versions
├── .ruby-version               ← specifies Ruby 3.1.0
├── lib/
│   ├── availability_manager.rb    ← manages DB operations and coordinates calendar availability syncing
│   └── calendar_sync_service.rb   ← background thread service that periodically syncs Record Co calendar
├── db/
│   └── migrate/
│       └── 001_create_availability.rb  ← Sequel migration: creates availability and sync_logs tables
├── config/
│   └── schedule.rb             ← whenever cron definitions (sync every 30 min, daily full sync, weekly cleanup)
├── bookings/                   ← runtime-generated JSON files; one file per order/booking (gitignored)
└── vendor/                     ← bundler vendored gems (if present)
```

---

## HTTP API surface (from `server.rb`)

| Path | Method | Description |
|---|---|---|
| `/` | `GET` | Health check — returns a plain-text "running" message |
| `/health` | `GET` | JSON health check with timestamp; used by Railway |
| `/create-checkout-session` | `POST` | Creates a Stripe Checkout Session from cart items + customer info; returns `{ url }` for redirect |
| `/create-studio-checkout-session` | `POST` | Legacy endpoint for direct studio booking form checkout |
| `/webhook` | `POST` | Stripe webhook receiver; handles `checkout.session.completed`, `charge.succeeded`, `payment_intent.succeeded` |
| `/bookings` | `GET` | Returns all saved booking JSON files (admin use) |
| `/success` | `GET` | Plain-text success page after Stripe redirect |
| `/api/availability/:date` | `GET` | Returns studio availability for a given date (studioC / studioD, morning/afternoon/evening) |
| `/api/sync-calendar` | `POST` | Accepts calendar events from the frontend and syncs availability |
| `/api/sync-status` | `GET` | Returns last sync time, status, and record count |
| `/api/availability/override` | `POST` | Admin: manually override availability for a specific studio + time slot |
| `/api/sync-calendar-now` | `POST` | Admin: manually trigger an immediate calendar sync |
| `/api/calendar-sync-status` | `GET` | Returns background sync service running state and interval |

> ⚠️ There is **no `/checkout` route**. Checkout is handled via `/create-checkout-session`, which creates a Stripe Checkout Session and returns a `url` for the frontend to redirect to. Do not add a `/checkout` route that expects embedded Stripe Elements — the flow is Stripe-hosted checkout, not embedded.

---

## Key Conventions

- **Entry point**: All routes live in `server.rb`. Prefer extending this file or extracting to `lib/` helpers rather than adding new Sinatra apps.
- **Environment variables only**: Never hardcode secrets. Use `ENV['VAR_NAME']` exclusively. All secrets (Stripe keys, Record Co credentials, Google credentials) are Railway environment variables.
- **Order/booking persistence**: Orders and bookings are written to JSON files in the `bookings/` directory at checkout time and updated on webhook confirmation.
- **Google Sheets logging**: Studio session orders are appended to the configured Google Sheet on `checkout.session.completed` via `add_to_google_sheets`.
- **Calendar sync**: `CalendarSyncService` runs a background thread in production (when `ENABLE_CALENDAR_SYNC=true`). `AvailabilityManager` handles all DB reads/writes via Sequel.
- **Cron jobs** (via `whenever`): sync runs every 30 minutes, full sync daily at 6 AM, cleanup weekly at 2 AM. See `config/schedule.rb`.
- **No CI/CD pipeline exists yet.** Validate all PRs locally by running the server and testing affected endpoints.
- **Branch**: All feature work goes on `backend` branch. Do not push to `frontend` branch.
