import type { ChangeEvent, FocusEvent, FormEvent } from "react";

export type AuthInputField = {
  name: string;
  type: "text" | "email" | "password";
  label: string;
  placeholder: string;
  htmlFor?: string;
  showPasswordToggle?: boolean;
};

export type AuthDescription = {
  text: string;
  linkText?: string;
  linkHref?: string;
  inline?: boolean;
};

export type AuthSecondaryAction = {
  left?: {
    type: "checkbox";
    id: string;
    label: string;
  };
  right?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
};

export type AuthFormikBag = {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (e: ChangeEvent<unknown>) => void;
  handleBlur: (e: FocusEvent<unknown>) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
  setFieldValue: (field: string, value: string) => void;
  setFieldTouched: (field: string, touched?: boolean) => void;
};

export type AuthFormConfig = {
  title: string;
  description?: AuthDescription;
  inputs: AuthInputField[];
  buttonText: string;
  onSubmit: (values: Record<string, string>) => void;
  secondaryActions?: AuthSecondaryAction;
  showBackArrow?: boolean;
  backHref?: string;
  rightSection?: { title: string; description: string };
  buttonVariant?: "primary" | "secondary";
  footerDescription?: AuthDescription;
  formik?: AuthFormikBag;
};

export const getLoginConfig = (onSubmit: AuthFormConfig["onSubmit"]): AuthFormConfig => ({
  title: "Login",
  inputs: [
    {
      name: "email",
      type: "email",
      label: "E-mail",
      placeholder: "example@gmail.com",
      htmlFor: "email",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "@#*%",
      htmlFor: "password",
      showPasswordToggle: true,
    },
  ],
  buttonText: "Login",
  onSubmit,
  secondaryActions: {
    left: {
      type: "checkbox",
      id: "remember-me",
      label: "Remember me",
    },
    right: {
      text: "Forgot password?",
      href: "/forgot-password",
    },
  },
});

export const getForgotPasswordConfig = (onSubmit: AuthFormConfig["onSubmit"]): AuthFormConfig => ({
  title: "Forgot Password",
  inputs: [
    {
      name: "email",
      type: "email",
      label: "E-mail",
      placeholder: "Enter registered admin email",
      htmlFor: "email",
    },
  ],
  buttonText: "Send Reset Link",
  onSubmit,
  showBackArrow: true,
  backHref: "/login",
  rightSection: {
    title: "Forgot Password",
    description: "We'll send you a reset link",
  },
});

export const getVerifyOtpConfig = (onSubmit: AuthFormConfig["onSubmit"]): AuthFormConfig => ({
  title: "Verify OTP",
  description: {
    text: "The 6-digit verification code has been automatically fetched",
    linkText: "Resend Again",
    linkHref: "#",
  },
  inputs: [
    {
      name: "otp",
      type: "text",
      label: "Verification code",
      placeholder: "Enter 6-digit code",
      htmlFor: "otp",
    },
  ],
  buttonText: "Go to Dashboard",
  onSubmit,
  showBackArrow: true,
  backHref: "/forgot-password",
  buttonVariant: "secondary",
  rightSection: {
    title: "Verify OTP",
    description: "The 6-digit verification code has been automatically fetched",
  },
});

export const getUpdatePasswordConfig = (onSubmit: AuthFormConfig["onSubmit"]): AuthFormConfig => ({
  title: "Update Password",
  inputs: [
    {
      name: "newPassword",
      type: "password",
      label: "New Password",
      placeholder: "@#*%",
      htmlFor: "newPassword",
      showPasswordToggle: true,
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      placeholder: "@#*%",
      htmlFor: "confirmPassword",
      showPasswordToggle: true,
    },
  ],
  buttonText: "Update Password",
  onSubmit,
  rightSection: {
    title: "Update Password",
    description: "Update Your Password and keep Remember",
  },
});
