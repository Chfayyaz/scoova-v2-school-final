"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux";
import type { User } from "@/redux/slices/auth.slice";
import { AuthScreenSkeleton } from "@/components/ui/Skeleton";

export type RequiredRole = "PLATFORM_ADMIN" | string[];

interface RouteProtectionOptions {
  requireAuth?: boolean;
  guestOnly?: boolean;
  requireRole?: RequiredRole;
  redirectTo?: string;
  allowAuthenticatedPaths?: string[];
}

export const hasRequiredRole = (user: User | null, requiredRole?: string | string[]): boolean => {
  if (!requiredRole) return true;
  if (!user || !user.platformRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.platformRole);
  }

  return user.platformRole === requiredRole;
};

export const isAuthenticatedUser = (user: User | null): boolean => {
  return !!user && !!user.platformRole;
};

export const useRouteProtection = (options: RouteProtectionOptions = {}) => {
  const {
    requireAuth = false,
    guestOnly = false,
    requireRole,
    redirectTo,
    allowAuthenticatedPaths = [],
  } = options;

  const effectiveRedirectTo = redirectTo ?? (guestOnly ? "/" : "/login");

  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, authLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    hasRedirectedRef.current = false;
  }, [effectiveRedirectTo, guestOnly, requireAuth]);

  useEffect(() => {
    if (authLoading) {
      setIsChecking(true);
      return;
    }

    const authenticated = !!user && isAuthenticatedUser(user);

    if (guestOnly) {
      if (authenticated) {
        if (allowAuthenticatedPaths.includes(pathname)) {
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.replace(effectiveRedirectTo);
        }
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    if (!requireAuth) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    if (!user || !authenticated) {
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace(effectiveRedirectTo);
      }
      setIsAuthorized(false);
      setIsChecking(false);
      return;
    }

    if (requireRole) {
      const hasRole = hasRequiredRole(user, requireRole);
      if (!hasRole) {
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.replace("/unauthorized");
        }
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [
    user,
    requireAuth,
    guestOnly,
    requireRole,
    effectiveRedirectTo,
    router,
    authLoading,
    allowAuthenticatedPaths,
    pathname,
  ]);

  return {
    isChecking,
    isAuthorized,
    isAuthenticated,
    user,
  };
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  guestOnly?: boolean;
  allowAuthenticatedPaths?: string[];
  requireRole?: RequiredRole;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuestProtectedRoute({
  children,
  requireAuth = false,
  guestOnly = false,
  allowAuthenticatedPaths,
  requireRole,
  redirectTo,
  fallback = null,
}: ProtectedRouteProps) {
  const effectiveRedirectTo = redirectTo ?? (guestOnly ? "/" : "/login");
  const { isChecking, isAuthorized } = useRouteProtection({
    requireAuth,
    guestOnly,
    allowAuthenticatedPaths,
    requireRole,
    redirectTo: effectiveRedirectTo,
  });

  if (isChecking) {
    return fallback || <AuthScreenSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
