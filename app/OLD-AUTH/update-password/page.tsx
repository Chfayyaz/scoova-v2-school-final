"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { getUpdatePasswordConfig } from "../data";
import { resetPasswordApi } from "@/lib/api/auth.api";
import Link from "next/link";

const updatePasswordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

function UpdatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: updatePasswordValidationSchema,
    onSubmit: async (values) => {
      if (!token) {
        toast.error("Invalid reset link. Please request a new one.");
        return;
      }
      setIsSubmitting(true);
      try {
        await resetPasswordApi(token, values.newPassword);
        toast.success("Password updated successfully");
        router.replace("/login");
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              "Failed to reset password";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-custom-gray/10 p-8 text-center">
          <h1 className="text-xl font-bold text-custom-gray/95 mb-2">Invalid Reset Link</h1>
          <p className="text-custom-gray/80 text-sm mb-6">
            No reset token found. Please request a new password reset link.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block px-6 py-2.5 bg-custom-teal text-white font-medium rounded-full hover:bg-custom-green transition-colors"
          >
            Request Reset Link
          </Link>
          <Link href="/login" className="block mt-4 text-sm text-custom-teal hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const config = {
    ...getUpdatePasswordConfig(() => {}),
    buttonText: isSubmitting ? "Updating..." : "Update Password",
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

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-teal" />
        </div>
      }
    >
      <UpdatePasswordContent />
    </Suspense>
  );
}
