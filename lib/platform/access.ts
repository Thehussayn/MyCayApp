import { getCurrentSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/db";
import { getConfig } from "./config";
import { can, Capability, isOperator } from "./permissions";
export function operator(capability?: Capability) {
  const session = getCurrentSession();
  const user = session && findUserById(session.userId);
  if (
    !user ||
    user.disabled ||
    user.mustChangePassword ||
    !isOperator(user.role)
  )
    return null;
  if (capability && !can(user.role, capability, getConfig().permissions))
    return null;
  return user;
}
