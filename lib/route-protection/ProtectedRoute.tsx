"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux";
import { ROUTES } from "./constants";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth?.user ?? null);

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-custom-gray/80 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
