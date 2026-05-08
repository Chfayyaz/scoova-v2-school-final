"use client";

import type { User } from "@/redux/slices/auth.slice";

export type SignupRole = "user" | "school" | "education-business";
type SignupStatus = "signup" | "plan" | "account-setup" | "verification" | "payment" | "confirmation";

const SUPER_ADMIN_URL = "https://scoova-super-admin.vercel.app/";
const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:3000";
const PROVIDER_APP_URL = process.env.NEXT_PUBLIC_PROVIDER_APP_URL ?? "http://localhost:3001";

export type PostLoginDecision =
  | { type: "redirect-super-admin"; url: string }
  | { type: "redirect-school-panel"; url: string }
  | { type: "show-admin-approval-pending"; email: string }
  | { type: "show-email-verification"; email: string; signupRole: SignupRole }
  | { type: "resume-signup"; path: string; signupRole: SignupRole; status: SignupStatus }
  | { type: "complete-login" };

const toSignupRole = (user: User): SignupRole => {
  if (user.platformRole === "PROVIDER") return "education-business";
  if (user.platformRole === "USER" && user.schoolRole && user.schoolRole !== "NONE") return "school";
  return "user";
};

const toSignupPath = (role: SignupRole): string => {
  if (role === "school") return "/signup/school";
  if (role === "education-business") return `${PROVIDER_APP_URL}/signup/education-business`;
  return `${MAIN_APP_URL}/signup/user`;
};

const getResumePathFromDoneStatus = (user: User, signupRole: SignupRole): string | null => {
  const basePath = toSignupPath(signupRole);
  const doneStatus = user.doneStatus as string | undefined;

  if (doneStatus === "register" || doneStatus === "mail-verification") {
    return `${basePath}?status=verification`;
  }

  if (doneStatus === "subscription-intent") {
    return `${basePath}?status=payment`;
  }

  if (doneStatus === "free-subscription" || doneStatus === "subscription-confirm") {
    return `${basePath}?status=confirmation`;
  }

  return null;
};

export const setSignupProgressRecord = (role: SignupRole, status: SignupStatus): void => {
  void role;
  void status;
};

export const clearSignupProgressRecord = (): void => {};

export const evaluatePostLoginDecision = (user: User): PostLoginDecision => {
  const platformRole = user.platformRole;
  const schoolRole = user.schoolRole ?? "NONE";
  const signupRole = toSignupRole(user);
  const email = typeof user.email === "string" ? user.email : "";

  if (platformRole === "PLATFORM_ADMIN") {
    return { type: "redirect-super-admin", url: SUPER_ADMIN_URL };
  }

  if (platformRole === "USER" && schoolRole !== "NONE") {
    return { type: "complete-login" };
  }

  if (platformRole === "USER" && schoolRole === "NONE" && user.adminApproval === false) {
    return { type: "show-admin-approval-pending", email };
  }

  if (user.isEmailVerified === false) {
    return { type: "show-email-verification", email, signupRole };
  }

  if (user.isSubscriber === false) {
    const resumePath = getResumePathFromDoneStatus(user, signupRole);
    if (resumePath) {
      const status: SignupStatus = resumePath.includes("status=payment")
        ? "payment"
        : resumePath.includes("status=confirmation")
          ? "confirmation"
          : "plan";
      return {
        type: "resume-signup",
        path: resumePath,
        signupRole,
        status,
      };
    }
    const status: SignupStatus = "plan";
    return {
      type: "resume-signup",
      path: `${toSignupPath(signupRole)}?status=${status}`,
      signupRole,
      status,
    };
  }

  return { type: "complete-login" };
};
