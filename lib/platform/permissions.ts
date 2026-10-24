import { UserRole } from "@/lib/db/types";
export const capabilities = [
  "investors",
  "review",
  "finance",
  "content",
  "users",
  "audit",
  "settings",
] as const;
export type Capability = (typeof capabilities)[number];
export const defaultPermissions: Record<UserRole, Capability[]> = {
  INVESTOR: [],
  STAFF: ["investors", "review"],
  FINANCE: ["finance"],
  ADMIN: ["investors", "review", "finance", "content", "users", "audit"],
  SUPER_ADMIN: [...capabilities],
};
export function can(
  role: UserRole,
  capability: Capability,
  overrides?: Partial<Record<UserRole, Capability[]>>,
) {
  return (
    role === "SUPER_ADMIN" ||
    (overrides?.[role] || defaultPermissions[role] || []).includes(capability)
  );
}
export const isOperator = (role: string) =>
  ["STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].includes(role);
