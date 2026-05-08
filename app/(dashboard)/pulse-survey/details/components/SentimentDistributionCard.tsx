"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type SentimentDistributionCardProps = {
  data: { type: string; percentage: number }[];
};

export default function SentimentDistributionCard({
  data,
}: SentimentDistributionCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const COLORS: Record<string, string> = {
    positive: "#AC7F5E", // brown
    neutral: "#F8BD24", // yellow
    negative: "#F87171", // pink/coral
  };

  const formattedData = data
    .map((item) => ({
      name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      value: item.percentage,
      color: COLORS[item.type.toLowerCase()] || "#4a4a4a",
      type: item.type.toLowerCase(),
    }))
    .sort((a, b) => {
      // Order: positive, negative, neutral (swapping neutral and negative positions)
      const order: Record<string, number> = {
        positive: 0,
        negative: 1,
        neutral: 2,
      };
      return (order[a.type] ?? 99) - (order[b.type] ?? 99);
    });

  // Set radius values based on screen size
  // Mobile: smaller radii to prevent overflow
  // Desktop: larger radii for better visibility on laptop
  const innerRadius = isMobile ? 30 : 50;
  const outerRadius = isMobile ? 80 : 130;

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6 overflow-hidden">
      <h3 className="text-base md:text-[18px] font-bold text-custom-gray/95 ">
        Sentiment Distribution
      </h3>
      <p className="text-xs md:text-sm text-center text-custom-gray/60 mb-0 md:mb-6">
        Based on Comment Analysis
      </p>
      
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={260} className="md:h-[280px]">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-0 md:mt-4 w-full">
          {formattedData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs md:text-sm text-custom-gray/95">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

