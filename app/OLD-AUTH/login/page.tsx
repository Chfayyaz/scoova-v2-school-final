"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux";
import { login, logout } from "@/redux/slices/auth.slice";
import { loginApi, logoutApi } from "@/lib/api/auth.api";
import { ROUTES } from "@/lib/route-protection/constants";
import AuthLayout from "../components/AuthLayout";
import { getLoginConfig } from "../data";

const ALLOWED_PLATFORM_ROLE = "USER";
const ALLOWED_SCHOOL_ROLE = "SCHOOL_ADMIN";
const EXTERNAL_REDIRECT_URL = "https://scoova-website-latest.vercel.app/";

function getLoginFailureMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: unknown } }).response?.data;
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message: unknown }).message;
      if (typeof m === "string" && m.trim()) return m;
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return "Login failed. Please try again.";
}

function showRestrictedAccessPopupIfNeeded(message: string): boolean {
  const normalized = message.toLowerCase();
  if (
    typeof window !== "undefined" &&
    normalized.includes("school access is currently restricted")
  ) {
    window.dispatchEvent(
      new CustomEvent("access-restricted-popup", {
        detail: { message },
      })
    );
    return true;
  }
  return false;
}

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const result = await loginApi({
          email: values.email,
          password: values.password,
        });
        const platformRole = String(result.user.platformRole ?? "").toUpperCase();
        const schoolRole = String(result.user.schoolRole ?? "").toUpperCase();

        const isAllowedUser =
          platformRole === ALLOWED_PLATFORM_ROLE &&
          schoolRole === ALLOWED_SCHOOL_ROLE;

        if (!isAllowedUser) {
          try {
            await logoutApi();
          } catch {
            // Ignore logout API errors; still clear client state
          }
          dispatch(logout());
          window.location.href = EXTERNAL_REDIRECT_URL;
          return;
        }

          dispatch(login({ user: result.user, accessToken: result.token ?? null }));
          toast.success(result.message || "Successfully signed in");
          router.push(ROUTES.DASHBOARD);
        } catch (err) {
          const message = getLoginFailureMessage(err);
          if (showRestrictedAccessPopupIfNeeded(message)) {
            return;
          }
          toast.error(message, {
            style: { background: "#ef4444", color: "#fff" },
          });
        } finally {
          setIsSubmitting(false);
        }
      },
  });

  const config = {
    ...getLoginConfig(() => {}),
    buttonText: isSubmitting ? "Signing in..." : "Login",
    formik: {
      values: formik.values,
      errors: formik.errors,
      touched: formik.touched,
      handleChange: formik.handleChange,
      handleBlur: formik.handleBlur,
      handleSubmit: formik.handleSubmit,
      setFieldValue: formik.setFieldValue,
      setFieldTouched: formik.setFieldTouched,
    },
  };

  return <AuthLayout {...config} />;
}
