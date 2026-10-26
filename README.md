# MyCayApp by Jeje-Ola

Next.js 14 application with a public investment website, investor portal, and one operations app.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
# Or keep the review preview on its dedicated port/cache:
npm run dev:preview
```

Set `SESSION_SECRET`. To seed a **new** database, also set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` before the first request. The local account database is excluded from Git. Set `DATABASE_PATH` to use a separate database for testing.

Open `/preview` to explore without registration or completed forms. The preview bar switches between Investor, Staff, Finance, Admin, and Super Admin. Onboarding has a step selector and permits incomplete forms in preview. Each browser workspace uses a separate `data/preview-<uuid>.json` file; preview payments never charge money. Use Exit to leave preview. Preview is disabled in production unless `ENABLE_PREVIEW=true` is explicitly set.

## Structure

- `app/`: public routes, investor routes, operations routes, and APIs.
- `components/portal/`: shared portal navigation, uploads, investment views, currency display.
- `components/admin/`: operations app and staff-assisted onboarding.
- `lib/platform/`: investment lifecycle, permissions, configuration, document generation.
- `lib/kyc/`: onboarding field definitions and Nigerian bank validation.
- `lib/copy-data.ts`: existing public website copy.
- `future-scope/`: deferred Services/Properties pages and their components, plus the previous standalone prototype and superseded source-text checks. These are excluded from the application build.

Typography uses the supplied local Satoshi Variable font. Gold and dark charcoal are shared across the public website and application.

## Operations access

| Role        | Default access                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Staff       | Investor table, investor details, KYC review, communication notes                              |
| Finance     | Ledger, GIAP allocation/resale, payouts, withdrawals, exchange rate, reconciliation and reports |
| Admin       | Staff and Finance capabilities, articles, team management, audit                                |
| Super Admin | All capabilities, role assignments, plan rules, permission matrix                               |

The `/admin` app and API enforce these permissions on the server. Super Admin can adjust role capabilities in Settings. Staff routes redirect to this app. Deactivation and role changes affect existing sessions, and password changes invalidate older sessions. New staff-created accounts must change their temporary password.

## Registration and KYC

Registration signs investors in immediately. Investors complete the seven-step KYC inside the portal. Staff review submitted details and documents from the responsive Investors table and individual investor record at `/admin/investors/[id]`. The detail URL survives refresh and supports direct links. There is no registration approval queue or separate Onboarding module. KYC approval is required to invest; requests for changes do not block access to the portal.

## Investment flows

The **GIAP & WealthStream Complete Flows** PDF takes precedence where it differs from the older SRD: biodata includes uploads and payments use Paystack.

- New investments live under `/portal/investments/new`. Review terms before payment. The server validates capital limits, account verification, plan rules, and rate/frequency selections.
- GIAP: paid → Funded, no linked property → Finance assigns property → Active → Listed for Resale → recorded sale → payout → Closed. Profit is calculated from the sale price at a 70/30 split.
- WealthStream: paid → Active with a stored schedule (12 monthly periods, or 2 annual periods). Completed payouts extend the schedule. A top-up preserves the next payout already in the pipeline and recalculates later payouts.
- Withdrawal: request → Finance review → approval starts the configured notice period and stops future returns → Finance records principal return once notice ends. Reasons and notes support rejection and clarification.
- Agreements, receipts, finance reports, and full payout schedules are generated as downloadable PDFs with authenticated access.
- Admin articles support draft, published, and archived states. Published articles appear in Insights. The rest of the public page copy remains in code.

Live checkout requires `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_APP_URL`. Configure the Paystack webhook URL as `/api/portal/paystack/webhook`. Checkout is initialized on the server; the callback verifies payment server-side and the webhook validates its HMAC SHA-512 signature. Amount and currency are checked against the saved intent, with duplicate processing blocked. See [Paystack payments](https://paystack.com/docs/payments/accept-payments/) and [webhooks](https://paystack.com/docs/payments/webhooks/).

## Checks

```sh
npm run typecheck
npm run build
# With an app server running and preview enabled:
TEST_URL=http://127.0.0.1:3100 npm run test:integration
```

`npm run test:responsive` also exercises the preview entry, step skipping, mobile navigation, investment creation, withdrawal submission, and staff-assisted forms. It requires an optional Playwright installation and a Chrome/Chromium executable. Set `TEST_URL` and, if needed, `CHROME_EXECUTABLE` and `PLAYWRIGHT_MODULE` to your test-tool locations. These tools are not application runtime dependencies.

The integration script creates an isolated preview workspace and checks investment creation, payment idempotency, top-ups, GIAP resale, withdrawal rules, PDF responses, role permissions, forged cookies, deferred routes, and real-database isolation.

## Infrastructure still required before live use

The current persistence is a local JSON file for one server process. Production rollout needs a transactional database, private object storage, backups, and monitoring. Uploaded files are currently validated and stored privately in the local database, served through authenticated endpoints. They are not yet in signed object storage.

Finance records references for transfers performed outside the app; the app does not initiate real Paystack transfers. Email templates and the outbox remain local records; email/SMS/push delivery, recurring statements/expiry reminders, mandatory admin TOTP, and full website CMS editing remain integration work. Paystack initialization, verification, and webhook handling need staging validation with account credentials. No live transactions were used during verification.

For the registration/KYC integration check, start an isolated test server with `DATABASE_PATH=/tmp/mycay-flow-test.json`, `ADMIN_EMAIL=flow-admin@example.test`, and a test-only `ADMIN_PASSWORD`. Run `TEST_URL=http://127.0.0.1:3110 TEST_ADMIN_PASSWORD=your-test-password npm run test:kyc`. The check creates synthetic accounts and requires a disposable database.

## Netlify deployment

Connect this repository and deploy the `main` branch. The root `netlify.toml` sets the base directory to the repository root, build command to `npm run build`, and publish directory to `.next`. Netlify detects Next.js and supplies its runtime adapter. Do not deploy the `public` directory or add an SPA redirect to `index.html`.

Set `SESSION_SECRET` and `NEXT_PUBLIC_APP_URL` in Netlify's environment variables before deploying authentication. `NEXT_PUBLIC_APP_URL` should be the full HTTPS site URL. Preview is disabled in production unless `ENABLE_PREVIEW=true` is explicitly set.

The public site can be deployed with this configuration. The current account/KYC store uses local JSON files and must move to persistent server-side storage before accounts and uploads can run reliably on Netlify Functions. Deploying the build does not provide a persistent database.

## Hosted review/demo on Vercel

For a review-only deployment, set `DEMO_MODE=true` and a strong `SESSION_SECRET` in Vercel's Production environment, then redeploy. `NEXT_PUBLIC_APP_URL` should be `https://mycayapp.vercel.app` (or your actual deployment domain).

Hosted demo mode keeps a compressed, AES-GCM-encrypted workspace in bounded HttpOnly cookies instead of the server filesystem. It works across separate serverless instances, is isolated per browser, and expires after two hours of inactivity. It is not persistent account storage and must not hold real investor or KYC data. Removing browser cookies resets the demo. Concurrent edits in multiple tabs can overwrite demo changes; use one tab while reviewing.

Registration creates a temporary demo account and signs it in. `/preview` is available in demo mode; choose Super Admin to review the admin app. Uploaded files are disabled; the KYC wizard permits skipping fields and files. Staff approval in this mode is illustrative. Payments remain simulated. Cookie state has a size limit, so this mode is intended for reviewing a few example investments, not retaining a large history.

Set `DEMO_MODE=false` for a real platform. The normal KYC/document approval checks remain enforced outside demo mode, and a durable database/object-storage integration is still required for real hosted accounts.

`npm run test:hosted-demo` tests registration, KYC, role switching, investment funding, login and tamper rejection across two local production servers. Start both with `DEMO_MODE=true`, the same test `SESSION_SECRET`, and distinct ports; set `TEST_URL` and `SECOND_TEST_URL`. The check verifies that the real local database is unchanged.

### Demo admin sign-in

With `DEMO_MODE=true`, `/login` displays the public review credentials:

- Email: `admin@mycayapp.demo`
- Password: `MyCayDemo2026!`

Use **Use demo admin details**, then **Sign In**. This opens an isolated Super Admin preview workspace, preserving the current browser's demo records. These credentials also work in local development. They are hidden and rejected on production deployments with demo mode disabled; they do not create or authenticate a real administrator account.
