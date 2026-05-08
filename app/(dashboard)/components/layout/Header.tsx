"use client";
import Image from "next/image";
import { X, Menu } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import useOutsideClick from "@/app/utils/UseOutsideClick";
import { useAppSelector } from "@/redux";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ManagePlanModal from "@/app/(dashboard)/settings/components/ManagePlanModal";
import {
  fetchHeaderNotificationsApi,
  fetchSchoolActivitiesUnreadCountApi,
  mapSchoolActivityToHeaderItem,
  markSchoolActivityAsReadApi,
  type HeaderNotificationItem,
} from "@/lib/api/notifications.api";



export const BellIcon = () => (
  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.4928 11.2436H14.992V12.7428H0V11.2436H1.4992V5.99641C1.4992 4.90699 1.77405 3.89752 2.32376 2.96802C2.85348 2.0685 3.5681 1.35388 4.46762 0.824163C5.39712 0.274456 6.40658 -0.000397682 7.496 -0.000397682C8.58542 -0.000397682 9.59488 0.274456 10.5244 0.824163C11.4239 1.35388 12.1385 2.0685 12.6682 2.96802C13.218 3.89752 13.4928 4.90699 13.4928 5.99641V11.2436ZM11.9936 11.2436V5.99641C11.9936 5.18684 11.7887 4.43224 11.3789 3.73261C10.9791 3.05297 10.4394 2.51326 9.7598 2.11348C9.06017 1.70369 8.30557 1.4988 7.496 1.4988C6.68644 1.4988 5.93184 1.70369 5.23221 2.11348C4.55257 2.51326 4.01286 3.05297 3.61307 3.73261C3.20329 4.43224 2.9984 5.18684 2.9984 5.99641V11.2436H11.9936ZM5.2472 14.242H9.74481V15.7412H5.2472V14.242Z" fill="#4B5563"/>
</svg>

)


export const Logo = () => (
  <svg width="124" height="42" viewBox="0 0 124 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.6932 11.3636C17.5483 9.90625 16.9048 8.74716 15.7628 7.88636C14.6207 7.02557 13.1847 6.59517 11.4545 6.59517C10.2358 6.59517 9.16193 6.80398 8.23295 7.22159C7.3125 7.6392 6.58807 8.21875 6.05966 8.96023C5.53977 9.69318 5.27983 10.5284 5.27983 11.4659C5.27983 12.1562 5.42898 12.7614 5.72727 13.2812C6.02557 13.8011 6.42614 14.2486 6.92898 14.6236C7.44034 14.9901 8.00284 15.3054 8.61648 15.5696C9.23864 15.8338 9.86506 16.0554 10.4957 16.2344L13.2571 17.027C14.0923 17.2571 14.9276 17.5511 15.7628 17.9091C16.598 18.267 17.3608 18.7187 18.0511 19.2642C18.75 19.8011 19.3082 20.4616 19.7259 21.2457C20.152 22.0213 20.3651 22.9545 20.3651 24.0455C20.3651 25.4432 20.0028 26.7003 19.2784 27.8168C18.554 28.9332 17.5142 29.8196 16.1591 30.4759C14.804 31.1236 13.1804 31.4474 11.2884 31.4474C9.5071 31.4474 7.96023 31.1534 6.64773 30.5653C5.33523 29.9687 4.30398 29.1463 3.55398 28.098C2.80398 27.0497 2.3821 25.8352 2.28835 24.4545H4.7429C4.82812 25.4858 5.16903 26.3594 5.76562 27.0753C6.36222 27.7912 7.13778 28.3366 8.09233 28.7116C9.04688 29.0781 10.1122 29.2614 11.2884 29.2614C12.5923 29.2614 13.7514 29.044 14.7656 28.6094C15.7884 28.1662 16.5895 27.5526 17.169 26.7685C17.7571 25.9759 18.0511 25.0554 18.0511 24.0071C18.0511 23.1207 17.821 22.3793 17.3608 21.7827C16.9006 21.1776 16.2571 20.6705 15.4304 20.2614C14.6122 19.8523 13.6619 19.4901 12.5795 19.1747L9.44744 18.2543C7.39347 17.6406 5.79972 16.7926 4.66619 15.7102C3.53267 14.6278 2.96591 13.2472 2.96591 11.5682C2.96591 10.1619 3.34091 8.92614 4.09091 7.8608C4.84943 6.78693 5.87216 5.9517 7.15909 5.35511C8.45455 4.75 9.90767 4.44744 11.5185 4.44744C13.1463 4.44744 14.5866 4.74574 15.8395 5.34233C17.0923 5.93892 18.0852 6.76136 18.8182 7.80966C19.5597 8.84943 19.956 10.0341 20.0071 11.3636H17.6932ZM33.3153 31.4091C31.5597 31.4091 30.0298 30.9702 28.7259 30.0923C27.4304 29.2145 26.4247 28.0128 25.7088 26.4872C24.9929 24.9616 24.6349 23.223 24.6349 21.2713C24.6349 19.3026 24.9972 17.5511 25.7216 16.017C26.4545 14.483 27.4688 13.2812 28.7642 12.4119C30.0597 11.5341 31.5639 11.0952 33.277 11.0952C34.5895 11.0952 35.7784 11.3509 36.8438 11.8622C37.9091 12.3651 38.7869 13.0767 39.4773 13.9972C40.1761 14.9091 40.6151 15.9744 40.794 17.1932H38.4929C38.2543 16.0852 37.679 15.1392 36.767 14.3551C35.8636 13.5625 34.7131 13.1662 33.3153 13.1662C32.0625 13.1662 30.9545 13.5071 29.9915 14.1889C29.0284 14.8622 28.2741 15.804 27.7287 17.0142C27.1918 18.2159 26.9233 19.6094 26.9233 21.1946C26.9233 22.7884 27.1875 24.1989 27.7159 25.4261C28.2443 26.6449 28.9858 27.5994 29.9403 28.2898C30.9034 28.9801 32.0284 29.3253 33.3153 29.3253C34.1847 29.3253 34.9773 29.1634 35.6932 28.8395C36.4176 28.5071 37.0227 28.0384 37.5085 27.4332C38.0028 26.8281 38.3352 26.108 38.5057 25.2727H40.8068C40.6364 26.4574 40.2145 27.5142 39.5412 28.4432C38.8764 29.3636 38.0114 30.0881 36.946 30.6165C35.8892 31.1449 34.679 31.4091 33.3153 31.4091ZM53.3161 31.4091C51.62 31.4091 50.12 30.9787 48.8161 30.1179C47.5206 29.2571 46.5064 28.0682 45.7734 26.5511C45.0405 25.0256 44.674 23.2656 44.674 21.2713C44.674 19.2599 45.0405 17.4915 45.7734 15.9659C46.5064 14.4318 47.5206 13.2386 48.8161 12.3864C50.12 11.5256 51.62 11.0952 53.3161 11.0952C55.0121 11.0952 56.5078 11.5256 57.8033 12.3864C59.0987 13.2472 60.1129 14.4403 60.8459 15.9659C61.5874 17.4915 61.9581 19.2599 61.9581 21.2713C61.9581 23.2656 61.5916 25.0256 60.8587 26.5511C60.1257 28.0682 59.1072 29.2571 57.8033 30.1179C56.5078 30.9787 55.0121 31.4091 53.3161 31.4091ZM53.3161 29.3253C54.6797 29.3253 55.8345 28.9588 56.7805 28.2259C57.7266 27.4929 58.4425 26.517 58.9283 25.2983C59.4226 24.0795 59.6697 22.7372 59.6697 21.2713C59.6697 19.8054 59.4226 18.4588 58.9283 17.2315C58.4425 16.0043 57.7266 15.0199 56.7805 14.2784C55.8345 13.5369 54.6797 13.1662 53.3161 13.1662C51.9609 13.1662 50.8061 13.5369 49.8516 14.2784C48.9055 15.0199 48.1854 16.0043 47.6911 17.2315C47.2053 18.4588 46.9624 19.8054 46.9624 21.2713C46.9624 22.7372 47.2053 24.0795 47.6911 25.2983C48.1854 26.517 48.9055 27.4929 49.8516 28.2259C50.7976 28.9588 51.9524 29.3253 53.3161 29.3253ZM74.5856 31.4091C72.8896 31.4091 71.3896 30.9787 70.0856 30.1179C68.7901 29.2571 67.7759 28.0682 67.043 26.5511C66.31 25.0256 65.9435 23.2656 65.9435 21.2713C65.9435 19.2599 66.31 17.4915 67.043 15.9659C67.7759 14.4318 68.7901 13.2386 70.0856 12.3864C71.3896 11.5256 72.8896 11.0952 74.5856 11.0952C76.2816 11.0952 77.7773 11.5256 79.0728 12.3864C80.3683 13.2472 81.3825 14.4403 82.1154 15.9659C82.8569 17.4915 83.2276 19.2599 83.2276 21.2713C83.2276 23.2656 82.8612 25.0256 82.1282 26.5511C81.3952 28.0682 80.3768 29.2571 79.0728 30.1179C77.7773 30.9787 76.2816 31.4091 74.5856 31.4091ZM74.5856 29.3253C75.9492 29.3253 77.104 28.9588 78.0501 28.2259C78.9961 27.4929 79.712 26.517 80.1978 25.2983C80.6921 24.0795 80.9393 22.7372 80.9393 21.2713C80.9393 19.8054 80.6921 18.4588 80.1978 17.2315C79.712 16.0043 78.9961 15.0199 78.0501 14.2784C77.104 13.5369 75.9492 13.1662 74.5856 13.1662C73.2305 13.1662 72.0756 13.5369 71.1211 14.2784C70.1751 15.0199 69.4549 16.0043 68.9606 17.2315C68.4748 18.4588 68.2319 19.8054 68.2319 21.2713C68.2319 22.7372 68.4748 24.0795 68.9606 25.2983C69.4549 26.517 70.1751 27.4929 71.1211 28.2259C72.0671 28.9588 73.2219 29.3253 74.5856 29.3253ZM102.72 11.3636L95.5483 31H93.1193L85.9474 11.3636H88.4148L94.2443 27.9957H94.4233L100.253 11.3636H102.72ZM112.059 31.4474C110.874 31.4474 109.792 31.2173 108.812 30.7571C107.832 30.2884 107.052 29.6151 106.472 28.7372C105.893 27.8509 105.603 26.777 105.603 25.5156C105.603 24.544 105.786 23.7259 106.153 23.0611C106.519 22.3963 107.039 21.8509 107.712 21.4247C108.386 20.9986 109.183 20.6619 110.103 20.4148C111.023 20.1676 112.038 19.9759 113.146 19.8395C114.245 19.7031 115.174 19.5838 115.933 19.4815C116.7 19.3793 117.283 19.2173 117.684 18.9957C118.085 18.7741 118.285 18.4162 118.285 17.9219V17.4616C118.285 16.1236 117.884 15.071 117.083 14.304C116.29 13.5284 115.148 13.1406 113.657 13.1406C112.242 13.1406 111.087 13.4517 110.192 14.0739C109.306 14.696 108.684 15.429 108.326 16.2727L106.165 15.4929C106.609 14.419 107.222 13.5625 108.006 12.9233C108.79 12.2756 109.668 11.8111 110.64 11.5298C111.612 11.2401 112.596 11.0952 113.593 11.0952C114.343 11.0952 115.123 11.1932 115.933 11.3892C116.751 11.5852 117.509 11.9261 118.208 12.4119C118.907 12.8892 119.474 13.5582 119.908 14.419C120.343 15.2713 120.56 16.3537 120.56 17.6662V31H118.285V27.8935H118.144C117.871 28.473 117.467 29.0355 116.93 29.581C116.393 30.1264 115.719 30.5739 114.91 30.9233C114.1 31.2727 113.15 31.4474 112.059 31.4474ZM112.366 29.3636C113.576 29.3636 114.624 29.0952 115.511 28.5582C116.397 28.0213 117.079 27.3097 117.556 26.4233C118.042 25.5284 118.285 24.544 118.285 23.4702V20.6321C118.114 20.794 117.829 20.9389 117.428 21.0668C117.036 21.1946 116.58 21.3097 116.06 21.4119C115.549 21.5057 115.038 21.5866 114.526 21.6548C114.015 21.723 113.555 21.7827 113.146 21.8338C112.038 21.9702 111.092 22.1832 110.308 22.473C109.523 22.7628 108.923 23.1634 108.505 23.6747C108.087 24.1776 107.879 24.8253 107.879 25.6179C107.879 26.8111 108.305 27.7358 109.157 28.392C110.009 29.0398 111.079 29.3636 112.366 29.3636Z" fill="#4A4A4A"/>
<circle cx="95.2609" cy="38.2609" r="3.26087" fill="#00C5E8"/>
<circle cx="103.087" cy="38.2609" r="3.26087" fill="#FFDE59"/>
<circle cx="110.913" cy="38.2609" r="3.26087" fill="#E88AED"/>
<circle cx="118.739" cy="38.2609" r="3.26087" fill="#44CF7C"/>
</svg>

)

const planDetailsForRenew = {
  planName: "Premium School Plan",
  description: "Complete school management platform",
  price: 29.99,
  priceUnit: "/month",
  toolkitFeatures: [
    "Update general information",
    "Create image gallery",
    "Reply to reviews",
    "Manage senior leadership",
    "Access Pulse Survey Tool",
    "Recruitment platform (job postings & applications)",
    "System Support + Notifications",
  ],
};

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export default function Header({ onToggleMobileSidebar }: HeaderProps) {
  const user = useAppSelector((state) => state.auth?.user ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [isManagePlanModalOpen, setIsManagePlanModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasHydratedNotifications, setHasHydratedNotifications] = useState(false);




  const notificationRef = useRef<HTMLDivElement>(null);
  const markingActivityReadRef = useRef<Set<string>>(new Set());
  const unreadCountRequestRef = useRef<Promise<void> | null>(null);
  const notificationsRequestRef = useRef<Promise<void> | null>(null);
  const refreshAllRequestRef = useRef<Promise<void> | null>(null);

  const loadUnreadCount = useCallback(async () => {
    if (unreadCountRequestRef.current) return unreadCountRequestRef.current;

    unreadCountRequestRef.current = (async () => {
      try {
        const n = await fetchSchoolActivitiesUnreadCountApi();
        setUnreadCount(n);
      } catch {
        setUnreadCount(0);
      } finally {
        unreadCountRequestRef.current = null;
      }
    })();

    return unreadCountRequestRef.current;
  }, []);

  const loadNotifications = useCallback(async () => {
    if (notificationsRequestRef.current) return notificationsRequestRef.current;

    notificationsRequestRef.current = (async () => {
      setNotificationsLoading(true);
      setNotificationsError(null);
      try {
        const list = await fetchHeaderNotificationsApi();
        setNotifications(list);
        setHasHydratedNotifications(true);
        const localUnread = list.filter((item) => item.isNew).length;
        if (localUnread === 0) {
          setUnreadCount(0);
        }
      } catch (e) {
        setNotifications([]);
        setNotificationsError(e instanceof Error ? e.message : "Failed to load notifications");
        setHasHydratedNotifications(false);
      } finally {
        setNotificationsLoading(false);
        notificationsRequestRef.current = null;
      }
    })();

    return notificationsRequestRef.current;
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (refreshAllRequestRef.current) return refreshAllRequestRef.current;

    refreshAllRequestRef.current = Promise.all([
      loadUnreadCount(),
      loadNotifications(),
    ])
      .then(() => undefined)
      .finally(() => {
        refreshAllRequestRef.current = null;
      });

    return refreshAllRequestRef.current;
  }, [loadNotifications, loadUnreadCount]);

  const localUnreadCount = notifications.filter((item) => item.isNew).length;
  const effectiveUnreadCount = hasHydratedNotifications && localUnreadCount === 0 ? 0 : unreadCount;

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  // Close dropdown when clicking outside
  useOutsideClick(notificationRef, () => setIsOpen(false));

  // Bell click: toggle dropdown and fetch latest on open
  const handleBellClick = () => {
    setIsOpen((prev) => {
      const opening = !prev;
      if (opening) {
        void refreshNotifications();
      }
      return opening;
    });
  };

  // Badge click: show dropdown and fetch latest
  const handleBadgeClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsOpen(true);
    void refreshNotifications();
  };

  const handleNotificationActivate = useCallback(
    async (notification: HeaderNotificationItem) => {
      if (!notification.isNew) return;
      const { id } = notification;
      if (markingActivityReadRef.current.has(id)) return;
      markingActivityReadRef.current.add(id);
      try {
        const updated = await markSchoolActivityAsReadApi(id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? mapSchoolActivityToHeaderItem(updated) : item))
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
        await loadUnreadCount();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not mark as read");
      } finally {
        markingActivityReadRef.current.delete(id);
      }
    },
    [loadUnreadCount]
  );

  return (
    <div className="h-16 flex items-center border-b border-custom-gray/10 bg-custom-white">
      <div className="w-[96%] flex items-center justify-between mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onToggleMobileSidebar}
            variant="ghosted"
            rounded="lg"
            hoverBgColor="hover:bg-custom-gray/10"
            className="md:hidden p-2 w-auto h-auto"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-custom-gray" />
          </Button>
          <div className="relative flex items-center w-18 h-8 md:w-30 md:h-8 lg:w-30 lg:h-8">
            <Logo/>
          </div>
        </div>

        {/* Right section */}
        <div ref={notificationRef} className="flex items-center gap-3">
          <div className="relative cursor-pointer w-5 h-5 flex items-center justify-center" onClick={handleBellClick}>
            <BellIcon />
            {hasHydratedNotifications && !notificationsError && effectiveUnreadCount > 0 && (
              <span
                onClick={handleBadgeClick}
                className="min-w-4 h-4 px-0.5 flex justify-center -top-2 -right-2 items-center absolute bg-red-500 text-[10px] leading-none rounded-full text-custom-white"
              >
                {effectiveUnreadCount > 99 ? "99+" : effectiveUnreadCount}
              </span>
            )}
          </div>

          {isOpen && (
            <div
              
              className="shadow md:w-[50%] z-50 p-2 w-[92%] bg-custom-white rounded-lg absolute right-4 md:right-20 top-16.5"
            >
              <div className="text-[20px] font-semibold text-center relative">
                Notifications
                <X
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 cursor-pointer"
                />
              </div>

              <ul className="mt-3 max-h-60 overflow-y-auto hide-scrollbar">
                {notificationsLoading && (
                  <li className="px-4 py-3 space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <Skeleton className="w-[35px] h-[35px] rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-40 rounded-md" />
                          <Skeleton className="h-3 w-56 rounded-md" />
                          <Skeleton className="h-3 w-16 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </li>
                )}
                {!notificationsLoading && notificationsError && (
                  <li className="px-4 py-4 text-center text-sm text-red-600">{notificationsError}</li>
                )}
                {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-custom-gray/60">No notifications yet</li>
                )}
                {!notificationsLoading &&
                  !notificationsError &&
                  (showAllNotifications ? notifications : notifications.slice(0, 3)).map((notification) => (
                    <li
                      key={notification.id}
                      className={`mb-4 rounded-lg py-1 ${
                        notification.isNew
                          ? "cursor-pointer hover:bg-custom-gray/10 focus-within:bg-custom-gray/10"
                          : "hover:bg-custom-gray/10"
                      }`}
                    >
                      <div
                        className="px-4 flex gap-3 items-start"
                        role={notification.isNew ? "button" : undefined}
                        tabIndex={notification.isNew ? 0 : undefined}
                        onClick={() => void handleNotificationActivate(notification)}
                        onKeyDown={(e) => {
                          if (!notification.isNew) return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            void handleNotificationActivate(notification);
                          }
                        }}
                      >
                        <div
                          className={`w-[35px] h-[35px] shrink-0 rounded-full flex items-center justify-center ${
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
                            width={18}
                            height={18}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 w-full">
                            <h3 className="font-semibold text-[16px] min-w-0 break-words">{notification.title}</h3>
                            {notification.isNew && (
                              <span className="text-xs bg-custom-green text-custom-white px-2 rounded-full shrink-0 ml-auto">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-custom-gray/70 break-words">{notification.message}</p>
                          <p className="text-xs text-custom-gray/60 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>

              {!notificationsLoading && !notificationsError && notifications.length > 3 && (
                <div className="mt-2 pt-2 border-t border-custom-gray/10">
                  <Button
                    type="button"
                    variant="ghosted"
                    rounded="md"
                    bgColor="bg-transparent"
                    textColor="text-custom-teal"
                    hoverBgColor="hover:!bg-transparent hover:underline"
                    onClick={() => setShowAllNotifications((prev) => !prev)}
                    className="w-full text-center text-sm font-semibold !py-1 !px-0"
                  >
                    {showAllNotifications ? "Show less" : "See all notifications"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Profile – uses logged-in user from Redux, or local upload, or fallback */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#D1D5DB] shrink-0">
              <Image
                src={user?.profileImage || "/images/sara.png"}
                alt={user?.name ?? "Profile"}
                width={50}
                height={50}
                className="object-cover rounded-full w-full h-full bg-[#D1D5DB]"
                unoptimized={(user?.profileImage || "").startsWith("http")}
              />
            </div>
            <p className="text-sm font-medium text-[#374151] truncate max-w-[120px] md:max-w-[180px]">
              {user?.name ?? "User"}
            </p>
          </div>
        </div>
      </div>

      <ManagePlanModal
        isOpen={isManagePlanModalOpen}
        onClose={() => setIsManagePlanModalOpen(false)}
        planDetails={planDetailsForRenew}
      />
    </div>
  );
}
