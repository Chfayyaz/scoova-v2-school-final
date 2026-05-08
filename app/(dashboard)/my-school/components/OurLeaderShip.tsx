"use client";

import type { LeadershipRow } from "@/lib/api/myshool.api";
import OurLeaderCards from "./OurLeaderCards";

type OurLeaderShipProps = {
  members: LeadershipRow[];
};

export default function OurLeaderShip({ members }: OurLeaderShipProps) {
  if (members.length === 0) {
    return (
      <div className="mt-5 sm:px-5">
        <h2 className="font-bold text-xl md:text-3xl text-custom-gray/95">Our Leadership Team</h2>
        <p className="text-sm text-custom-gray/70 mt-2">No management team members listed yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 sm:px-5">
      <div>
        <h2 className="font-bold text-xl md:text-3xl text-custom-gray/95">Our Leadership Team</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-2.5 md:mt-4">
          {members.map((leader) => (
            <OurLeaderCards
              key={leader.id}
              img={leader.img}
              icon={leader.icon}
              title={leader.title}
              name={leader.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
