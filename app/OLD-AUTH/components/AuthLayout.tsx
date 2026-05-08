"use client";

import AuthForm from "./AuthForm";
import RightSection from "./RightSection";
import type { AuthFormConfig } from "../data";

type AuthLayoutProps = AuthFormConfig;

export default function AuthLayout(props: AuthLayoutProps) {
  const { rightSection, ...formProps } = props;
  return (
    <div className="grid md:grid-cols-[47%_53%] h-screen overflow-hidden">
      <div className="overflow-y-auto bg-[#F7FAFC] overflow-x-hidden min-h-0 hide-scrollbar">
        <AuthForm {...formProps} />
      </div>
      <div className="hidden md:block">
        <RightSection title={rightSection?.title} description={rightSection?.description} />
      </div>
    </div>
  );
}
