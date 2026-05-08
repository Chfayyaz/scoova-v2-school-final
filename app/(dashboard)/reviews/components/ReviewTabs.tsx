"use client";

import { ReviewStatus } from "../data";
import Button from "@/components/ui/Button";

type ReviewTabsProps = {
  activeTab: ReviewStatus;
  onTabChange: (tab: ReviewStatus) => void;
};

export default function ReviewTabs({
  activeTab,
  onTabChange,
}: ReviewTabsProps) {
  const tabs: { id: ReviewStatus; label: string }[] = [
    { id: "all", label: "ALL" },
    { id: "replied", label: "Replies" },
    { id: "pending", label: "Pending Replies" },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-6 overflow-x-auto lg:overflow-visible">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          rounded="full"
          bgColor={
            activeTab === tab.id ? "bg-custom-teal" : "bg-custom-white"
          }
          textColor={
            activeTab === tab.id
              ? "text-custom-white"
              : "text-custom-gray/95 hover:text-custom-white"
          }
          borderColor="border-custom-gray/20"
          className={`px-4 sm:px-4.5 font-semibold md:border-none border border-custom-gray/20  soft-shadow py-4 text-xs sm:text-sm whitespace-nowrap ${
            activeTab !== tab.id ? "" : ""
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

