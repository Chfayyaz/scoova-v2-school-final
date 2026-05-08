"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircleDollarSign, Shield, Timer } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  AccountSetupCard,
  AuthStepper,
  EmailVerificationPanel,
  PaymentCheckoutPanel,
  PlanOverviewCard,
  PlanToggle,
  SubscriptionConfirmationPanel,
  TrustSignalsCard,
} from "../components/ui";
import type { FormField, PlanFeature, PlanOption, StepItem } from "../components/ui";
import PlanFlowShell from "./components/PlanFlowShell";
import Skeleton from "@/components/ui/Skeleton";
import {
  getSignupProgress,
  isStatusAllowedForRole,
  setSignupProgress,
  type SignupStatus,
} from "./components/signupProgress";
import { getMainAppRoleSelectionUrl } from "@/lib/mainApp";
import { useAppDispatch, useAppSelector } from "@/redux";
import { loginSuccess, type PlatformRole, type SchoolRole } from "@/redux/slices/auth.slice";
import {
  getSignupRegistrationDraft,
  patchSignupRegistrationDraft,
} from "./components/signupRegistrationDraft";

type PlanId = "basic" | "grow";
type ViewKey = "plan" | "account" | "payment" | "verification" | "confirmation";

interface PlanRecord {
  id: PlanId;
  toggleLabel: string;
  name: string;
  priceLabel: string;
  secondaryPrice?: string;
  planLabel?: string;
  featureTitle: string;
  features: PlanFeature[];
  isPaid: boolean;
  accountVariant: "basic" | "priced";
  accountBasicLabel?: string;
  accountBasicFeatures?: string[];
  accountPriceCaption?: string;
  accountPriceLabel?: string;
  showPopularBadge?: boolean;
  summaryLabel: string;
  summaryBillingCycle: string;
  summaryPrice: string;
  summaryNextBilling: string;
  paymentSummary?: {
    planName: string;
    billingCycle: string;
    price: string;
    subtotal: string;
    taxes: string;
    total: string;
    renewalNote?: string;
  };
}

const PLANS: PlanRecord[] = [
  {
    id: "basic",
    toggleLabel: "Scoova Basic",
    name: "Scoova Basic",
    priceLabel: "Free User",
    planLabel: "Perfect for getting started",
    featureTitle: "Basic Plan",
    features: [
      { id: "f1", text: "Access the PDL network" },
      { id: "f2", text: "Receive notifications on reviews and activity" },
    ],
    isPaid: false,
    accountVariant: "basic",
    accountBasicLabel: "Free User",
    accountBasicFeatures: [
      "Access the PDL network",
      "Receive notifications on reviews and activity",
    ],
    summaryLabel: "Scoova Basic",
    summaryBillingCycle: "Free User",
    summaryPrice: "$0.00",
    summaryNextBilling: "N/A",
  },
  {
    id: "grow",
    toggleLabel: "Scoova Grow",
    name: "Scoova Grow",
    priceLabel: "$499.99 / year",
    planLabel: "Billed yearly",
    featureTitle: "Everything in Scoova Basic plus:",
    features: [
      { id: "g1", text: "Build trust through transparent feedback" },
      { id: "g2", text: "Showcase your school with real insight, not marketing" },
      { id: "g3", text: "Turn feedback into action and improvement" },
      { id: "g4", text: "Benchmark with meaningful context" },
      { id: "g5", text: "See your school's full reputation in one place" },
      { id: "g6", text: "Attract the right people and partners" },
      { id: "g7", text: "Post Job Opportunities and Respond to Applications" },
    ],
    isPaid: true,
    accountVariant: "priced",
    accountPriceCaption: "billed yearly",
    accountPriceLabel: "$499/year",
    showPopularBadge: true,
    summaryLabel: "Scoova Grow",
    summaryBillingCycle: "Yearly",
    summaryPrice: "$499.00",
    summaryNextBilling: "March 27, 2027",
    paymentSummary: {
      planName: "Scoova Business",
      billingCycle: "Yearly Subscription",
      price: "$499",
      subtotal: "$499",
      taxes: "$0.00",
      total: "$499",
      renewalNote: "Your subscription will automatically renew at $499/year unless cancelled.",
    },
  },
];

const BASIC_STEPS: StepItem[] = [
  { id: "plan", label: "Choose Plan" },
  { id: "account", label: "Account setup" },
  { id: "verification", label: "Verification" },
  { id: "confirmation", label: "Confirmation" },
];

const GROW_STEPS: StepItem[] = [
  { id: "plan", label: "Choose Plan" },
  { id: "account", label: "Account setup" },
  { id: "verification", label: "Verification" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
];

const ACCOUNT_FIELDS: FormField[] = [
  { id: "website", label: "Website", placeholder: "Enter Website URL", type: "url", width: "full" },
  { id: "company", label: "Company Name", placeholder: "Company Name", width: "full" },
  { id: "first", label: "First Name", placeholder: "First Name", width: "half" },
  { id: "last", label: "Last Name", placeholder: "Last Name", width: "half" },
  { id: "username", label: "Username", placeholder: "Username", width: "half" },
  { id: "billingEmail", label: "Billing Email", placeholder: "Billing Email", type: "email", width: "half" },
  { id: "password", label: "Password", placeholder: "Password", type: "password", width: "full" },
];

const TRUST_SIGNALS = [
  { id: "secure", text: "Secure & Private", icon: Shield },
  { id: "support", text: "24/7 Support", icon: Timer },
  { id: "guarantee", text: "Money-back Guarantee", icon: CircleDollarSign },
];

const RESTRICTIONS = [
  "Publishing profile updates",
  "Posting courses or events",
  "Sending surveys",
  "Accessing subscriber-only tools",
];

const WELCOME_POINTS = [
  "We've sent you a verification email.",
  "Please check your email to activate your account.",
  "Please wait a few minutes, and don't forget to check your spam folder.",
];

function stepIndexForView(view: ViewKey, isPaid: boolean): number {
  if (isPaid) {
    switch (view) {
      case "plan":
        return 0;
      case "account":
        return 1;
      case "verification":
        return 2;
      case "payment":
        return 3;
      case "confirmation":
        return 4;
    }
  }

  switch (view) {
    case "plan":
      return 0;
    case "account":
      return 1;
    case "verification":
      return 2;
    case "confirmation":
      return 3;
    case "payment":
      return 1;
  }
}

const STATUS_BY_VIEW: Record<ViewKey, SignupStatus> = {
  plan: "plan",
  account: "account-setup",
  verification: "verification",
  payment: "payment",
  confirmation: "confirmation",
};

const VIEW_BY_STATUS: Record<SignupStatus, ViewKey> = {
  plan: "plan",
  "account-setup": "account",
  verification: "verification",
  payment: "payment",
  confirmation: "confirmation",
  signup: "plan",
};

export default function SchoolSignupPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("basic");
  const [selectedGrowBillingCycle, setSelectedGrowBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currentView, setCurrentView] = useState<ViewKey>("plan");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [promotionEmailsOptIn, setPromotionEmailsOptIn] = useState(false);
  const [productUpdatesOptIn, setProductUpdatesOptIn] = useState(false);
  const [offersOptIn, setOffersOptIn] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [processedVerificationToken, setProcessedVerificationToken] = useState<string | null>(null);
  const accountFormik = useFormik({
    initialValues: {
      website: "",
      company: "",
      first: "",
      last: "",
      username: "",
      billingEmail: "",
      password: "",
    },
    onSubmit: async (values) => {
      const payload = {
        role: "SCHOOL" as const,
        plan: selectedPlanId === "basic" ? ("BASIC" as const) : ("PREMIUM" as const),
        billingCycle: selectedPlanId === "basic" ? ("monthly" as const) : selectedGrowBillingCycle,
        firstName: values.first.trim(),
        lastName: values.last.trim(),
        username: values.username.trim(),
        password: values.password,
        companyName: values.company.trim(),
        websiteUrl: values.website.trim(),
        billingEmail: values.billingEmail.trim(),
        promotionEmailsOptIn,
        productUpdatesOptIn,
        offersOptIn,
      };

      patchSignupRegistrationDraft("school", {
        plan: payload.plan,
        billingCycle: payload.billingCycle,
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        password: payload.password,
        companyName: payload.companyName,
        websiteUrl: payload.websiteUrl,
        billingEmail: payload.billingEmail,
        promotionEmailsOptIn: payload.promotionEmailsOptIn,
        productUpdatesOptIn: payload.productUpdatesOptIn,
        offersOptIn: payload.offersOptIn,
      });
      setIsSubmittingRegister(true);

      try {
        console.log("STATIC REGISTER", payload);
        toast.success("Registration submitted. Please verify your email. (static demo)");
        setCurrentView("verification");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to register. Please try again.";
        toast.error(message);
      } finally {
        setIsSubmittingRegister(false);
      }
    },
  });

  const selectedPlan = useMemo(() => {
    const plan = PLANS.find((item) => item.id === selectedPlanId) ?? PLANS[0];
    if (plan.id !== "grow") return plan;
    if (selectedGrowBillingCycle === "monthly") {
      return {
        ...plan,
        priceLabel: "$42/month",
        secondaryPrice: undefined,
        planLabel: "Billed monthly",
        accountPriceCaption: "billed monthly",
        accountPriceLabel: "$42/month",
        summaryBillingCycle: "Monthly",
        summaryPrice: "$42.00",
        paymentSummary: plan.paymentSummary
          ? {
              ...plan.paymentSummary,
              price: "$42",
              subtotal: "$42",
              total: "$42",
              billingCycle: "Monthly Subscription",
              renewalNote: "Your subscription will automatically renew at $42/month unless cancelled.",
            }
          : undefined,
      };
    }

    return {
      ...plan,
      priceLabel: "$499.99/year",
      secondaryPrice: undefined,
      planLabel: "Billed yearly",
      accountPriceCaption: "billed yearly",
      accountPriceLabel: "$499/year",
      summaryBillingCycle: "Yearly",
      summaryPrice: "$499.00",
      paymentSummary: plan.paymentSummary
        ? {
            ...plan.paymentSummary,
            price: "$499",
            subtotal: "$499",
            total: "$499",
            billingCycle: "Yearly Subscription",
            renewalNote: "Your subscription will automatically renew at $499/year unless cancelled.",
          }
        : undefined,
    };
  }, [selectedGrowBillingCycle, selectedPlanId]);
  const paymentSummary = useMemo(() => {
    if (!selectedPlan.paymentSummary) return undefined;
    if (selectedPlan.id !== "grow") return selectedPlan.paymentSummary;
    return {
      ...selectedPlan.paymentSummary,
      billingCycle:
        selectedGrowBillingCycle === "monthly"
          ? "Monthly Subscription"
          : "Yearly Subscription",
    };
  }, [selectedGrowBillingCycle, selectedPlan]);

  const toggleOptions: PlanOption[] = PLANS.map((plan) => ({
    id: plan.id,
    label: plan.toggleLabel,
  }));

  const steps = selectedPlan.isPaid ? GROW_STEPS : BASIC_STEPS;
  const stepIndex = stepIndexForView(currentView, selectedPlan.isPaid);

  useEffect(() => {
    const queryStatus = searchParams.get("status");
    const doneStatus = authUser?.doneStatus;
    const forcedStatus: SignupStatus | null =
      doneStatus === "register" || doneStatus === "mail-verification"
        ? "verification"
        : doneStatus === "subscription-intent"
          ? "payment"
          : doneStatus === "free-subscription" || doneStatus === "subscription-confirm"
            ? "confirmation"
            : null;
    const fallbackStatus: SignupStatus = "plan";
    const savedStatus: SignupStatus = forcedStatus
      ? forcedStatus
      : queryStatus && isStatusAllowedForRole("school", queryStatus)
        ? queryStatus
        : fallbackStatus;

    if (!queryStatus || !isStatusAllowedForRole("school", queryStatus)) {
      router.replace(`${pathname}?status=${savedStatus}`);
      setCurrentView(VIEW_BY_STATUS[savedStatus]);
      setIsHydrated(true);
      return;
    }

    if (queryStatus !== savedStatus) {
      router.replace(`${pathname}?status=${savedStatus}`);
      setCurrentView(VIEW_BY_STATUS[savedStatus]);
      setIsHydrated(true);
      return;
    }

    setCurrentView(VIEW_BY_STATUS[queryStatus]);
    setIsHydrated(true);
  }, [authUser?.doneStatus, pathname, router, searchParams]);

  useEffect(() => {
    if (!isHydrated) return;
    const draft = getSignupRegistrationDraft();
    if (draft?.role !== "school") return;

    if (draft.plan === "PREMIUM") {
      setSelectedPlanId("grow");
      if (draft.billingCycle) {
        setSelectedGrowBillingCycle(draft.billingCycle);
      }
    } else if (draft.plan === "BASIC") {
      setSelectedPlanId("basic");
    }

    accountFormik.setValues({
      website: draft.websiteUrl ?? "",
      company: draft.companyName ?? "",
      first: draft.firstName ?? "",
      last: draft.lastName ?? "",
      username: draft.username ?? "",
      billingEmail: draft.billingEmail ?? "",
      password: draft.password ?? "",
    });
    setPromotionEmailsOptIn(Boolean(draft.promotionEmailsOptIn));
    setProductUpdatesOptIn(Boolean(draft.productUpdatesOptIn));
    setOffersOptIn(Boolean(draft.offersOptIn));
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const status = STATUS_BY_VIEW[currentView];
    setSignupProgress({
      role: "school",
      status,
    });

    if (searchParams.get("status") !== status) {
      router.replace(`${pathname}?status=${status}`);
    }
  }, [currentView, isHydrated, pathname, router, searchParams]);

  useEffect(() => {
    if (!isHydrated) return;
    patchSignupRegistrationDraft("school", {
      plan: selectedPlanId === "basic" ? "BASIC" : "PREMIUM",
      billingCycle: selectedPlanId === "basic" ? "monthly" : selectedGrowBillingCycle,
    });
  }, [isHydrated, selectedPlanId, selectedGrowBillingCycle]);

  useEffect(() => {
    if (!isHydrated || currentView !== "verification") return;
    const token = searchParams.get("token");
    if (!token || processedVerificationToken === token || isVerifyingEmail) return;

    setVerificationError(null);
    setIsVerifyingEmail(true);
    setProcessedVerificationToken(token);

    Promise.resolve({
      message: "Email verified successfully (static demo).",
      data: {
        id: "static-user",
        name: "Demo User",
        email: "demo@scoova.com",
        platformRole: "USER",
        schoolRole: null,
        accessToken: "static-demo-token",
        selectedPlan: "BASIC",
        selectedBillingCycle: "monthly",
      },
    })
      .then((response) => {
        dispatch(
          loginSuccess({
            user: {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              platformRole: response.data.platformRole as PlatformRole,
              schoolRole: (response.data.schoolRole as SchoolRole | null) ?? "NONE",
              isSubscriber: false,
              school: null,
              profileImage: null,
              lastLogin: null,
            },
            accessToken: response.data.accessToken,
          })
        );
        toast.success(response.message || "Email verified successfully.");
        const verifiedPlan = response.data.selectedPlan;
        const verifiedCycle = response.data.selectedBillingCycle;
        const isPremium = verifiedPlan === "PREMIUM";

        setSelectedPlanId(isPremium ? "grow" : "basic");
        if (isPremium && (verifiedCycle === "monthly" || verifiedCycle === "yearly")) {
          setSelectedGrowBillingCycle(verifiedCycle);
        }

        setCurrentView(isPremium ? "payment" : "confirmation");
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to verify email. Please use the link again or request a new one.";
        setVerificationError(message);
        toast.error(message);
      })
      .finally(() => {
        setIsVerifyingEmail(false);
      });
  }, [
    dispatch,
    currentView,
    isHydrated,
    isVerifyingEmail,
    processedVerificationToken,
    searchParams,
    selectedPlan.isPaid,
  ]);

  const handleBack = () => {
    const progress = getSignupProgress();
    const roleLocked = Boolean(progress?.roleLocked);

    switch (currentView) {
      case "plan":
        if (!roleLocked) {
          window.location.href = getMainAppRoleSelectionUrl();
        }
        break;
      case "account":
        setCurrentView("plan");
        break;
      case "verification":
        setCurrentView("account");
        break;
      case "payment":
        setCurrentView("verification");
        break;
      case "confirmation":
        setCurrentView(selectedPlan.isPaid ? "payment" : "verification");
        break;
    }
  };

  const goToAccountOrPayment = () => {
    setCurrentView("account");
  };

  const handleAccountSubmit = async () => {
    await accountFormik.submitForm();
  };

  const handleResendVerificationEmail = async () => {
    const email = accountFormik.values.billingEmail.trim().toLowerCase();
    if (!email) {
      toast.error("Billing email is required to resend verification.");
      return;
    }
    console.log("STATIC RESEND VERIFICATION", email);
    toast.success("Verification email resent successfully. (static demo)");
  };

  if (!isHydrated) {
    
return (
      <PlanFlowShell contentMaxWidth="7xl">
        <section className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-5 w-80 rounded-md" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-10 w-52 rounded-full" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </section>
      </PlanFlowShell>
    );
  };

  return (
    <PlanFlowShell onBack={handleBack} contentMaxWidth="7xl">
      {currentView === "plan" && (
        <section className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Choose Your Plan
            </h1>
            <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
              Select the perfect plan to unlock the full potential of your school&apos;s
              reputation management and growth.
            </p>
          </header>

          <AuthStepper steps={steps} currentStep={stepIndex} />

          <div className="flex justify-center pt-2">
            <PlanToggle
              options={toggleOptions}
              selectedId={selectedPlan.id}
              onChange={(id) => setSelectedPlanId(id as PlanId)}
            />
          </div>
          {selectedPlan.id === "grow" && (
            <div className="flex justify-center">
              <PlanToggle
                options={[
                  { id: "monthly", label: "Monthly" },
                  { id: "yearly", label: "Yearly" },
                ]}
                selectedId={selectedGrowBillingCycle}
                onChange={(id) => setSelectedGrowBillingCycle(id as "monthly" | "yearly")}
              />
            </div>
          )}

          <PlanOverviewCard
            planName={selectedPlan.name}
            planLabel={selectedPlan.planLabel}
            secondaryPrice={selectedPlan.secondaryPrice}
            priceLabel={selectedPlan.priceLabel}
            featureTitle={selectedPlan.featureTitle}
            features={selectedPlan.features}
            showPopularBadge={selectedPlan.showPopularBadge}
            onCtaClick={goToAccountOrPayment}
          />

          <TrustSignalsCard signals={TRUST_SIGNALS} />
        </section>
      )}

      {currentView === "account" && (
        <section className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {selectedPlan.name}
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              Where insight puts you in control
            </p>
          </header>

          <AuthStepper steps={steps} currentStep={stepIndex} />

          <AccountSetupCard
            planName={selectedPlan.name.replace("Scoova ", "")}
            variant={selectedPlan.accountVariant}
            basicLabel={selectedPlan.accountBasicLabel}
            basicFeatures={selectedPlan.accountBasicFeatures}
            priceCaption={selectedPlan.accountPriceCaption}
            priceLabel={selectedPlan.accountPriceLabel}
            fields={ACCOUNT_FIELDS}
            fieldValues={accountFormik.values}
            onFieldChange={(fieldId, value) => accountFormik.setFieldValue(fieldId, value)}
            onFieldBlur={(fieldId) => accountFormik.setFieldTouched(fieldId, true)}
            fieldErrors={accountFormik.errors}
            fieldTouched={accountFormik.touched}
            promotionEmailsOptIn={promotionEmailsOptIn}
            productUpdatesOptIn={productUpdatesOptIn}
            offersOptIn={offersOptIn}
            onPromotionEmailsOptInChange={setPromotionEmailsOptIn}
            onProductUpdatesOptInChange={setProductUpdatesOptIn}
            onOffersOptInChange={setOffersOptIn}
            onVerifyEmail={handleAccountSubmit}
            isSubmitting={isSubmittingRegister}
          />
        </section>
      )}

      {currentView === "verification" && (
        <section className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {selectedPlan.name}
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              Where insight puts you in control
            </p>
          </header>

          <AuthStepper steps={steps} currentStep={stepIndex} />

          <div className="pt-4">
            <EmailVerificationPanel
              restrictions={RESTRICTIONS}
              isLoading={isVerifyingEmail}
              loadingText="Verifying your email..."
              statusMessage={verificationError}
              statusTone={verificationError ? "error" : "default"}
              onResend={handleResendVerificationEmail}
              resendLabel="Resend verification email"
              resendCooldownSeconds={0}
              resendCooldownStorageKey={`v2-static-resend-school-${accountFormik.values.billingEmail
                .trim()
                .toLowerCase()}`}
            />
          </div>
        </section>
      )}

      {currentView === "payment" && paymentSummary && (
        <section className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {selectedPlan.name}
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              Where insight puts you in control
            </p>
          </header>

          <AuthStepper steps={steps} currentStep={stepIndex} />

          <PaymentCheckoutPanel
            summary={paymentSummary}
            payButtonLabel={`Pay ${paymentSummary.total} with stripe`}
            subscriptionPlan="PREMIUM"
            billingCycle={selectedGrowBillingCycle}
            onPay={() => setCurrentView("confirmation")}
          />
        </section>
      )}

      {currentView === "confirmation" && (
        <section className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {selectedPlan.name}
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              Where insight puts you in control
            </p>
          </header>

          <AuthStepper steps={steps} currentStep={stepIndex} />

          <SubscriptionConfirmationPanel
            welcomeTitle="Timothy, Welcome to Scoova!"
            welcomePoints={WELCOME_POINTS}
            summaryItems={[
              { id: "plan", label: "Plan", value: selectedPlan.summaryLabel },
              { id: "cycle", label: "Billing Cycle", value: selectedPlan.summaryBillingCycle },
              { id: "price", label: "Price", value: selectedPlan.summaryPrice },
              { id: "next", label: "Next Billing", value: selectedPlan.summaryNextBilling },
            ]}
            onDashboardClick={() => router.push("/")}
          />
        </section>
      )}
    </PlanFlowShell>
  );
}
