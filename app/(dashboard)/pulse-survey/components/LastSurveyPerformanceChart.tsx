"use client";

import { useState } from "react";
import { ResponseRateDataPoint } from "../data";
import Skeleton from "@/components/ui/Skeleton";

type LastSurveyPerformanceChartProps = {
  data: ResponseRateDataPoint[];
  surveyTitle: string;
  isLoading?: boolean;
};

export default function LastSurveyPerformanceChart({
  data,
  surveyTitle,
  isLoading = false,
}: LastSurveyPerformanceChartProps) {
  if (isLoading) {
    return (
      <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 mb-6">
        <Skeleton className="h-6 w-64 rounded-md mb-5" />
        <div className="space-y-3">
          <Skeleton className="h-[120px] md:h-[180px] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 mb-6">
        <h3 className="text-base md:text-[18px] font-bold text-custom-gray/95 mb-2">
          Last Survey Performance: {surveyTitle}
        </h3>
        <p className="text-sm text-custom-gray/70">
          No performance data available yet.
        </p>
      </div>
    );
  }

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex ?? selectedIndex;

  // SVG base size
  const chartWidth = 1500;
  const chartHeight = 300;
  const maxValue = 100;

  // Padding
  const leftPadding = 65;
  const rightPadding = 20;
  const topPadding = 30;
  const bottomPadding = 50;

  const chartAreaWidth = chartWidth - leftPadding - rightPadding;
  const chartAreaHeight = chartHeight - topPadding - bottomPadding;

  // Spacing between points
  const pointSpacing =
    data.length > 1 ? chartAreaWidth / (data.length - 1) : 0;

  const getY = (rate: number) =>
    chartHeight - bottomPadding - (rate / maxValue) * chartAreaHeight;

  // Smooth curved path
  const generateSmoothPath = (points: ResponseRateDataPoint[]) => {
    if (points.length < 2) return "";
    let path = `M ${leftPadding} ${getY(points[0].rate)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const x1 = leftPadding + i * pointSpacing;
      const y1 = getY(points[i].rate);
      const x2 = leftPadding + (i + 1) * pointSpacing;
      const y2 = getY(points[i + 1].rate);
      const x0 = i === 0 ? x1 : leftPadding + (i - 1) * pointSpacing;
      const y0 = i === 0 ? y1 : getY(points[i - 1].rate);
      const x3 =
        i + 2 < points.length
          ? leftPadding + (i + 2) * pointSpacing
          : x2;
      const y3 =
        i + 2 < points.length
          ? getY(points[i + 2].rate)
          : y2;

      const cp1x = x1 + (x2 - x0) / 6;
      const cp1y = y1 + (y2 - y0) / 6;
      const cp2x = x2 - (x3 - x1) / 6;
      const cp2y = y2 - (y3 - y1) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
    }
    return path;
  };

  const pathData = generateSmoothPath(data);

  return (
    <div className="bg-custom-white rounded-lg  border border-custom-gray/10 shadow-sm p-6 mb-6">
      <h3 className="text-base  md:text-[18px] font-bold text-custom-gray/95 mb-4">
        Last Survey Performance: {surveyTitle}
      </h3>

      <div className="relative w-full h-[100px] md:h-[160px]">
      <svg
  width="100%"
  height="100%"
  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
  preserveAspectRatio="xMidYMid meet"
  className="w-full"
>
          {/* Area color */}
          <defs>
  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#A5B0D0" stopOpacity="1" />  {/* top of area */}
    <stop offset="100%" stopColor="#A5B0D0" stopOpacity="0.6" /> {/* bottom of area */}
  </linearGradient>
</defs>


          {/* Grid lines + Y labels */}
          {[0, 20, 40, 60, 80, 100].map((value) => {
            const y = getY(value);
            return (
              <g key={value}>
                <line
                  x1={leftPadding}
                  y1={y}
                  x2={chartWidth - rightPadding}
                  y2={y}
                  stroke="#9ca3af"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <text
                  x={leftPadding - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="text-lg"
                  fill="#374151"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path
            d={`${pathData} L ${chartWidth - rightPadding} ${
              chartHeight - bottomPadding
            } L ${leftPadding} ${chartHeight - bottomPadding} Z`}
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points - hover/click only on the dot */}
          {data.map((point, index) => {
            const x = leftPadding + index * pointSpacing;
            const y = getY(point.rate);
            const isActive = activeIndex === index;
            const handleClick = () =>
              setSelectedIndex((prev) => (prev === index ? null : index));
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 6 : 4}
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={handleClick}
                  style={{ cursor: "pointer" }}
                />
                {isActive && (
                  <g pointerEvents="none">
                    <rect
                      x={x - 62}
                      y={y - 52}
                      width="124"
                      height="48"
                      fill="#ffffff"
                      rx="6"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      filter="drop-shadow(0 2px 8px rgba(0,0,0,0.08))"
                    />
                    <text
                      x={x}
                      y={y - 32}
                      textAnchor="middle"
                      fill="#6b7280"
                      fontSize="18"
                      fontWeight="500"
                    >
                      {point.week}
                    </text>
                    <text
                      x={x}
                      y={y - 16}
                      textAnchor="middle"
                      fill="#111827"
                      fontSize="12"
                      fontWeight="600"
                    >
                      Response rate: {point.rate}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* X labels - clickable to show detail */}
          {data.map((point, index) => {
            const x = leftPadding + index * pointSpacing;
            const isActive = activeIndex === index;
            return (
              <g
                key={index}
                onClick={() =>
                  setSelectedIndex((prev) => (prev === index ? null : index))
                }
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              >
                <text
                  x={x}
                  y={chartHeight - bottomPadding + 18}
                  textAnchor={
                    index === 0
                      ? "start"
                      : index === data.length - 1
                      ? "end"
                      : "middle"
                  }
                  fontSize="18"
                  fill={isActive ? "#3b82f6" : "#374151"}
                  fontWeight={isActive ? "600" : "400"}
                >
                  {point.week}
                </text>
              </g>
            );
          })}


          {/* Axis label */}
          <text
            x={20}
            y={chartHeight / 2}
            transform={`rotate(-90, 20, ${chartHeight / 2})`}
            textAnchor="middle"
            className="text-lg font-semibold"
            fill="#374151"
          >
            Response Rate (%)
          </text>
        </svg>
      </div>
    </div>
  );
}
