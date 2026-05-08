"use client";

import Image from "next/image";
import { MetricCard } from "../data";


type AnalyticsMetricsCardProps = {
  metric: MetricCard;
  isLast?: boolean;
};


export const RedArrowIcon=()=>(
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.08948 10.649C8.24025 10.4983 8.33261 10.2887 8.33231 10.0586L8.33231 9.95736C8.33231 9.49657 7.95928 9.12353 7.49907 9.12412L2.94615 9.12412L10.6479 1.42236C10.9732 1.09709 10.9732 0.569122 10.6479 0.243853C10.3226 -0.0814164 9.79466 -0.0814164 9.46939 0.243853L1.76764 7.94561V3.39269C1.76764 2.93189 1.3946 2.55885 0.934395 2.55944H0.833116C0.372318 2.55944 -0.000717179 2.93248 -0.000127913 3.39269V10.0586C-0.000127913 10.5194 0.372908 10.8925 0.833116 10.8919L7.49907 10.8919C7.72947 10.8919 7.9387 10.7998 8.08948 10.649Z" fill="#FF3B30"/>
</svg>

)
export const GreenArrowIcon=()=>(
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.80261 0.242797C2.65184 0.393573 2.55948 0.6031 2.55977 0.833204L2.55977 0.934482C2.55977 1.39528 2.93281 1.76832 3.39302 1.76773L7.94594 1.76773L0.244184 9.46948C-0.0810847 9.79475 -0.0810847 10.3227 0.244184 10.648C0.569454 10.9733 1.09743 10.9733 1.4227 10.648L9.12445 2.94624V7.49916C9.12445 7.95996 9.49749 8.33299 9.9577 8.3324H10.059C10.5198 8.3324 10.8928 7.95937 10.8922 7.49916V0.833204C10.8922 0.372406 10.5192 -0.000629554 10.059 -4.02885e-05L3.39302 -4.02885e-05C3.16262 -4.035e-05 2.95339 0.0920217 2.80261 0.242797Z" fill="#34C759"/>
  </svg>
  

)

export default function AnalyticsMetricsCard({
  metric,
  isLast = false,
}: AnalyticsMetricsCardProps) {
  // Get icon border color based on card ID
  const getIconBorderColor = (id: number) => {
    switch (id) {
      case 1:
        return "border-[#4A90E2]";
      case 2:
        return "border-custom-green";
      case 3:
        return "border-custom-purple";
      case 5:
        return "border-custom-yellow";
      default:
        return "border-custom-gray/20";
    }
  };

  // Format value for display (handle "/10" case)
  const formatValue = (value: string | number) => {
    const str = String(value);
    if (str.includes("/")) {
      const parts = str.split("/");
      return (
        <>
          <span className="text-2xl sm:text-3xl font-bold text-custom-gray/95">
            {parts[0]}
          </span>
          <span className="text-[16px] text-custom-gray/60">/{parts[1]}</span>
        </>
      );
    }
    return (
      <span className="text-2xl sm:text-2xl font-bold text-[#000000]">
        {value}
      </span>
    );
  };

  return (
    <div
      className={`flex-1 p-4 sm:p-5 relative min-w-0 max-w-full ${
        !isLast ? "border-b border-custom-gray/20 sm:border-b-0" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="mb-1 break-words">{formatValue(metric.value)}</div>
          {metric.title && (
            <p className="text-sm text-[#000000] mb-2 break-words">
              {metric.title}
            </p>
          )}
          {metric.trend.value && (
            <div
              className={`flex items-center gap-2 text-xs sm:text-sm flex-wrap ${
                metric.trend.type === "positive"
                  ? "text-custom-green"
                  : "text-red-500"
              }`}
            >
              {metric.trend.type === "positive" ? (
                <GreenArrowIcon />
              ) : (
                <RedArrowIcon />
              )}
              <span className="whitespace-nowrap">{metric.trend.value}</span>
              {metric.trend.change && (
                <span className="text-custom-gray/60 ml-1 whitespace-nowrap">
                  {metric.trend.change}
                </span>
              )}
            </div>
          )}
        </div>
        {metric.icon && (
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-lg border bg-custom-white flex items-center justify-center ${getIconBorderColor(
                metric.id
              )}`}
            >
              <Image
                src={metric.icon}
                alt={metric.title || "Metric icon"}
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </div>
          </div>
        )}
      </div>
      {!isLast && (
        <div className="absolute top-4 bottom-4 right-0 hidden sm:block w-px bg-custom-gray/20" />
      )}
    </div>
  );
}

