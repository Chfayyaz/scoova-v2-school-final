"use client";

import Image from "next/image";
import { Lock, Shield, User } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

interface PaymentSummary {
  planName: string;
  billingCycle: string;
  price: string;
  subtotal: string;
  taxes: string;
  total: string;
  renewalNote?: string;
}

interface PaymentCheckoutPanelProps {
  title?: string;
  securityText?: string;
  summary: PaymentSummary;
  payButtonLabel: string;
  onPay?: (payload?: { paymentMethodId: string; cardholderName: string }) => void | Promise<void>;
  subscriptionPlan?: string;
  billingCycle?: "monthly" | "yearly";
  noteText?: string;
  className?: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

export default function PaymentCheckoutPanel({
  title = "Complete Your Payment",
  securityText = "Secure payment powered by Stripe",
  summary,
  payButtonLabel,
  onPay,
  subscriptionPlan = "PREMIUM",
  billingCycle = "monthly",
  noteText = "YOUR PAYMENT IS SECURELY PROCESSED BY STRIPE",
  className = "",
}: PaymentCheckoutPanelProps) {
  const hasStripeKey = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  const stripeOptions = useMemo(
    () => ({
      appearance: { theme: "stripe" as const },
      ...(clientSecret ? { clientSecret } : {}),
    }),
    [clientSecret]
  );

  const initializePaymentIntent = async () => {
    if (clientSecret || isCreatingIntent) return;

    setIsCreatingIntent(true);
    setInitError(null);
    try {
      console.log("STATIC SUBSCRIPTION INTENT", { plan: subscriptionPlan, billingCycle });
      setClientSecret("static_demo_client_secret");
    } catch (error) {
      setInitError(error instanceof Error ? error.message : "Unable to initialize payment.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  useEffect(() => {
    if (!hasStripeKey) return;
    void initializePaymentIntent();
  }, [hasStripeKey, subscriptionPlan, billingCycle]);

  return (
    <section className={`space-y-6 ${className}`}>
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
        <p className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <Shield className="h-3.5 w-3.5 text-custom-teal" />
          {securityText}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div className="rounded-2xl bg-custom-white p-5 shadow-md sm:p-6">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">Order Summary</h3>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                  <Image
                    src="/images/icon_svgs/owl.svg"
                    alt="Scoova"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{summary.planName}</p>
                  <p className="text-xs text-gray-500">{summary.billingCycle}</p>
                </div>
              </div>
              <p className="text-base font-bold text-gray-900">{summary.price}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-b border-slate-200 pb-4">
            <Row label="Subtotal" value={summary.subtotal} />
            <Row label="Taxes (0%)" value={summary.taxes} />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900 sm:text-2xl">{summary.total}</span>
          </div>

          {summary.renewalNote && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs text-gray-600">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-custom-teal" />
              <span>{summary.renewalNote}</span>
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-custom-white p-5 shadow-md sm:p-6">
          {!hasStripeKey ? (
            <p className="text-xs text-red-500">
              Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to enable Stripe checkout.
            </p>
          ) : !clientSecret ? (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 sm:text-lg">Pay with Stripe</h3>
              <p className="text-xs text-gray-500">
                Initializing secure payment. Please wait...
              </p>
              {initError && <p className="text-xs text-red-500">{initError}</p>}
              {isCreatingIntent ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  Initializing...
                </div>
              ) : null}
            </div>
          ) : (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <StripeCheckoutForm
                clientSecret={clientSecret}
                payButtonLabel={payButtonLabel}
                onPay={onPay}
              />
            </Elements>
          )}
        </div>
      </div>

      <footer className="space-y-3 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          <Lock className="h-3 w-3" />
          {noteText}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs font-semibold text-gray-400">
          <span className="rounded border border-gray-200 px-2 py-1">VISA</span>
          <span className="rounded border border-gray-200 px-2 py-1">MC</span>
          <span className="rounded border border-gray-200 px-2 py-1">STRIPE</span>
          <span className="rounded border border-gray-200 px-2 py-1">AMEX</span>
        </div>
      </footer>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function StripeCheckoutForm({
  clientSecret,
  payButtonLabel,
  onPay,
}: {
  clientSecret: string;
  payButtonLabel: string;
  onPay?: (payload?: { paymentMethodId: string; cardholderName: string }) => void | Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!cardholderName.trim()) {
      setErrorMessage("Cardholder name is required.");
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage("Stripe is still loading. Please try again.");
      return;
    }

    setIsSubmitting(true);
    const submitResult = await elements.submit();
    if (submitResult.error) {
      setErrorMessage(submitResult.error.message ?? "Please check your payment details.");
      setIsSubmitting(false);
      return;
    }

    console.log("STATIC PAYMENT SUBMIT", { clientSecret, cardholderName: cardholderName.trim() });

    await onPay?.({ paymentMethodId: "", cardholderName: cardholderName.trim() });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">Pay with Stripe</h3>
          <p className="mt-1 text-xs text-gray-500">Enter your card details below</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
          <span className="rounded border border-gray-200 px-1.5 py-0.5">VISA</span>
          <span className="rounded border border-gray-200 px-1.5 py-0.5">MC</span>
          <span className="rounded border border-gray-200 px-1.5 py-0.5">AMEX</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Cardholder Name</span>
          <span className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3">
            <span className="text-gray-400">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={cardholderName}
              onChange={(event) => setCardholderName(event.target.value)}
              placeholder="John Doe"
              className="w-full border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Card Details</span>
          <span className="block rounded-lg border border-slate-300 bg-white p-3">
            <PaymentElement />
          </span>
        </label>
      </div>

      {errorMessage && <p className="mt-3 text-xs text-red-500">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 h-11 w-full rounded-full bg-custom-teal text-sm font-semibold text-custom-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Processing..." : payButtonLabel}
      </button>
    </form>
  );
}

