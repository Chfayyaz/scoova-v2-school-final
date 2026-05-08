"use client";

import type { ReactNode } from "react";
import { AuthGuestProtectedRoute } from "@/lib/auth-route-protection";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuestProtectedRoute
      guestOnly
      redirectTo="/"
      allowAuthenticatedPaths={[
        "/signup",
        "/signup/school",
        "/signup/user",
        "/signup/google/callback",
      ]}
    >
      {children}
    </AuthGuestProtectedRoute>
  );
}
