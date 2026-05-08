"use client";

import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ParticipationTrendCardProps = {
  data: { date: string; responses: number }[];
};

export default function ParticipationTrendCard({
  data,
}: ParticipationTrendCardProps) {
  return (
    <div className="bg-custom-white w-full md:w-[555px] rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6 overflow-hidden">
      {/* Title */}
      <h3 className="text-sm md:text-base font-semibold text-custom-gray/95 mb-3 md:mb-4">
        Participation Trend
      </h3>

      {/* Chart */}
      <div className="h-[150px] md:h-[186px] overflow-x-auto overflow-y-hidden md:overflow-visible chart-container">
        <style jsx>{`
          .chart-container :global(.recharts-cartesian-grid-horizontal > line:first-child),
          .chart-container :global(.recharts-cartesian-grid-horizontal > line:last-child) {
            display: none;
          }
        `}</style>

        <div className="h-full min-w-[520px] md:min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical
                horizontal
                stroke="var(--color-custom-gray)"
                strokeOpacity={0.08}
              />

              <XAxis
                dataKey="date"
                padding={{ left: 0, right: 0 }}
                stroke="var(--color-custom-gray)"
                strokeOpacity={0.6}
                fontSize={12}
                axisLine={{ stroke: "var(--color-custom-gray)", strokeOpacity: 0.6 }}
                tickLine={false}
                tickMargin={10}
                tickCount={6}
                interval={0}
              />

              <YAxis
                width={40}
                stroke="var(--color-custom-gray)"
                strokeOpacity={0.6}
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />

              <Tooltip cursor={false} />

              <Area
                type="monotone"
                dataKey="responses"
                stroke="none"
                fill="var(--color-custom-teal)"
                fillOpacity={0.08}
              />

              <Line
                type="monotone"
                dataKey="responses"
                stroke="var(--color-custom-teal)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}