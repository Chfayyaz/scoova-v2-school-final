"use client";

import type { InfoCard } from "../data";
import Image from "next/image";

type AboutSectionProps = {
  schoolName: string;
  description: string;
  infoCards: InfoCard[];
};

export default function AboutSection({ schoolName, description, infoCards }: AboutSectionProps) {
  return (
    <div className="grid sm:grid-cols-[60%_40%] mt-3 sm:px-5">
      <div>
        <h2 className="lg:text-[32px] text-xl md:text-2xl text-custom-gray/95 font-bold">
          About {schoolName}
        </h2>
        <p className="mt-3 text-custom-gray/90 text-sm md:text-[16px]">{description}</p>
      </div>

      <div className="sm:ml-10 md:ml-25">
        {infoCards.map((item) => (
          <div key={item.id} className="">
            <div className="flex gap-2 py-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bgColor}`}
              >
                <Image src={item.icon} width={20} height={20} alt="" />
              </div>
              <div>
                <p className="text-sm text-custom-gray/95">{item.label}</p>
                <p className="font-semibold text-xs lg:text-[16px] break-all">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
