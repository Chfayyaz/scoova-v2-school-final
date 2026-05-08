"use client";

import { X, TrendingUp, Check } from "lucide-react";
import Button from "@/components/ui/Button";


export const TrendingUpIcon=()=>(
  <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5227 0.691406L8.64448 6.56958L5.18673 3.11183L0.69165 7.60691" stroke="#4F39F6" stroke-width="1.3831" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

)

type PlanDetails = {
  planName: string;
  description: string;
  price: number;
  priceUnit: string;
  icon?: string;
  toolkitFeatures: string[];
};

type ManagePlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  planDetails: PlanDetails;
  onUpgrade?: () => void;
};

export default function ManagePlanModal({
  isOpen,
  onClose,
  planDetails,
  onUpgrade,
}: ManagePlanModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    // TODO: Implement upgrade logic
    if (onUpgrade) {
      onUpgrade();
    } else {
      console.log("Upgrade plan");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-custom-white rounded-lg shadow-xl w-full max-w-[670px] h-auto max-h-[90vh] md:h-[511px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end p-3">
          <Button
            onClick={onClose}
            variant="ghosted"
            rounded="full"
            hoverBgColor="hover:bg-custom-gray/10"
            className="p-1.5 w-auto h-auto"
          >
            <X className="w-4 h-4 text-custom-gray/60" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 pb-4 md:pb-6 flex-1 flex flex-col overflow-y-auto">
          {/* Plan Header */}
          <div className="mb-3 md:mb-4">
            <div className="flex items-center gap-4 mb-1.5">
              <h2 className="text-sm md:text-base font-semibold text-[#0A0A0A]">
                {planDetails.planName}
              </h2>
              <TrendingUpIcon/>
              
            </div>
            <p className="text-sm text-custom-gray/80 mb-1.5">
              {planDetails.description}
            </p>
            <p className="text-xs md:text-sm">
              ${planDetails.price.toFixed(2)} <span className="text-custom-gray/50">{planDetails.priceUnit}</span>
            </p>
          </div>

          {/* Toolkit Bar */}
          <div className="bg-custom-teal/50 py-2 px-3 rounded-lg mb-3">
            <p className="text-xs">
              Complete school toolkit:
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2 mb-3 md:mb-4 flex-1 min-h-0">
            {planDetails.toolkitFeatures.map((feature: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-custom-purple shrink-0 mt-0.5" />
                <span className="text-xs text-custom-gray/95 flex-1">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div>
            <Button
              onClick={handleUpgrade}
              variant="filled"
              rounded="full"
              className="w-full py-2 text-xs md:text-sm"
            >
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

