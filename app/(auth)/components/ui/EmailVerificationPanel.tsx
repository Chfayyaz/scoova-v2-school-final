"use client";

import { Lock, Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface EmailVerificationPanelProps {
  title?: string;
  description?: string;
  resendLabel?: string;
  onResend?: () => void | Promise<void>;
  isLoading?: boolean;
  loadingText?: string;
  resendCooldownSeconds?: number;
  resendCooldownStorageKey?: string;
  statusMessage?: string | null;
  statusTone?: "default" | "success" | "error";
  restrictionsTitle?: string;
  restrictions: string[];
  className?: string;
}

export default function EmailVerificationPanel({
  title = "Verify your Email to activate all features",
  description = "We've sent a verification email to your registered email address. Please verify your email to continue setting up your account and access all dashboard features.",
  resendLabel = "Resend verification email",
  onResend,
  isLoading = false,
  loadingText = "Verifying your email...",
  resendCooldownSeconds = 0,
  resendCooldownStorageKey,
  statusMessage = null,
  statusTone = "default",
  restrictionsTitle = "Users can enter the dashboard, but certain actions are disabled until verified, such as:",
  restrictions,
  className = "",
}: EmailVerificationPanelProps) {
  const [isResending, setIsResending] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const isResendDisabled = isLoading || isResending || remainingSeconds > 0;
  const effectiveResendLabel = useMemo(() => {
    if (isResending) return "Resending...";
    if (remainingSeconds > 0) return `${resendLabel} (${remainingSeconds}s)`;
    return resendLabel;
  }, [isResending, remainingSeconds, resendLabel]);

  useEffect(() => {
    if (!resendCooldownStorageKey || typeof window === "undefined") return;
    const rawValue = window.localStorage.getItem(resendCooldownStorageKey);
    if (!rawValue) return;
    const expiresAt = Number(rawValue);
    if (!Number.isFinite(expiresAt)) return;
    const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    setRemainingSeconds(remaining);
  }, [resendCooldownStorageKey]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const handleResendClick = async () => {
    if (!onResend || isResendDisabled) return;
    setIsResending(true);
    try {
      await onResend();
      const cooldownSeconds = Math.max(0, resendCooldownSeconds);
      setRemainingSeconds(cooldownSeconds);
      if (resendCooldownStorageKey && typeof window !== "undefined") {
        const expiresAt = Date.now() + cooldownSeconds * 1000;
        window.localStorage.setItem(resendCooldownStorageKey, `${expiresAt}`);
      }
    } finally {
      setIsResending(false);
    }
  };

  const statusClassName =
    statusTone === "error"
      ? "bg-red-50 text-red-700 border border-red-200"
      : statusTone === "success"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : "bg-slate-50 text-slate-700 border border-slate-200";

  return (
    <div className={`space-y-6 ${className}`}>
      <section className="mx-auto max-w-xl rounded-2xl bg-custom-white px-6 py-8 text-center shadow-xl sm:px-10 sm:py-10">
        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-custom-teal shadow-lg">
          <Mail className="h-7 w-7 text-custom-white" />
          <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white ring-2 ring-white">
            !
          </span>
        </div>

        <h2 className="mx-auto max-w-md text-xl font-bold text-gray-900 sm:text-2xl sm:leading-tight">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-gray-600 sm:leading-relaxed">
          {description}
        </p>
        {isLoading && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            {loadingText}
          </div>
        )}
        {statusMessage && (
          <p className={`mx-auto mt-4 max-w-md rounded-lg px-3 py-2 text-sm ${statusClassName}`}>
            {statusMessage}
          </p>
        )}
      </section>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            void handleResendClick();
          }}
          disabled={isResendDisabled}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-custom-teal px-6 text-sm font-semibold text-custom-white transition hover:brightness-95"
        >
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-4"
            aria-hidden="true"
          >
            <path d="M16 24H0V0H16V24Z" stroke="#E5E7EB" />
            <g clipPath="url(#resend-mail-icon-clip)">
              <path
                d="M15.566 4.17512C15.8816 4.39387 16.0472 4.77199 15.9878 5.15012L13.9878 18.1501C13.941 18.4532 13.7566 18.7189 13.4878 18.8689C13.2191 19.0189 12.8972 19.0376 12.6128 18.9189L8.87533 17.3657L6.7347 19.6814C6.45658 19.9845 6.01908 20.0845 5.6347 19.9345C5.25033 19.7845 5.00033 19.4126 5.00033 19.0001V16.3876C5.00033 16.2626 5.0472 16.1439 5.13158 16.0532L10.3691 10.3376C10.5503 10.1407 10.5441 9.83762 10.3566 9.65012C10.1691 9.46262 9.86595 9.45012 9.66908 9.62824L3.31283 15.2751L0.553451 13.8939C0.222201 13.7282 0.00970049 13.397 0.000325486 13.0282C-0.00904951 12.6595 0.184701 12.3157 0.503451 12.1314L14.5035 4.13137C14.8378 3.94074 15.2503 3.95949 15.566 4.17512Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="resend-mail-icon-clip">
                <path d="M0 4H16V20H0V4Z" fill="white" />
              </clipPath>
            </defs>
          </svg>
          {effectiveResendLabel}
        </button>
      </div>

      <section className="rounded-2xl border-l-4 border-custom-teal bg-custom-white px-5 py-5 shadow-lg sm:px-7 sm:py-6">
        <p className="flex items-start gap-2 text-sm text-gray-800">
          <Lock className="mt-0.5 h-4 w-4 text-red-500" />
          <span>{restrictionsTitle}</span>
        </p>

        <ul className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-3">
          {restrictions.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-custom-teal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
