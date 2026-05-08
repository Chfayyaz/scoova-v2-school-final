"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { getForgotPasswordConfig } from "../data";
import PasswordResetSuccessModal from "@/components/ui/PasswordResetSuccessModal";
import { forgotPasswordApi } from "@/lib/api/auth.api";

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
    
      try {
        const res = await forgotPasswordApi(values.email.trim());

        if (res.success) {
          toast.success(res.message || "Reset link sent.");
          setShowSuccessModal(true);
        } else {
          toast.error(res.message || "Failed to send reset link");
        }
    
      } catch (err:any) {
    
        toast.error(
          err.response?.data?.message ||
          err.message ||
          "Server error"
        );
    
      } finally {
        setIsSubmitting(false);
      }
    }
    
  });

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push("/login");
  };

  const config = {
    ...getForgotPasswordConfig(() => {}),
    buttonText: isSubmitting ? "Sending..." : "Send Reset Link",
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

  return (
    <>
      <AuthLayout {...config} />
      <PasswordResetSuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />
    </>
  );
}
