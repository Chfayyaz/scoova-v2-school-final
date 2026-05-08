"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type ResponseRateCardProps = {
  responseRate: number;
  completed: number;
  pending: number;
};

export default function ResponseRateCard({
  responseRate,
  completed,
  pending,
}: ResponseRateCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const COLORS = [
    "var(--color-custom-teal)",
    "var(--color-custom-gray)",
  ] as const;

  // Set radius values based on screen size
  // Mobile: smaller radii for 120px container
  // Desktop: larger radii for 140px container
  const innerRadius = isMobile ? 38 : 45;
  const outerRadius = isMobile ? 58 : 65;

  return (
    <div className="bg-custom-white w-full md:w-[270px] rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6 overflow-hidden">
      <h3 className="text-sm md:text-base font-semibold text-custom-gray/95 mb-3 md:mb-4 text-center">
        Response Rate
      </h3>
      <div className="flex items-center justify-center mb-4 md:mb-5">
        <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={index === 1 ? 0.12 : 1}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-custom-gray/95">
                {responseRate}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs md:text-sm text-custom-gray/80">
          <span className="font-semibold text-custom-gray/95">{completed}</span>
          <span> Completed / </span>
          <span className="font-semibold text-custom-gray/95">{pending}</span>
          <span> Pending</span>
        </p>
      </div>
    </div>
  );
}

