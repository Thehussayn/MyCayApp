import { getDb } from "@/lib/db";
import { Capability } from "./permissions";
import { UserRole } from "@/lib/db/types";
export interface PlatformConfig {
  giapMin: number;
  giapMax: number;
  wealthstreamMin: number;
  wealthstreamMax: number;
  monthlyRate: number;
  annualRate: number;
  noticeDays: number;
  ngnPerUsd: number;
  allowMultipleInvestments: boolean;
  allowMultiplePlans: boolean;
  permissions: Partial<Record<UserRole, Capability[]>>;
}
export const defaults: PlatformConfig = {
  giapMin: 5000000,
  giapMax: 100000000,
  wealthstreamMin: 5000000,
  wealthstreamMax: 100000000,
  monthlyRate: 0.24,
  annualRate: 0.2,
  noticeDays: 30,
  ngnPerUsd: 0,
  allowMultipleInvestments: true,
  allowMultiplePlans: true,
  permissions: {},
};
export function getConfig(): PlatformConfig {
  return { ...defaults, ...getDb().platformConfig };
}
