"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AuthSplitLayout from "../signup/components/AuthSplitLayout";
import { getSignupProgress, getSignupProgressUrl } from "../signup/components/signupProgress";
import Input from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/redux";
import { loginSuccess, type User } from "@/redux/slices/auth.slice";
import {
  clearSignupProgressRecord,
  evaluatePostLoginDecision,
  setSignupProgressRecord,
} from "@/lib/auth/postLoginFlow";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAdminApprovalModal, setShowAdminApprovalModal] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const result: { success: boolean; message: string; accessToken: string; user: User } = {
          success: true,
          message: "Login successful (static demo)",
          accessToken: "static-demo-token",
          user: {
            id: "static-user",
            name: values.email.split("@")[0] || "Demo User",
            email: values.email.trim(),
            platformRole: "USER",
            schoolRole: "NONE",
            isSubscriber: false,
            school: null,
            profileImage: null,
            lastLogin: null,
          },
        };

        const decision = evaluatePostLoginDecision(result.user);

        if (decision.type === "redirect-super-admin") {
          clearSignupProgressRecord();
          window.location.href = decision.url;
          return;
        }

        if (decision.type === "redirect-school-panel") {
          clearSignupProgressRecord();
          window.location.href = decision.url;
          return;
        }

        if (decision.type === "show-admin-approval-pending") {
          clearSignupProgressRecord();
          setVerificationEmail(decision.email || values.email.trim());
          setShowAdminApprovalModal(true);
          return;
        }

        if (decision.type === "show-email-verification") {
          setSignupProgressRecord(decision.signupRole, "verification");
          setVerificationEmail(decision.email || values.email.trim());
          setShowVerificationModal(true);
          return;
        }

        if (decision.type === "resume-signup") {
          setSignupProgressRecord(decision.signupRole, decision.status);
          router.replace(decision.path.replace("/signup", "/signup"));
          return;
        }

        clearSignupProgressRecord();
        dispatch(loginSuccess({ user: result.user, accessToken: result.accessToken }));
        toast.success(result.message || "Login successful.");
        router.replace("/");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed. Please try again.";
        if (message === "Verification from admin is pending.") {
          setVerificationEmail(values.email.trim());
          setShowAdminApprovalModal(true);
        } else {
          toast.error(message);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/");
      return;
    }
    const signupProgress = getSignupProgress();
    if (!signupProgress?.roleLocked) return;
    router.replace(getSignupProgressUrl(signupProgress));
  }, [isAuthenticated, router, user]);

  useEffect(() => {
    const pending = searchParams.get("pending");
    const email = searchParams.get("email");
    if (!pending) return;

    if (pending === "verification") {
      setVerificationEmail(email ? decodeURIComponent(email) : "");
      setShowVerificationModal(true);
    }

    if (pending === "admin-approval") {
      setVerificationEmail(email ? decodeURIComponent(email) : "");
      setShowAdminApprovalModal(true);
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!verificationEmail || isResendingVerification) return;
    setIsResendingVerification(true);
    try {
      console.log("STATIC RESEND VERIFICATION", verificationEmail.trim());
      toast.success("Verification email sent (static demo).");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to resend verification email.";
      toast.error(message);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      console.log("STATIC GOOGLE LOGIN");
      toast.success("Google sign in started (static demo)");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start Google sign in. Please try again.";
      toast.error(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (isAppleLoading) return;
    setIsAppleLoading(true);
    try {
      console.log("STATIC APPLE LOGIN");
      toast.success("Apple sign in started (static demo)");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start Apple sign in. Please try again.";
      toast.error(message);
    } finally {
      setIsAppleLoading(false);
    }
  };

  
return (
    <AuthSplitLayout>
      <div className="mx-auto max-w-md pt-3 sm:pt-8 lg:pt-8">
        <h1 className="text-2xl font-bold text-gray-900 ">Login</h1>
        <p className="mt-2 text-xl text-[#171923] ">
          Explore the education ecosystem.
        </p>

        <form className="mt-5 space-y-3 sm:mt-7 sm:space-y-4" onSubmit={formik.handleSubmit}>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : undefined}
            className="h-11 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-custom-teal focus:ring-0 shadow-none sm:h-12 sm:rounded-lg sm:px-4 sm:text-sm"
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : undefined}
            className="h-11 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-custom-teal focus:ring-0 shadow-none sm:h-12 sm:rounded-lg sm:px-4 sm:text-sm"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 sm:text-sm">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              Remember me
            </label>
            <Link
              href="forgot-password"
              className="text-sm font-medium text-custom-teal underline  sm:text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-11 w-full rounded-full bg-custom-teal text-base font-semibold text-custom-white transition-colors hover:bg-blue-900 sm:h-12 sm:text-sm"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <hr className="my-4 border-gray-300" />
        <div className="space-y-3">
          <SocialLoginButton
            label={isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
            icon={<GoogleIcon />}
            onClick={() => {
              void handleGoogleLogin();
            }}
            disabled={isGoogleLoading}
          />
          <SocialLoginButton
            label={isAppleLoading ? "Redirecting to Apple..." : "Continue with Apple"}
            icon={<AppleIcon />}
            onClick={() => {
              void handleAppleLogin();
            }}
            disabled={isAppleLoading}
          />
        </div>
      </div>
      {showVerificationModal && (
        <StatusModal
          variant="verification"
          title="Verify your email to continue"
          description={`A verification link has already been sent to ${verificationEmail || "your email address"}. Please check your inbox and spam folder to activate your account.`}
          helperText="Didn't receive the email yet?"
          actionLabel={isResendingVerification ? "Sending..." : "Send again"}
          onAction={() => {
            void handleResendVerification();
          }}
          actionDisabled={isResendingVerification || !verificationEmail}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
      {showAdminApprovalModal && (
        <StatusModal
          variant="pending"
          title="Verification Request Submitted"
          description={`Your details have been successfully submitted for verification. Our admin team will review your information and approve your account.\n\nOnce approved, you will gain full access to your dashboard.`}
          helperText="This may take up to 24-48 hours."
          onClose={() => setShowAdminApprovalModal(false)}
        />
      )}
    </AuthSplitLayout>
  );
}

function SocialLoginButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#CBD5E0] bg-[#F7FAFC] px-4 text-sm font-medium text-gray-700 shadow-[inset_0_2px_0_0_#E7EBEE33] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-sm"
    >
      <span className="text-gray-900">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.987" fillRule="evenodd" clipRule="evenodd" d="M8.19383 0.0835313C9.19071 -0.0278438 9.78058 -0.0278438 10.8517 0.0835313C12.7477 0.364162 14.5054 1.24057 15.8705 2.58603C14.948 3.45797 14.0377 4.34264 13.1397 5.23978C11.42 3.78228 9.50054 3.44586 7.38121 4.23053C5.82654 4.94553 4.74396 6.1042 4.13346 7.70653C3.13582 6.9638 2.15117 6.20377 1.17996 5.42678C1.11247 5.39125 1.03538 5.37825 0.959961 5.38966C2.50271 2.41507 4.91354 0.645906 8.19246 0.0821562" fill="#F44336"/>
      <path opacity="0.997" fillRule="evenodd" clipRule="evenodd" d="M0.957347 5.39013C1.03526 5.37821 1.10906 5.39058 1.17872 5.42725C2.14993 6.20424 3.13458 6.96427 4.13222 7.707C3.97523 8.33133 3.87627 8.96883 3.8366 9.61138C3.87051 10.2329 3.96905 10.8429 4.13222 11.4415L1.0316 13.9096C-0.318653 11.0881 -0.343403 8.24829 0.957347 5.39013Z" fill="#FFC107"/>
      <path opacity="0.999" fillRule="evenodd" clipRule="evenodd" d="M15.7233 16.8983C14.7579 16.0468 13.7472 15.2482 12.6956 14.5058C13.7498 13.7614 14.3896 12.7403 14.6151 11.4423H9.44922V7.8549C12.4284 7.83015 15.4062 7.85536 18.3826 7.93052C18.9473 10.9968 18.2951 13.7614 16.426 16.2245C16.2037 16.4608 15.9683 16.6857 15.7233 16.8983Z" fill="#448AFF"/>
      <path opacity="0.993" fillRule="evenodd" clipRule="evenodd" d="M4.13236 11.4424C5.25986 14.2446 7.32695 15.5527 10.3336 15.3666C11.1776 15.2689 11.9868 14.9741 12.6959 14.5059C13.7482 15.2502 14.7574 16.0477 15.7236 16.8984C14.1928 18.274 12.2409 19.0902 10.1865 19.2139C9.71973 19.2512 9.25074 19.2512 8.78399 19.2139C5.28415 18.8014 2.70007 17.0331 1.03174 13.9091L4.13236 11.4424Z" fill="#3F5893"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.1509 17.8747C16.3901 19.0113 15.5834 20.1205 14.3551 20.1388C13.1268 20.1663 12.7326 19.4147 11.3393 19.4147C9.93677 19.4147 9.50594 20.1205 8.34177 20.1663C7.14094 20.2122 6.23344 18.9563 5.46344 17.8472C3.89594 15.583 2.6951 11.4122 4.30844 8.60717C5.10594 7.21384 6.53594 6.33384 8.0851 6.30634C9.25844 6.28801 10.3768 7.10384 11.1009 7.10384C11.8159 7.10384 13.1726 6.12301 14.5934 6.26967C15.1893 6.29717 16.8576 6.50801 17.9301 8.08467C17.8476 8.13967 15.9409 9.25801 15.9593 11.5772C15.9868 14.3455 18.3884 15.2713 18.4159 15.2805C18.3884 15.3447 18.0309 16.6005 17.1509 17.8747ZM11.9168 3.20801C12.5859 2.44717 13.6951 1.86967 14.6118 1.83301C14.7309 2.90551 14.3001 3.98717 13.6584 4.75717C13.0259 5.53634 11.9809 6.14134 10.9543 6.05884C10.8168 5.00467 11.3301 3.90467 11.9168 3.20801Z" fill="black"/>
    </svg>
  );
}

function StatusModal({
  variant = "verification",
  title,
  description,
  helperText,
  actionLabel,
  onAction,
  actionDisabled,
  onClose,
}: {
  variant?: "verification" | "pending";
  title: string;
  description: string;
  helperText?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  onClose: () => void;
}) {
  if (variant === "pending") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-xl rounded-3xl bg-[#F5F7FB] px-5 py-7 shadow-2xl sm:px-7 sm:py-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#DDF7EC]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#11BF8A] text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="mx-auto max-w-lg text-center text-3xl font-bold text-[#111C3D] ">
            {title}
          </h2>

          <div className="mx-auto mt-5 max-w-lg text-center text-base leading-8 text-[#475569] sm:text-md sm:leading-9">
            <p>
              Your details have been successfully submitted for verification. Our admin team will
              review your information and approve your account.
            </p>
            <p className="mt-4">
              Once approved, you will gain full access to your dashboard.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="mx-auto mt-7 block h-12 w-full max-w-lg cursor-not-allowed rounded-full bg-[#D5D7DD] text-lg font-semibold text-white sm:text-xl"
          >
            Go to Dashboard
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#8CA0BD] sm:text-base">
            <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{helperText || "This may take up to 24-48 hours."}</span>
          </div>

         
        </div>
      </div>
    );
  }

  const badgeClass =
    variant === "verification" ? "bg-custom-teal/10 text-custom-teal" : "bg-amber-100 text-amber-700";
  const badgeText = variant === "verification" ? "Email Verification Required" : "Approval Required";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}
        >
          {badgeText}
        </div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
        {helperText ? <p className="mt-5 text-sm font-medium text-gray-800">{helperText}</p> : null}
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            disabled={actionDisabled}
            className="mt-3 h-10 rounded-full bg-custom-teal px-5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-10 w-full rounded-full border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}
