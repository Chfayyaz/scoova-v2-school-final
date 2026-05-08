"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthLayout from "../components/AuthLayout";
import { getVerifyOtpConfig } from "../data";

const verifyOtpValidationSchema = Yup.object({
  otp: Yup.string()
    .required("Verification code is required")
    .length(6, "Code must be exactly 6 digits")
    .matches(/^\d+$/, "Code must contain only digits"),
});

export default function VerifyOtpPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: verifyOtpValidationSchema,
    onSubmit: (_values) => {
      // TODO: Implement OTP verification API call
      router.push("/");
    },
  });

  const config = {
    ...getVerifyOtpConfig(() => {}),
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
