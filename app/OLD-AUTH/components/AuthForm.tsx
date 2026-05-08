"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import type { AuthFormConfig } from "../data";
import { Logo } from "@/app/(dashboard)/components/layout/Header";

type AuthFormProps = AuthFormConfig;

export default function AuthForm({
  title,
  description,
  inputs,
  buttonText,
  onSubmit,
  secondaryActions,
  showBackArrow,
  backHref,
  buttonVariant = "primary",
  footerDescription,
  formik,
}: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    inputs.reduce((acc, input) => ({ ...acc, [input.name]: "" }), {})
  );
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

  const isFormik = Boolean(formik);
  const currentValues = isFormik ? formik!.values : values;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isFormik) formik!.handleChange(e);
    else setValues((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (name: string) => {
    setPasswordVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormik) formik!.handleSubmit(e);
    else onSubmit(values);
  };

  return (
    <div className="px-3 sm:px-0  sm:w-[92%]">
      <div className="sm:ml-12 sm:px-0 mt-4 sm:mt-6 flex items-center gap-3">
        {showBackArrow && backHref && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-custom-gray/5 transition-colors"
          >
            <ArrowLeft size={20} className="text-custom-gray/95" />
          </Link>
        )}
        {/* <Image src="/images/Logo.png" alt="Logo" width={80} height={50} /> */}
        <Logo/>
      </div>
      <div className="sm:ml-20 mt-12 sm:mt-22">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && (
            <div className="mt-4">
              {description.inline && description.text && description.linkText && description.linkHref ? (
                <p className="text-[18px]">
                  <span className="text-custom-gray/80">{description.text}</span>
                  <Link className="text-custom-teal underline" href={description.linkHref}>
                    {description.linkText}
                  </Link>
                </p>
              ) : (
                <>
                  {description.text && (
                    <p className="text-[18px] text-custom-gray/80">{description.text}</p>
                  )}
                  {description.linkText && description.linkHref && (
                    <a className="text-[18px] text-custom-teal underline mt-2 inline-block" href={description.linkHref}>
                      {description.linkText}
                    </a>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            {inputs.map((input, index) => (
              <div
                key={input.name}
                className={`flex flex-col ${index > 0 ? "mt-3" : ""} ${input.showPasswordToggle ? "relative" : ""}`}
              >
                <label
                  htmlFor={input.htmlFor ?? input.name}
                  className="text-[16px] mb-2 font-medium text-custom-gray/80"
                >
                  {input.label}
                </label>
                <input
                  id={input.htmlFor ?? input.name}
                  name={input.name}
                  value={currentValues[input.name] ?? ""}
                  onChange={handleChange}
                  onBlur={formik?.handleBlur}
                  type={
                    input.type === "password" && input.showPasswordToggle && passwordVisibility[input.name]
                      ? "text"
                      : input.type === "password"
                        ? "password"
                        : "text"
                  }
                  placeholder={input.placeholder}
                  className={`py-3.5 px-3 rounded-lg text-sm outline-none border ${
                    formik?.touched[input.name] && formik?.errors[input.name]
                      ? "border-red-500"
                      : "border-custom-gray/20"
                  } ${input.showPasswordToggle ? "pl-3 pr-14" : ""}`}
                />
                {formik?.touched[input.name] && formik?.errors[input.name] && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors[input.name]}</p>
                )}
                {input.showPasswordToggle && (
                  <div
                    className="absolute right-3 top-11 border-l border-custom-gray/40 pl-3"
                    onClick={() => togglePasswordVisibility(input.name)}
                  >
                    {passwordVisibility[input.name] ? (
                      <Eye className="text-custom-gray/80" size={25} />
                    ) : (
                      <EyeOff size={25} className="text-custom-gray/80" />
                    )}
                  </div>
                )}
              </div>
            ))}

            {secondaryActions && (secondaryActions.left || secondaryActions.right) && (
              <div className="mt-5 flex items-center justify-between">
                {secondaryActions.left ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={secondaryActions.left.id}
                      className="accent-custom-teal "
                    />
                    <label htmlFor={secondaryActions.left.id} className="text-custom-gray/80 text-sm ">
                      {secondaryActions.left.label}
                    </label>
                  </div>
                ) : (
                  <div />
                )}
                {secondaryActions.right ? (
                  secondaryActions.right.href ? (
                    <Link
                      href={secondaryActions.right.href}
                      className="text-custom-teal underline cursor-pointer"
                    >
                      {secondaryActions.right.text}
                    </Link>
                  ) : (
                    <p
                      className="text-custom-teal underline cursor-pointer"
                      onClick={secondaryActions.right.onClick}
                    >
                      {secondaryActions.right.text}
                    </p>
                  )
                ) : null}
              </div>
            )}

            <Button
              type="submit"
              rounded="full"
              variant="filled"
              bgColor={buttonVariant === "secondary" ? "bg-custom-gray/10" : undefined}
              textColor={buttonVariant === "secondary" ? "text-custom-gray/80" : undefined}
              hoverBgColor={buttonVariant === "secondary" ? "hover:bg-custom-gray/20" : undefined}
              className="mt-8 py-3 w-full"
            >
              {buttonText}
            </Button>
            {footerDescription && (
              <p className="text-[18px] mt-4 text-center">
                <span className="text-custom-gray/80">{footerDescription.text}</span>
                {footerDescription.linkText && footerDescription.linkHref && (
                  <a className="text-custom-teal underline ml-1" href={footerDescription.linkHref}>
                    {footerDescription.linkText}
                  </a>
                )}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
