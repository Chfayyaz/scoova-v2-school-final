"use client";

import Image from "next/image";
import Skeleton from "@/components/ui/Skeleton";

type SummaryCardProps = {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  isLoading?: boolean;
};

export default function SummaryCard({
  title,
  value,
  icon,
  iconBgColor,
  isLoading = false,
}: SummaryCardProps) {
  if (isLoading) {
    return (
      <div className="bg-custom-white rounded-lg p-5 shadow-sm border border-custom-gray/10">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3 rounded-md" />
            <Skeleton className="h-7 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-custom-white rounded-lg p-5 shadow-sm border border-custom-gray/10">
      <div className="flex items-center gap-3">
        <div className={`${iconBgColor} rounded-full p-3 flex items-center justify-center flex-shrink-0`}>
          <Image src={icon} alt={title} width={20} height={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-custom-gray/60">{title}</p>
          <p className="text-2xl font-bold text-custom-gray/95">{value}</p>
        </div>
      </div>
    </div>
  );
}

