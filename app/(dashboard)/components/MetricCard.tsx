import Image from "next/image";
import { MetricCard as MetricCardType } from "../data";

interface MetricCardProps {
  metric: MetricCardType;
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="bg-custom-white rounded-lg px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer hover:shadow-md transition-shadow">
      <div className="">
        <div className="">
          <div className="flex justify-between items-center">
            <div className={`p-2.5  rounded-lg ${metric.bgColor}`}>
              <Image
                src={metric.icon}
                alt={metric.title}
                width={24}
                height={24}
                className="w-4 h-4"
              />
            </div>
            {metric.change ? (
              <span
                className={` font-medium rounded-full text-xs px-1.5 py-0.5  ${
                  metric.changeType === "positive"
                    ? "text-[#15803D] bg-custom-green/10  "
                    : "text-custom-purple/80"
                }`}
              >
                {metric.change}
              </span>
            ) : (
              <span className="text-xs px-1.5 py-0.5 invisible" aria-hidden>
                —
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold  text-custom-gray">
              {metric.value}
            </p>
            <p className="text-sm text-custom-gray mb-1">{metric.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
