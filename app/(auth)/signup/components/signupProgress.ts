"use client";

export type SignupRole = "user" | "school" | "education-business";
export type SignupStatus = "signup" | "plan" | "account-setup" | "verification" | "payment" | "confirmation";

export interface SignupProgressRecord {
  role: SignupRole;
  status: SignupStatus;
  roleLocked?: boolean;
}

const STORAGE_KEY = "scoova-signup-progress";

const PROVIDER_APP_URL =
  process.env.NEXT_PUBLIC_PROVIDER_APP_URL ?? "http://localhost:3001";

const ROLE_PATHS: Record<SignupRole, string> = {
  user: "/signup/user",
  school: "/signup/school",
  "education-business": `${PROVIDER_APP_URL}/signup/education-business`,
};

const ROLE_ALLOWED_STATUS: Record<SignupRole, SignupStatus[]> = {
  user: ["signup", "verification", "plan", "payment", "confirmation"],
  school: ["plan", "account-setup", "verification", "payment", "confirmation"],
  "education-business": ["plan", "account-setup", "verification", "payment", "confirmation"],
};

export function getSignupStartStatus(role: SignupRole): SignupStatus {
  return role === "user" ? "signup" : "plan";
}

export function getSignupPath(role: SignupRole): string {
  return ROLE_PATHS[role];
}

export function isStatusAllowedForRole(role: SignupRole, status: string | null): status is SignupStatus {
  if (!status) return false;
  return ROLE_ALLOWED_STATUS[role].includes(status as SignupStatus);
}

export function getSignupProgress(): SignupProgressRecord | null {
  return null;
}

export function setSignupProgress(record: SignupProgressRecord): void {
  void record;
}

export function getSignupProgressUrl(record: SignupProgressRecord): string {
  return `${ROLE_PATHS[record.role]}?status=${record.status}`;
}

void STORAGE_KEY;
