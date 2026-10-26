import { isHostedDemo } from "./state";

// Public review credentials. These never grant access to the real account database.
export const DEMO_ADMIN_EMAIL = "admin@mycayapp.demo";
export const DEMO_ADMIN_PASSWORD = "MyCayDemo2026!";
export const isDemoLoginEnabled = () =>
  isHostedDemo() || process.env.NODE_ENV === "development";
