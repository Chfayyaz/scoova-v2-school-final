"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type QuestionRatingsChartProps = {
  data: { category: string; averageScore: number }[];
};

export default function QuestionRatingsChart({
  data,
}: QuestionRatingsChartProps) {
  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm overflow-hidden">
      <h3 className="text-base md:text-[18px] font-semibold px-2 md:px-4 py-3 md:py-4 text-[#4A4A4A]">
        Survey Question Ratings
      </h3>
      <p className="text-center text-xs md:text-[18px] text-custom-gray/95 mb-3 md:mb-4">Average Score (out of 5)</p>
      <div className="w-full overflow-x-auto md:overflow-x-visible">
        <div className="min-w-[400px] md:min-w-0">
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid stroke="#e5e5e5" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tickFormatter={(v) => String(Math.round(v)).padStart(2, "0")}
                stroke="#4a4a4a"
                style={{ fontSize: "12px", fill: "#9ca3af" }}
                axisLine={{ stroke: "rgba(74, 74, 74, 0.2)" }}
                tickLine={false}
              />
              <YAxis
                dataKey="category"
                type="category"
                stroke="#555555"
                style={{ fontSize: "12px" }}
                width={140}
                tick={{ dx: -25 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(74, 74, 74, 0.2)" }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="averageScore" fill="#1bc1bc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-center text-[18px] text-[#333333] pb-4 pt-1">
        Average Rating
      </p>
    </div>
  );
}