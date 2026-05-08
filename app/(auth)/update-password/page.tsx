"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthScreenSkeleton } from "@/components/ui/Skeleton";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      return;
    }

    toast.error("Invalid or missing reset token");
    router.push("login");
  }, [router, searchParams]);

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    onSubmit: async (values) => {
      if (!token) {
        toast.error("Reset token is missing");
        return;
      }

      setIsSubmitting(true);
      try {
        console.log("STATIC PASSWORD UPDATE", token);
        toast.success("Password updated successfully (static demo)");
        router.push("login");
      } catch {
        // interceptor handles error toast
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!token) {
    return <AuthScreenSkeleton />;
  }

  
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
              <h1 className="text-2xl font-bold text-gray-900">Update Password</h1>
              <p className="mt-2 max-w-sm text-xl text-[#171923]">
                Update your password to continue using Scoova safely.
              </p>

              <form className="mt-5 space-y-3 sm:mt-7 sm:space-y-4" onSubmit={formik.handleSubmit}>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password ? formik.errors.password : undefined}
                  className="h-11 rounded-md border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-custom-teal focus:ring-custom-teal sm:h-12 sm:rounded-lg sm:px-4 sm:text-sm"
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined
                  }
                  className="h-11 rounded-md border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-custom-teal focus:ring-custom-teal sm:h-12 sm:rounded-lg sm:px-4 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !formik.values.password || !formik.values.confirmPassword}
                  className="mt-1 h-11 w-full rounded-full bg-custom-teal text-base font-semibold text-custom-white transition-colors hover:bg-blue-900 sm:h-12 sm:text-sm"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="relative hidden min-h-screen lg:block">
          <Image
            src="/auth/update-password.jpg"
            alt="Update password visual"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
            <div>
              <h2 className="text-5xl font-semibold text-white">Protect your account.</h2>
              <p className="mx-auto mt-6 max-w-lg text-3xl leading-10 text-white">
                Set a new password to keep your data secure.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
