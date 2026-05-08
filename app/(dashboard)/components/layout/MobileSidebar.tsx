"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { sidebarData } from "../../data";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { X, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux";
import { logout } from "@/redux/slices/auth.slice";
import { logoutApi } from "@/lib/api/auth.api";
import { Logo } from "./Header";
import Link from "next/link";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    onClose();
    try {
      const result = await logoutApi();
      toast.success(result.message ?? "Logged out successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to logout";
      toast.error(message, { style: { background: "#ef4444", color: "#fff" } });
    } finally {
      dispatch(logout());
      router.push("/login");
      setIsLoggingOut(false);
    }
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-custom-white z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col shadow-2xl`}
      >
        {/* Header with Logo and Close Button */}
        <div className="relative py-6 px-4 border-b border-custom-gray/10">
          <div className="flex items-center justify-between">
            {/* <Image
              src="/images/Logo.png"
              alt="Scoova Logo"
              width={100}
              height={40}
              className="brightness-0 invert"
            /> */}
            <Logo/>
            <Button
              onClick={onClose}
              variant="ghosted"
              rounded="lg"
              hoverBgColor="hover:bg-custom-gray/10"
              className="p-2 w-auto h-auto"
              aria-label="Close sidebar"
            >
              <X size={24} className="text-custom-gray" />
            </Button>
          </div>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 hide-scrollbar overflow-y-auto px-2">
          {sidebarData.map((item) => {
            const href = item.slug === "/" ? "/" : `/${item.slug}`;
            const isActive =
              (item.slug === "/" && pathname === "/") ||
              (item.slug !== "/" && pathname.startsWith(`/${item.slug}`));

            return (
              <Link
                key={item.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(href);
                  onClose();
                }}
                className="cursor-pointer group block outline-none focus-visible:ring-2 focus-visible:ring-custom-teal focus-visible:ring-offset-2 focus-visible:ring-offset-custom-white rounded-lg"
              >
                <div
                  className={`rounded-lg transition-colors cursor-pointer px-2 py-4 mt-4 mx-2 flex items-center gap-3
                    ${isActive ? "bg-custom-teal text-custom-white" : "bg-custom-white hover:bg-custom-teal hover:text-custom-white"}
                  `}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={18}
                    height={18}
                    className={
                      isActive
                        ? "brightness-0 invert"
                        : "group-hover:brightness-0 group-hover:invert transition-all"
                    }
                  />
                  <span className="text-sm">{item.title}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Logout fixed at bottom */}
        <div className="p-4 border-t border-custom-gray/10">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-md transition-all duration-300 bg-custom-teal text-custom-white hover:bg-custom-green disabled:opacity-70"
          >
            <LogOut size={18} className="shrink-0" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}

