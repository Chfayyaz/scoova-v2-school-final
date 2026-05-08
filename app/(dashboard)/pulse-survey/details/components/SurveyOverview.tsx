"use client";

import { Check } from "lucide-react";





export const CheckIcon=()=>(
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM10.0898 5.71484L6.58984 9.21484C6.33281 9.47188 5.91719 9.47188 5.66289 9.21484L3.91289 7.46484C3.65586 7.20781 3.65586 6.79219 3.91289 6.53789C4.16992 6.28359 4.58555 6.28086 4.83984 6.53789L6.125 7.82305L9.16016 4.78516C9.41719 4.52812 9.83281 4.52812 10.0871 4.78516C10.3414 5.04219 10.3441 5.45781 10.0871 5.71211L10.0898 5.71484Z" fill="#16A34A"/>
</svg>

)

type SurveyOverviewProps = {
  title: string;
  createdOn: string;
  lastUpdated: string;
  description: string;
  status: "draft" | "active" | "ended";
};

export default function SurveyOverview({
  title,
  createdOn,
  lastUpdated,
  description,
  status,
}: SurveyOverviewProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-custom-green/20 text-[#16A34A]";
      case "ended":
        return "bg-custom-gray/10 text-custom-gray/70";
      case "draft":
        return "bg-custom-yellow/20 text-[#854D0E]";
      default:
        return "bg-custom-gray/10 text-custom-gray/70";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Active";
      case "ended":
        return "Ended";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  return (
    <div className=" mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-custom-gray/95 mb-2 md:mb-3">
            {title}
          </h1>
          <div className="flex flex-row flex-wrap sm:flex-row gap-1 text-xs md:text-sm mb-2 md:mb-3">
            <span className="text-custom-gray/60">Created on:</span>
           <span>
             {createdOn}
            </span>
          <span className="hidden sm:block h-5 mx-2 w-px bg-custom-gray/50 "></span>
            <span className="text-custom-gray/60">Last Updated:</span>
              <span>
              {lastUpdated}
              </span>
          </div>
          <p className="text-xs md:text-[16px] text-custom-gray/80 leading-relaxed">
            {description}
          </p>
        </div>
        <span
          className={`inline-flex items-center  gap-1.5 px-2 py-1 rounded-full text-sm font-medium font-medium w-fit ${getStatusColor()}`}
        >
          {status === "active" && <CheckIcon/>}
          {getStatusText()}
        </span>
      </div>
    </div>
  );
}

