"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        console.log("STATIC FORGOT PASSWORD", values.email);
        toast.success("Password reset link has been sent (static demo)");
        router.push("login");
      } catch {
        // interceptor handles error toast
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  
return (
    <main className="min-h-screen bg-gray-100">
      <div className="px-4 pt-4">
        </div>
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex bg-gray-100">
          <div className="mx-auto w-full max-w-xl px-8 py-8 sm:px-12 sm:py-12">
            <Image
              src="/auth/auth-logo.png"
              alt="Scoova"
              width={140}
              height={44}
              priority
              className="h-auto w-28 sm:w-32"
            />

            <div className="pt-3 sm:pt-8 lg:pt-20">
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
              <p className="mt-2 max-w-sm text-xl text-[#171923]">
                Reset your password to continue using Scoova safely.
              </p>

              <form className="mt-5 space-y-3 sm:mt-7 sm:space-y-4" onSubmit={formik.handleSubmit}>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter registered email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email ? formik.errors.email : undefined}
                  className="h-11 rounded-md border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-custom-teal focus:ring-custom-teal sm:h-12 sm:rounded-lg sm:px-4 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !formik.values.email}
                  className="mt-1 h-11 w-full rounded-full bg-custom-teal text-base font-semibold text-custom-white transition-colors hover:bg-blue-900 sm:h-12 sm:text-sm"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="relative hidden min-h-screen lg:block">
          <Image
            src="/auth/forgot-password.jpg"
            alt="Forgot password visual"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
            <div>
              <h2 className="text-5xl font-semibold text-white">Secure Access Matters.</h2>
              <p className="mx-auto mt-6 max-w-lg text-3xl leading-10 text-white">
                Reset your password to continue using Scoova safely.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
