"use client";

import { PublicRoute } from "@/lib/route-protection";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PublicRoute>{children}</PublicRoute>;
}
