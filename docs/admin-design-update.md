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

## Update from section 304:7843

All 16 frames in [the newer Admin section](https://www.figma.com/design/gSShkMvZor2DyLNT1CPcWs/Untitled?node-id=304-7843) were retrieved with high-fidelity context and screenshots. This resolves the earlier access limitation for the screens included in that section.

- Investor profiles now have Profile, Investments, Communication log and Audit log tabs. The Profile tab includes documents and KYC review; communications use a separate message draft from the KYC review note. Tabs support keyboard navigation.
- Team accounts use a table and a selected-account access panel. Role updates require Save access; reset, deactivation, reactivation and account creation keep their existing server authorization.
- The audit search and CSV export share a toolbar, with a compact version inside the investor audit tab.
- Overview follows its light header/sidebar frame; operational pages retain their dark sidebars. Frame-specific SVGs and intrinsic dimensions are recorded in `design-sets.json` and `figma-assets.json`.
- Admin and investor desktop sidebars stay pinned below their preview bar/header, with their own vertical scrolling when needed. A ResizeObserver tracks the preview bar height so wrapping does not obscure navigation.
- `npm run test:workspace-navigation` checks real page scrolling, preview/header offsets, keyboard tabs and mobile drawer scroll locking. `npm run test:admin-design` also covers Overview and all investor detail tabs.

Design example names, personal information and amounts remain dynamic application records, rather than copied fixture content.
