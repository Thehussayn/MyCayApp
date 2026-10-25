# Admin design update

Source: [MyCay App / Desktop Investors](https://www.figma.com/design/KNot20kP9yFxtm5UBACBam/MyCay-App?node-id=131-8720).

The linked Investors frame supplies the shared admin styling: dark sidebar, gold selected navigation and actions, Satoshi Variable, pale gold metric cards, neutral canvas, rounded panels and table styling. This shell is applied consistently across admin, including views whose older retrieved frames have a white header/sidebar.

Changes include:

- Responsive desktop sidebar and mobile navigation drawer, with the signed-in operator and role.
- Investor directory with real summary counts, search, complete KYC status filters, CSV export, add-investor view and independent investor profiles.
- Finance ledger metrics, payout schedule table and selected payout form; existing allocation, resale, withdrawal, reconciliation, reports and exchange-rate actions remain connected.
- Article directory and separate editor.
- Separate plan-settings and role-permissions views, grouped plan limits, WealthStream terms and account rules.
- Shared forms, status badges, tables and buttons across profile, KYC review, staff-assisted profile, team and audit screens. Audit search and CSV export follow the retrieved frame layout.

Registration remains immediate access, with staff reviewing the submitted seven-step KYC inside Investors. There is no separate onboarding module or investor property-browsing feature. Administrative GIAP property allocation remains available. Role capabilities and server authorization are unchanged.

## Figma access limitation

High-fidelity context and screenshots were retrieved for Investors, Add investor, Investment ledger, GIAP allocation, Payouts, Reconciliation, Reports/exchange rate, Content, Article editor, Audit and Plan settings.

Figma returned its Starter-plan MCP call-limit error for Overview, Investor profile, Investor KYC review, Staff-assisted profile, GIAP resale, Withdrawal review, Team, Add team member and Role permissions. Those views retain their existing functional structure and receive the shared styling. Their exact frame-specific layouts have not been verified against this file.

## Validation

- `npm run typecheck`
- `npm run build`
- `npm run test:integration` against an enabled preview server: role permissions, preview isolation, funding, allocation/resale, payouts, withdrawals and PDF exports.
- `npm run test:admin-design`: admin screens at 360, 390, 768 and 1440px, investor/add/profile views, content editor, finance/settings tabs, mobile navigation and original SVG loading/intrinsic geometry. Set `TEST_URL`, `PLAYWRIGHT_MODULE` and optionally `CHROME_EXECUTABLE` for your local setup.

The original SVGs are stored in `public/figma/admin`, with their root dimensions in `components/admin/figma-assets.json`. Figma sample names, account totals and ledger entries are not embedded in production UI.
