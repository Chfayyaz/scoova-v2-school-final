"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { updateReceiveFollowActivitySettingsApi } from "@/lib/api/myshool.api";
import { notifications } from "../../data";
import {
  NOTIFICATION_API_ITEM_IDS,
  type NotificationCategory,
  type NotificationItem,
  type NotificationSettings,
} from "../data";
import { X } from "lucide-react";

type NotificationsProps = {
  data: NotificationSettings;
  onReviewSubmissionActivityChange: (enabled: boolean) => Promise<void>;
  /** Called after follow-activity PATCH succeeds so parent can sync `mySchool`. */
  onFollowActivitySaved: (receiveFollowActivity: boolean) => void;
  onNavigateToManagePlan?: () => void;
};

const getItemIconBackground = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-[#EBF3FE]";
    case "yellow":
      return "bg-custom-yellow/20";
    case "green":
      return "bg-custom-green/20";
    case "red":
      return "bg-custom-purple/20";
    case "orange":
      return "bg-custom-yellow/20";
    default:
      return "";
  }
};

export const BuildingIcon=()=>(<svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.1953 0.210937C12.7734 -0.0703125 12.2266 -0.0703125 11.8047 0.210937L6.49609 3.75H1.875C0.839844 3.75 0 4.58984 0 5.625V18.125C0 19.1602 0.839844 20 1.875 20H23.125C24.1602 20 25 19.1602 25 18.125V5.625C25 4.58984 24.1602 3.75 23.125 3.75H18.5039L13.1953 0.210937ZM10 16.25C10 14.8711 11.1211 13.75 12.5 13.75C13.8789 13.75 15 14.8711 15 16.25V20H10V16.25ZM3.75 7.5H5C5.34375 7.5 5.625 7.78125 5.625 8.125V10.625C5.625 10.9688 5.34375 11.25 5 11.25H3.75C3.40625 11.25 3.125 10.9688 3.125 10.625V8.125C3.125 7.78125 3.40625 7.5 3.75 7.5ZM19.375 8.125C19.375 7.78125 19.6562 7.5 20 7.5H21.25C21.5938 7.5 21.875 7.78125 21.875 8.125V10.625C21.875 10.9688 21.5938 11.25 21.25 11.25H20C19.6562 11.25 19.375 10.9688 19.375 10.625V8.125ZM3.75 12.5H5C5.34375 12.5 5.625 12.7812 5.625 13.125V15.625C5.625 15.9688 5.34375 16.25 5 16.25H3.75C3.40625 16.25 3.125 15.9688 3.125 15.625V13.125C3.125 12.7812 3.40625 12.5 3.75 12.5ZM19.375 13.125C19.375 12.7812 19.6562 12.5 20 12.5H21.25C21.5938 12.5 21.875 12.7812 21.875 13.125V15.625C21.875 15.9688 21.5938 16.25 21.25 16.25H20C19.6562 16.25 19.375 15.9688 19.375 15.625V13.125ZM9.0625 6.875C9.0625 5.96332 9.42466 5.08898 10.0693 4.44432C10.714 3.79966 11.5883 3.4375 12.5 3.4375C13.4117 3.4375 14.286 3.79966 14.9307 4.44432C15.5753 5.08898 15.9375 5.96332 15.9375 6.875C15.9375 7.78668 15.5753 8.66102 14.9307 9.30568C14.286 9.95034 13.4117 10.3125 12.5 10.3125C11.5883 10.3125 10.714 9.95034 10.0693 9.30568C9.42466 8.66102 9.0625 7.78668 9.0625 6.875ZM12.5 5C12.1562 5 11.875 5.28125 11.875 5.625V6.875C11.875 7.21875 12.1562 7.5 12.5 7.5H13.75C14.0938 7.5 14.375 7.21875 14.375 6.875C14.375 6.53125 14.0938 6.25 13.75 6.25H13.125V5.625C13.125 5.28125 12.8438 5 12.5 5Z" fill="#10B981"/>
  </svg>
  )
export const HeartIcon=()=>(
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.85938 10.0879L8.91797 16.6777C9.21094 16.9511 9.59766 17.1035 10 17.1035C10.4023 17.1035 10.7891 16.9511 11.082 16.6777L18.1406 10.0879C19.3281 8.98239 20 7.43161 20 5.81051V5.58395C20 2.85348 18.0273 0.525356 15.3359 0.0761369C13.5547 -0.220738 11.7422 0.361293 10.4688 1.63473L10 2.10348L9.53125 1.63473C8.25781 0.361293 6.44531 -0.220738 4.66406 0.0761369C1.97266 0.525356 0 2.85348 0 5.58395V5.81051C0 7.43161 0.671875 8.98239 1.85938 10.0879Z" fill="#EC4899"/>
</svg>

  )

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case "school-activity":
      return <BuildingIcon />;
    case "engagement":
      return <HeartIcon />;
    default:
      return null;
  }
};



export default function Notifications({
  data: initialData,
  onReviewSubmissionActivityChange,
  onFollowActivitySaved,
  onNavigateToManagePlan,
}: NotificationsProps) {
  const [data, setData] = useState<NotificationSettings>(initialData);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSeeAllNotifications = () => {
    setShowAllNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowAllNotifications(false);
  };

  const handleActionClick = (actionText: string | undefined) => {
    if (actionText?.toLowerCase().includes("renew")) {
      handleCloseNotifications();
      onNavigateToManagePlan?.();
    }
  };

  const setItemEnabled = (
    categoryId: string,
    itemId: string,
    enabled: boolean
  ) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, enabled } : item
              ),
            }
          : category
      ),
    }));
  };

  const handleToggle = async (categoryId: string, itemId: string) => {
    if (savingItemId) return;

    let currentEnabled: boolean | undefined;
    for (const c of data.categories) {
      if (c.id !== categoryId) continue;
      const item = c.items.find((i) => i.id === itemId);
      if (item) {
        currentEnabled = item.enabled;
        break;
      }
    }
    if (currentEnabled === undefined) return;

    const nextEnabled = !currentEnabled;

    if (itemId === NOTIFICATION_API_ITEM_IDS.followersUpdates) {
      setSavingItemId(itemId);
      setItemEnabled(categoryId, itemId, nextEnabled);
      try {
        const result = await updateReceiveFollowActivitySettingsApi(nextEnabled);
        onFollowActivitySaved(result.receiveFollowActivity);
        toast.success(result.message);
      } catch (err) {
        setItemEnabled(categoryId, itemId, currentEnabled);
        toast.error(
          err instanceof Error ? err.message : "Failed to update follow notifications."
        );
      } finally {
        setSavingItemId(null);
      }
      return;
    }

    if (itemId === NOTIFICATION_API_ITEM_IDS.newReview) {
      setSavingItemId(itemId);
      setItemEnabled(categoryId, itemId, nextEnabled);
      try {
        await onReviewSubmissionActivityChange(nextEnabled);
      } catch {
        setItemEnabled(categoryId, itemId, currentEnabled);
      } finally {
        setSavingItemId(null);
      }
      return;
    }

    setItemEnabled(categoryId, itemId, nextEnabled);
  };

  return (
    <>
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-custom-gray/95 mb-1">
          Notifications
        </h2>
        <Button
          onClick={handleSeeAllNotifications}
          variant="ghosted"
          textColor="text-custom-gray/80"
          hoverTextColor="hover:text-custom-teal"
          className="text-xs font-semibold md:text-sm p-0 h-auto"
        >
          See all notifications
        </Button>
      </div>

      <div className="space-y-6 md:space-y-8">
        {data.categories.map((category: NotificationCategory) => (
          <div key={category.id} className="space-y-4">
            {/* Section header: only for School Activity and Engagement (not System Alerts per Figma) */}
            {category.id !== "system-alerts" && (
              <div className="flex items-center gap-2">
                <div
                  className={`shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center ${
                    category.id === "school-activity"
                      ? "bg-custom-white"
                      : category.id === "engagement"
                        ? "bg-custom-white"
                        : "bg-custom-white"
                  }`}
                >
                  {getCategoryIcon(category.id)}
                </div>
                <h3 className="text-sm md:text-[20px] font-semibold text-custom-gray/95">
                  {category.title}
                </h3>
              </div>
            )}
            {/* Notification Items */}
            <div className="space-y-3">
              {category.items.map((item: NotificationItem) => (
                <div
                  key={item.id}
                  className="flex items-center  gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-custom-gray/10"
                >
                  {/* Icon with Background */}
                  <div
                    className={`shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${getItemIconBackground(
                      item.iconColor
                    )}`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={20}
                      height={20}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-bold text-custom-gray/95 mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-custom-gray/60 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <label
                    className={`relative inline-flex items-center shrink-0 ${
                      savingItemId === item.id
                        ? "cursor-wait opacity-70"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      disabled={savingItemId !== null}
                      onChange={() => {
                        void handleToggle(category.id, item.id);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-custom-gray/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-custom-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-custom-white peer-disabled:opacity-50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-custom-white after:border-custom-gray/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-teal"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* All Notifications Modal */}
      {showAllNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-custom-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-custom-gray/10">
              <h2 className="text-lg md:text-xl font-semibold text-custom-gray/95">
                All Notifications
              </h2>
              <Button
                onClick={handleCloseNotifications}
                variant="ghosted"
                rounded="lg"
                className="p-2 w-auto h-auto"
                aria-label="Close"
              >
                <X size={20} className="text-custom-gray/80" />
              </Button>
            </div>

            {/* Notifications List - scrollable with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 hide-scrollbar min-h-0">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-custom-gray/60">No notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-custom-gray/10 hover:bg-custom-gray/5 transition-colors"
                    >
                      <div
                        className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center p-2 ${
                          notification.type === "review"
                            ? "bg-custom-yellow/20"
                            : notification.type === "subscription"
                            ? "bg-custom-teal/20"
                            : "bg-custom-purple/20"
                        }`}
                      >
                        <Image
                          src={notification.image}
                          alt={notification.title}
                          width={24}
                          height={24}
                          className="w-5 h-5 md:w-6 md:h-6"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm md:text-base font-semibold text-custom-gray/95">
                            {notification.title}
                          </h3>
                          {notification.isNew && (
                            <span className="text-xs bg-custom-green text-custom-white px-2 py-0.5 rounded-full shrink-0">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-custom-gray/70 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-custom-gray/60">
                            {notification.time}
                          </p>
                          {notification.actionText && (
                            <Button
                              type="button"
                              variant="ghosted"
                              textColor="text-custom-teal"
                              hoverTextColor="hover:text-custom-teal/80"
                              className="text-xs md:text-sm font-semibold hover:underline p-0 h-auto"
                              onClick={() => handleActionClick(notification.actionText)}
                            >
                              {notification.actionText}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
