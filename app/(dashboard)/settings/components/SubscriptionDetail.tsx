"use client";

import { useState, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import ManagePlanModal from "./ManagePlanModal";
import BillingHistoryModal from "./BillingHistoryModal";
import { CheckIcon } from "../../pulse-survey/details/components/SurveyOverview";
import type { SubscriptionDetail as SubscriptionDetailData } from "../data";

type PlanDetails = {
  planName: string;
  description: string;
  price: number;
  priceUnit: string;
  icon?: string;
  toolkitFeatures: string[];
};

const currentPlanDetails: PlanDetails = {
  planName: "Premium School Plan",
  description: "Complete school management platform",
  price: 29.99,
  priceUnit: "/month",
  toolkitFeatures: [
    "Update general information",
    "Create image gallery",
    "Reply to reviews",
    "Manage senior leadership",
    "Access Pulse Survey Tool",
    "Recruitment platform (job postings & applications)",
    "System Support + Notifications",
  ],
};

type SubscriptionDetailProps = {
  data: SubscriptionDetailData;
  openManagePlan?: boolean;
  onManagePlanOpened?: () => void;
};

export default function SubscriptionDetail({
  data,
  openManagePlan = false,
  onManagePlanOpened,
}: SubscriptionDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBillingHistoryOpen, setIsBillingHistoryOpen] = useState(false);

  useEffect(() => {
    if (openManagePlan) {
      setIsModalOpen(true);
      onManagePlanOpened?.();
    }
  }, [openManagePlan, onManagePlanOpened]);

  const formatDate = (dateString: string) => {
    if (!dateString?.trim()) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusBadgeClass =
    data.status === "active"
      ? "bg-custom-green/20 text-[#15803D]"
      : data.status === "expired"
        ? "bg-custom-gray/15 text-custom-gray/75"
        : "bg-custom-yellow/20 text-[#854D0E]";

  const getPaymentMethodIcon = (type: string) => {
    // In a real app, you would use actual payment method icons
    // For now, we'll use a simple badge
    return type.toUpperCase();
  };

  const handleViewBillingHistory = () => {
    setIsBillingHistoryOpen(true);
  };

  const handleManagePlan = () => {
    setIsModalOpen(true);
  };

  const handleUpgrade = () => {
    // TODO: Implement upgrade logic
    console.log("Upgrade plan");
    // Close modal after upgrade
    setIsModalOpen(false);
  };

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-custom-gray/95 mb-1">
          Subscription Details
        </h2>
        <p className="text-xs md:text-sm text-custom-gray/80">
          Manage and review your school's current subscription.
        </p>
      </div>

      {/* Subscription Details - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-custom-gray/80 mb-1">Subscription Plan</p>
            <p className="text-base font-semibold text-custom-gray/95">
              {data.plan}
            </p>
          </div>
          <div>
            <p className="text-sm text-custom-gray/80 mb-1">Billing Cycle</p>
            <p className="text-base font-semibold text-custom-gray/95">
              {data.billingCycle}
            </p>
          </div>
          <div>
            <p className="text-sm text-custom-gray/80 mb-1">Renewal Date</p>
            <p className="text-base font-semibold text-custom-gray/95">
              {formatDate(data.renewalDate)}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-custom-gray/80 mb-1">Status</p>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass}`}
            >
              {data.status === "active" ? <CheckIcon /> : null}
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-sm text-custom-gray/80 mb-1">Start Date</p>
            <p className="text-base font-semibold text-custom-gray/95">
              {formatDate(data.startDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-custom-gray/80 mb-1">Payment Method</p>
            {data.paymentMethod ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-6 bg-custom-teal rounded text-custom-white text-xs font-semibold">
                  {getPaymentMethodIcon(data.paymentMethod.type)}
                </div>
                <p className="text-base font-semibold text-custom-gray/95">
                  **** **** **** {data.paymentMethod.lastFour}
                </p>
              </div>
            ) : (
              <p className="text-sm text-custom-gray/70">
                Not shown here — managed with your billing provider.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Included Features */}
      <div className="mb-4 md:mb-6 pt-4 md:pt-6 border-t border-custom-gray/10">
        <p className="text-xs md:text-sm font-medium text-custom-gray/80 mb-3 md:mb-4">
          Included Features
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {data.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-custom-teal shrink-0" />
              <span className="text-sm text-custom-gray/80">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 pt-4 md:pt-6 border-t border-custom-gray/10">
        <Button
          onClick={handleViewBillingHistory}
          variant="ghosted"
          textColor="text-custom-teal"
          hoverTextColor="hover:text-custom-teal/80"
          className="flex items-center gap-1 text-xs md:text-sm font-medium p-0 h-auto"
        >
          View Billing History
          <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Button>
        <Button
          onClick={handleManagePlan}
          variant="filled"
          rounded="full"
          className="px-5 md:px-6 py-2 md:py-2.5 text-sm w-full sm:w-auto"
        >
          Manage Plan
        </Button>
      </div>

      {/* Manage Plan Modal */}
      <ManagePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planDetails={currentPlanDetails}
        onUpgrade={handleUpgrade}
      />

      {/* Billing History Modal */}
      <BillingHistoryModal
        isOpen={isBillingHistoryOpen}
        onClose={() => setIsBillingHistoryOpen(false)}
      />
    </div>
  );
}
