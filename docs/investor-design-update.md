# Investor portal design update

Reference: Figma file `gSShkMvZor2DyLNT1CPcWs`, section `302:11944`.

The investor shell, authentication, dashboard, KYC, investments, documents, transactions, notifications, profile, and settings use the updated Satoshi Variable typography, charcoal header and gold actions. Original Figma assets are in `public/figma/investor`; their intrinsic SVG dimensions are recorded in `components/portal/figma-assets.json`.

Confirmed flow exceptions to the frames:

- Registration signs the investor in immediately. There is no registration approval gate.
- Investors complete seven-step KYC in the portal; staff review the submitted KYC.
- Properties browsing remains outside the current scope.
- GIAP and WealthStream remain in My Investments, including top-ups and withdrawals.
- Preview users can skip KYC fields and jump between steps. Hosted demo file upload restrictions remain active.
- Account totals, investments, documents and notifications come from application records rather than the Figma sample data.

Responsive navigation becomes a drawer below 1024px. Tables scroll inside their containers. Cards and form columns stack on small screens.

Validation: `npm run typecheck`, `npm run build`, and `npm run test:responsive` with an enabled preview server. The responsive check includes 360, 390, 768, 1280 and 1680px investor layouts, investment creation/withdrawal, and admin regression checks.
