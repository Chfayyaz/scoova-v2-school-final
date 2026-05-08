export const ROUTES = {
  LOGIN: "/login",
  /** Main dashboard (root); use AUTHENTICATED_REDIRECT for redirecting logged-in users from auth pages */
  DASHBOARD: "/",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  UPDATE_PASSWORD: "/update-password",
} as const;

/** Where to send authenticated users who hit public auth pages (login, forgot-password, etc.) */
export const AUTHENTICATED_REDIRECT = ROUTES.DASHBOARD;

export const PUBLIC_PATHS: string[] = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.VERIFY_OTP,
  ROUTES.UPDATE_PASSWORD,
];
