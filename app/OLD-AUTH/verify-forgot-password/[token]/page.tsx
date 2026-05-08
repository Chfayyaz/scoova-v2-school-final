"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { verifyForgotPasswordApi } from "@/lib/api/auth.api";
import Link from "next/link";

export default function VerifyForgotPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = typeof params?.token === "string" ? params.token : "";

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid reset link. Please request a new password reset.");
      return;
    }

    let cancelled = false;

    verifyForgotPasswordApi(token)
      .then(() => {
        if (!cancelled) {
          setStatus("success");
          router.replace(`/update-password?token=${encodeURIComponent(token)}`);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            err instanceof Error ? err.message : "Invalid or expired reset link. Please request a new one."
          );
          toast.error(
            err instanceof Error ? err.message : "Invalid or expired reset link.",
            { style: { background: "#ef4444", color: "#fff" } }
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-teal mx-auto mb-4" />
          <p className="text-custom-gray/80 text-sm">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-custom-gray/10 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-custom-gray/95 mb-2">
            Invalid or Expired Link
          </h1>
          <p className="text-custom-gray/80 text-sm mb-6">{errorMessage}</p>
          <Link
            href="/forgot-password"
            className="inline-block px-6 py-2.5 bg-custom-teal text-white font-medium rounded-full hover:bg-custom-green transition-colors"
          >
            Request New Reset Link
          </Link>
          <Link
            href="/login"
            className="block mt-4 text-sm text-custom-teal hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-teal mx-auto mb-4" />
        <p className="text-custom-gray/80 text-sm">Redirecting to update password...</p>
      </div>
    </div>
  );
}
