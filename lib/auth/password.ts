import crypto from "crypto";

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function validatePasswordCriteria(password: string): PasswordCriteria {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const criteria = validatePasswordCriteria(password);
  return (
    criteria.minLength &&
    criteria.hasUppercase &&
    criteria.hasNumber &&
    criteria.hasSpecial
  );
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashBuffer = crypto.scryptSync(password, salt, 64);
  return {
    hash: hashBuffer.toString("hex"),
    salt,
  };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(hash, "hex");
    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}
