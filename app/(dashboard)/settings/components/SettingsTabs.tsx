"use client";

import { settingsTabs } from "../data";
import Button from "@/components/ui/Button";

type SettingsTabsProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export default function SettingsTabs({
  activeTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div className="w-full md:w-64 shadow h-auto px-2 py-2 rounded-lg shrink-0">
      <div className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-x-visible hide-scrollbar md:space-y-1">
        {settingsTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={isActive ? "filled" : "ghosted"}
              rounded="lg"
              bgColor={isActive ? "bg-custom-teal" : undefined}
              textColor={isActive ? "text-custom-white" : "text-custom-gray/80"}
              hoverBgColor={isActive ? undefined : "hover:bg-custom-gray/5"}
              className={`flex-shrink-0 md:w-full text-left px-4 py-3 whitespace-nowrap ${
                isActive ? "font-medium shadow-sm" : ""
              }`}
            >
              {tab.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

