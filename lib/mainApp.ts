/** Main marketing site (role selection, consumer signup). */
export const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:3000";

export const getMainAppRoleSelectionUrl = (): string =>
  `${MAIN_APP_URL}/signup/role-selection`;
