"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/Input";
import type { FormField } from "./types";

type PlanVariant = "basic" | "priced";

interface AccountSetupCardProps {
  planName: string;
  variant?: PlanVariant;
  basicLabel?: string;
  basicFeatures?: string[];
  priceCaption?: string;
  priceLabel?: string;
  fields: FormField[];
  fieldValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
  fieldErrors?: Record<string, string>;
  fieldTouched?: Record<string, boolean>;
  onFieldBlur?: (fieldId: string) => void;
  verifyCtaLabel?: string;
  onVerifyEmail?: () => void | Promise<void>;
  isSubmitting?: boolean;
  promotionEmailsOptIn?: boolean;
  productUpdatesOptIn?: boolean;
  offersOptIn?: boolean;
  stayInformedOptIn?: boolean;
  onPromotionEmailsOptInChange?: (checked: boolean) => void;
  onProductUpdatesOptInChange?: (checked: boolean) => void;
  onOffersOptInChange?: (checked: boolean) => void;
  onStayInformedOptInChange?: (checked: boolean) => void;
  footerNotes?: ReactNode;
  className?: string;
}

const widthClassMap: Record<NonNullable<FormField["width"]>, string> = {
  full: "col-span-12",
  half: "col-span-12 md:col-span-6",
  third: "col-span-12 md:col-span-4",
};

export default function AccountSetupCard({
  planName,
  variant = "basic",
  basicLabel = "Free User",
  basicFeatures = [],
  priceCaption,
  priceLabel,
  fields,
  fieldValues,
  onFieldChange,
  fieldErrors = {},
  fieldTouched = {},
  onFieldBlur,
  verifyCtaLabel = "Verify Email",
  onVerifyEmail,
  isSubmitting = false,
  promotionEmailsOptIn = false,
  productUpdatesOptIn = false,
  offersOptIn = false,
  stayInformedOptIn = false,
  onPromotionEmailsOptInChange,
  onProductUpdatesOptInChange,
  // onOffersOptInChange,
  // onStayInformedOptInChange,
  footerNotes,
  className = "",
}: AccountSetupCardProps) {
  const defaultFooter = (
    <>
      <p className="text-xs italic text-gray-600">
        By submitting this form Scoova will use your contact details to discuss our products and services.
      </p>
      <p className="text-xs italic text-gray-600">
        Please read our{" "}
        <a href="#" className="text-custom-teal underline">
          Privacy Policy
        </a>
        , which explains how we collect, use, and protect your personal data.
      </p>
    </>
  );

  return (
    <div className={`space-y-5 ${className}`}>
      <section className="rounded-2xl border border-slate-300 bg-slate-50 px-5 py-5 sm:px-7 sm:py-6">
        {variant === "basic" ? (
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center gap-3">
              <Image
                src="/images/icon_svgs/owl.svg"
                alt="Scoova"
                width={44}
                height={44}
                className="h-9 w-9 sm:h-11 sm:w-11"
              />
              <h3 className="text-xl font-medium text-gray-900 sm:text-2xl">
                Scoova <span className="font-bold italic">{planName}</span>
              </h3>
            </div>

            <div className="hidden h-16 w-px bg-slate-300 sm:block" />

            <div>
              <p className="text-base font-bold text-gray-900 sm:text-lg">
                {basicLabel}
              </p>
              {basicFeatures.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {basicFeatures.map((feature, index) => (
                    <li
                      key={`${feature}-${index}`}
                      className="text-sm italic text-gray-600"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/images/icon_svgs/owl.svg"
                alt="Scoova"
                width={44}
                height={44}
                className="h-9 w-9 sm:h-11 sm:w-11"
              />
              <h3 className="text-xl font-medium text-gray-900 sm:text-2xl">
                Scoova <span className="font-bold italic">{planName}</span>
              </h3>
            </div>
            <div className="text-left sm:text-right">
              {priceCaption && (
                <p className="text-xs italic text-gray-500 sm:text-sm">
                  {priceCaption}
                </p>
              )}
              {priceLabel && (
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {priceLabel}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-300 bg-slate-50 px-5 py-5 sm:px-7 sm:py-6">
        <h4 className="text-base font-bold text-gray-900 sm:text-lg">Account Details</h4>
        <div className="my-4 h-px w-full bg-slate-300" />

        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {fields.map((field) => (
            <div key={field.id} className={widthClassMap[field.width ?? "full"]}>
              <Input
                value={fieldValues[field.id] ?? ""}
                onChange={(event) => onFieldChange(field.id, event.target.value)}
                onBlur={() => onFieldBlur?.(field.id)}
                placeholder={field.placeholder}
                type={field.type ?? "text"}
                className="h-11 rounded-lg border-slate-300 bg-white text-sm placeholder:text-gray-400"
                error={fieldTouched[field.id] ? fieldErrors[field.id] : undefined}
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold italic text-gray-800">Marketing Preferences</p>
            <div className="mt-2 space-y-1.5">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={promotionEmailsOptIn}
                  onChange={(event) => onPromotionEmailsOptInChange?.(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-400"
                />
                Receive Promotional Emails
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={productUpdatesOptIn}
                  onChange={(event) => onProductUpdatesOptInChange?.(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-400"
                />
                Get Product Updates
              </label>
              {/* <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={offersOptIn}
                  onChange={(event) => onOffersOptInChange?.(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-400"
                />
                Receive Offers
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={stayInformedOptIn}
                  onChange={(event) => onStayInformedOptInChange?.(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-400"
                />
                Stay informed with Scoova updates
              </label> */}
            </div>
          </div>

          <button
            type="button"
            onClick={onVerifyEmail}
            disabled={isSubmitting}
            className="h-11 rounded-full bg-custom-teal px-8 text-sm font-semibold text-custom-white transition hover:brightness-95"
          >
            {isSubmitting ? "Submitting..." : verifyCtaLabel}
          </button>
        </div>

        <div className="mt-5 space-y-1.5">
          {footerNotes ?? defaultFooter}
        </div>
      </section>
    </div>
  );
}
