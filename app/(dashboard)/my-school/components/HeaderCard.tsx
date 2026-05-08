import type { HeaderCardProps } from "../data";
import Image from "next/image";

export default function HeaderCard({ data }: { data: HeaderCardProps }) {
  return (
    <div className="bg-custom-white/95 relative sm:absolute sm:top-5 sm:left-10 w-full sm:w[60%] md:w-[55%] h-auto lg:w-[44.50%] sm:p-5 px-3 py-4 rounded-lg shadow-md">
      {/* School Logo & Name */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="sm:text-[20px] text-[16px] font-bold text-custom-gray/95 break-words">
            {data.schoolname}
          </h1>
        </div>
        <Image
          src={data.logo}
          width={20}
          height={20}
          alt="School Logo"
          className="sm:w-16 sm:h-16 h-12 w-12 object-contain"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {data.stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col items-center text-center w-full min-w-0"
          >
            <Image
              src={stat.icon}
              alt={stat.text}
              width={20}
              height={20}
              className={`w-8 h-8 rounded-full p-2 shrink-0 ${stat.bgColor}`}
            />
            <p className="text-custom-gray/70 text-[10px] mt-1 w-full">
              {stat.text}
            </p>
            {stat.year && (
              <p className="font-semibold text-xs w-full">{stat.year}</p>
            )}
            {stat.name && (
              <p className="font-semibold text-[10px] w-full leading-snug">
                {stat.name}
              </p>
            )}
            {stat.number && (
              <p className="font-semibold text-xs w-full">{stat.number}</p>
            )}
            {stat.rating && (
              <p className="font-semibold text-xs w-full">{stat.rating.toFixed(1)}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {data.types.map((type, index) => (
          <span
            key={`${type}-${index}`}
            className="inline-flex items-center justify-center rounded-full bg-custom-yellow text-custom-gray/95 text-xs px-3 sm:px-4 py-1.5 sm:py-2 font-medium"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
