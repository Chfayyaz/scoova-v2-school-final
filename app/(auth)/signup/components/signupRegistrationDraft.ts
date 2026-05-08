"use client";

export type SignupDraftRole = "school" | "education-business" | "user";
export type SignupDraftPlan = "BASIC" | "PREMIUM" | "BUSINESS" | "PLUS";
export type SignupDraftBillingCycle = "monthly" | "yearly";

export interface SignupRegistrationDraft {
  role: SignupDraftRole;
  plan?: SignupDraftPlan;
  billingCycle?: SignupDraftBillingCycle;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  companyName?: string;
  websiteUrl?: string;
  billingEmail?: string;
  promotionEmailsOptIn?: boolean;
  productUpdatesOptIn?: boolean;
  offersOptIn?: boolean;
  stayInformedOptIn?: boolean;
}

const STORAGE_KEY = "scoova-signup-registration-draft";

function isRole(value: unknown): value is SignupDraftRole {
  return value === "school" || value === "education-business" || value === "user";
}

export function getSignupRegistrationDraft(): SignupRegistrationDraft | null {
  return null;
}

export function setSignupRegistrationDraft(draft: SignupRegistrationDraft): void {
  void draft;
}

export function patchSignupRegistrationDraft(
  role: SignupDraftRole,
  updates: Partial<SignupRegistrationDraft>
): SignupRegistrationDraft {
  const next: SignupRegistrationDraft = {
    role,
    ...updates,
  };
  return next;
}

export function clearSignupRegistrationDraft(): void {
  // No client-side signup draft persistence. Backend state is source of truth.
}

void STORAGE_KEY;
