"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux";
import { AUTHENTICATED_REDIRECT } from "./constants";

type PublicRouteProps = {
  children: ReactNode;
};

/**
 * Wraps public auth pages (login, forgot-password, verify-otp, update-password).
 * If the user is already authenticated (user in Redux), redirects to /dashboard.
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth?.user ?? null);

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(AUTHENTICATED_REDIRECT);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-custom-gray/80 text-sm">Redirecting to dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
