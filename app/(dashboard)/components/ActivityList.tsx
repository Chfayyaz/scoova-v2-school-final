import { ActivityItem } from "../data";
import Image from "next/image";

type ActivityListProps = {
  activities: ActivityItem[];
};

function getActivityVisual(activity: ActivityItem): { icon: string; bgColor: string } {
  switch (activity.type) {
    case "survey_created":
      return { icon: "/images/svg/puls.svg", bgColor: "bg-custom-teal/10" };
    case "survey_published":
      return { icon: "/images/svg/bell.svg", bgColor: "bg-custom-green/10" };
    case "school_followed":
      return { icon: "/images/svg/persons.svg", bgColor: "bg-[#D0BCFF4D]" };
    case "review_submitted":
      return { icon: "/images/svg/star.svg", bgColor: "bg-custom-yellow/10" };
    case "school_staff_added":
      return { icon: "/images/svg/personplus.svg", bgColor: "bg-custom-teal/10" };
    case "school_staff_removed":
      return { icon: "/images/svg/alert.svg", bgColor: "bg-custom-gray/10" };
    default:
      return {
        icon: activity.icon || "/images/svg/clock.svg",
        bgColor: activity.bgColor || "bg-custom-gray/10",
      };
  }
}

export default function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="bg-custom-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="px-4 py-5">
        <h2 className="text-[18px] font-semibold text-custom-gray/90">
          Recent Activity
        </h2>
      </div>

      {/* Activity Items */}
      <div className="">
        {activities.map((activity) => {
          const visual = getActivityVisual(activity);
          return (
          <div key={activity.id} className="flex gap-3 px-8 py-4 items-start">
            {/* Icon with background */}
            <div
              className={`w-10 h-10 rounded-lg  flex items-center justify-center  ${
                visual.bgColor
              }`}
            >
              <Image
                src={visual.icon}
                alt={activity.title}
                width={15}
                height={15}
              />
            </div>

            {/* Text content */}
            <div>
              <h1 className=" text-[16px] font-semibold text-custom-gray/90">
                {activity.title}
              </h1>

              <p className="text-custom-yellow text-sm"></p>
              <p className="text-sm text-custom-gray/80">
                {activity.description}
              </p>

              <span className="text-xs text-custom-gray/90">
                {activity.time}
              </span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
