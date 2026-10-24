# MyCayApp Figma screens

[Editable Figma file](https://www.figma.com/design/gSShkMvZor2DyLNT1CPcWs?node-id=264-7442)

- [Admin Investors: desktop](https://www.figma.com/design/gSShkMvZor2DyLNT1CPcWs?node-id=282-2963)
- [Admin Investors: mobile](https://www.figma.com/design/gSShkMvZor2DyLNT1CPcWs?node-id=282-3058)
- [Investor portal: desktop](https://www.figma.com/design/gSShkMvZor2DyLNT1CPcWs?node-id=290-3733)
- [Investor portal: mobile](https://www.figma.com/design/gSShkMvZor2DyLNT1CPcWs?node-id=290-3890)

The file contains 41 admin screens and 81 investor screens, including mobile navigation states. Screens use editable Satoshi Variable text, reusable components, and local color/spacing tokens.

Registration provides immediate portal access. Investors complete the seven-step KYC inside the portal; staff review submitted details and documents through Investors. There is no separate admin Onboarding module. KYC approval is required to invest.

The investor prototype includes registration, the seven KYC steps, submission and change-request states, overview, GIAP and WealthStream creation and payment, investment details, top-ups, withdrawal review/notice states, transactions, documents, notifications, profile, and settings. Prototype links support click-through review; file uploads, downloads, and form fields are design representations.

Desktop frames are 1440px wide; mobile frames are 390px wide. App browser checks additionally cover 360px, 768px and 1280px widths.

The implementation uses `/admin/investors/[id]` for independent investor records. Read-only KYC details are grouped by the same seven steps as the investor form; overall review follows the submitted details and documents. The local preview uses a separate `.next-preview` cache so production builds do not replace its running assets.
