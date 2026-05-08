"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { RatingDataPoint } from "../data";
import { ChevronDown, Check } from "lucide-react";
import Button from "@/components/ui/Button";

const PERIOD_OPTIONS = [
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
] as const;

function computeNiceCeiling(maxReviews: number): number {
  if (!Number.isFinite(maxReviews) || maxReviews <= 0) return 10;
  const padded = Math.max(maxReviews, 1);
  const exp = Math.floor(Math.log10(padded));
  const fraction = padded / 10 ** exp;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * 10 ** exp;
}

type RatingDistributionChartProps = {
  monthlyData: RatingDataPoint[];
  yearlyData: RatingDataPoint[];
};

export default function RatingDistributionChart({
  monthlyData,
  yearlyData,
}: RatingDistributionChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const data = useMemo(() => {
    return selectedPeriod === "Yearly" ? yearlyData : monthlyData;
  }, [selectedPeriod, monthlyData, yearlyData]);

  useEffect(() => {
    setHoveredIndex(null);
  }, [selectedPeriod]);

  const getLabel = (point: RatingDataPoint) => {
    if (selectedPeriod === "Yearly") return point.year || "";
    return point.month || "";
  };

  const maxReviews = useMemo(
    () => (data.length ? Math.max(...data.map((d) => d.reviews)) : 0),
    [data]
  );
  const maxValue = useMemo(() => computeNiceCeiling(maxReviews), [maxReviews]);
  const yTicks = useMemo(
    () => [0, 1, 2, 3, 4, 5].map((i) => Math.round((maxValue * (5 - i)) / 5)),
    [maxValue]
  );

  // Fixed chart dimensions (viewBox width extended so 12th dot is visible)
  const chartHeight = 200;
  const chartWidth = 600;
  const viewBoxX = -12;
  const viewBoxY = 0;
  const viewBoxWidth = chartWidth + 24;

  // Adjust X positions to fit evenly in fixed width
  const generateSmoothPath = () => {
    if (data.length === 0) return "";

    const spacing = chartWidth / (data.length - 1 || 1);

    const points = data.map((d, i) => ({
      x: i * spacing,
      y: chartHeight - (d.reviews / maxValue) * chartHeight,
    }));

    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
    if (points.length === 2) {
      return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
    }

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      if (i === 0) {
        path += ` C ${p1.x + (p2.x - p1.x) / 3},${p1.y} ${p1.x + 2 * (p2.x - p1.x) / 3},${p2.y} ${p2.x},${p2.y}`;
      } else if (i === points.length - 2) {
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      } else {
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
    }

    return path;
  };

  return (
    <div className="min-w-0 max-w-full w-full lg:max-w-[630px] bg-custom-white rounded-lg border border-custom-gray/20 p-4 sm:p-6 shadow-sm box-border">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-custom-gray/95 min-w-0">
          Ratings Distribution
        </h3>
        <div className="relative w-full sm:w-auto shrink-0 self-start sm:self-center" ref={dropdownRef}>
          <Button
            type="button"
            variant="ghosted"
            rounded="lg"
            textColor="text-custom-gray/95"
            borderColor="border-custom-gray/20"
            hoverBgColor="hover:bg-custom-gray/5"
            hoverTextColor="hover:text-custom-gray/95"
            onClick={() => setDropdownOpen((open) => !open)}
            className="w-full sm:w-auto min-w-[128px] justify-between gap-2 text-left shadow-sm hover:border-custom-gray/30"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>{selectedPeriod}</span>
            <ChevronDown
              size={18}
              strokeWidth={2}
              className={`text-custom-gray/50 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </Button>
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full z-10 mt-1.5 w-full min-w-[128px] overflow-hidden rounded-lg border border-custom-gray/20 bg-custom-white py-1 shadow-lg"
              role="listbox"
            >
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selectedPeriod === option.value}
                  onClick={() => {
                    setSelectedPeriod(option.value);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-custom-gray/10 ${
                    selectedPeriod === option.value
                      ? "bg-custom-gray/10 font-medium text-custom-gray/95"
                      : "text-custom-gray/80"
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedPeriod === option.value && (
                    <Check size={16} className="text-custom-gray/70 flex-shrink-0" strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative -mx-4 sm:-mx-2 md:mx-0 px-4 sm:px-2 md:px-0 overflow-x-auto overflow-y-hidden md:overflow-visible">
        <div className="relative min-w-[400px] md:min-w-0">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-custom-gray/60 whitespace-nowrap origin-left">
            No. of Reviews
          </div>

          <div
            className="absolute left-8 top-0 text-xs text-custom-gray/60 pr-2"
            style={{ height: `${chartHeight}px`, width: "2rem" }}
          >
          {yTicks.map((value, i) => (
            <span
              key={`tick-${i}-${value}`}
              className={`absolute ${i === 0 ? "translate-y-0" : i === 5 ? "-translate-y-full" : "-translate-y-1/2"}`}
              style={{ top: `${(i / 5) * 100}%` }}
            >
              {value}
            </span>
          ))}
        </div>

        <div className="ml-12 md:ml-16 relative" style={{ height: `${chartHeight}px` }}>
          <div className="absolute inset-0">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-custom-gray/10"
                style={{ top: `${(i / 5) * 100}%` }}
              />
            ))}
          </div>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chart-bar-gradient" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#d1d5db" stopOpacity="25" />
                <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.25" />
              </linearGradient>
              <filter id="tooltip-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.25" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Vertical bar first (behind the line) - semi-transparent, gradient, rounded */}
            {data.map((d, i) => {
              if (hoveredIndex !== i) return null;
              const spacing = chartWidth / (data.length - 1 || 1);
              const y = chartHeight - (d.reviews / maxValue) * chartHeight;
              const x = i * spacing;
              const barHeight = chartHeight - y;
              return (
                <rect
                  key={`bar-${i}`}
                  x={x - 20}
                  y={y}
                  width="40"
                  height={barHeight}
                  rx="6"
                  ry="6"
                  fill="url(#chart-bar-gradient)"
                />
              );
            })}

            {/* Dark blue wavy trend line (overlays the bar) */}
            <path
              d={generateSmoothPath()}
              fill="none"
              stroke="#1F2253"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data.map((d, i) => {
              const spacing = chartWidth / (data.length - 1 || 1);
              const y = chartHeight - (d.reviews / maxValue) * chartHeight;
              const x = i * spacing;
              const isHovered = hoveredIndex === i;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill="#1F2253"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  />
                  {isHovered && (
                    <g>
                      {/* Minimalist statistics card - white, shadow, rounded */}
                      <rect
                        x={x - 56}
                        y={y - 58}
                        width="112"
                        height="44"
                        fill="#ffffff"
                        rx="8"
                        ry="8"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        filter="url(#tooltip-shadow)"
                      />
                      {/* Inverted triangle pointer at bottom center */}
                      <path
                        d={`M ${x - 8},${y - 14} L ${x},${y - 6} L ${x + 8},${y - 14} Z`}
                        fill="#ffffff"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeLinejoin="round"
                      />
                      {/* Label: No. of Reviews - light gray */}
                      <text x={x} y={y - 38} textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="500">
                        No. of Reviews
                      </text>
                      {/* Number: large, bold, dark */}
                      <text x={x} y={y - 18} textAnchor="middle" fill="#111827" fontSize="18" fontWeight="700">
                        {d.reviews}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="ml-12 md:ml-16 mt-2 flex justify-between text-[10px] md:text-xs text-custom-gray/60">
          {data.map((d, i) => (
            <span
              key={i}
              className="flex-1 min-w-0 text-center cursor-pointer hover:text-custom-gray/80 transition-colors py-1 -my-1 truncate px-0.5"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {getLabel(d)}
            </span>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
