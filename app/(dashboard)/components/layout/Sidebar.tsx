"use client";

import { useState } from "react";
import Image from "next/image";
import { sidebarData } from "../../data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux";
import { logout } from "@/redux/slices/auth.slice";
import { logoutApi } from "@/lib/api/auth.api";
import { Logo } from "./Header";

export default function Sidebar({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
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

  return (
    <div className="h-full flex flex-col transition-all duration-300 relative ">
      {/* Logo + Toggle */}
      <div className={`relative ${isExpanded ? "py-6" : "py-4"}`}>
        {isExpanded ? (
          <>
          <div className="flex justify-center">

            <Logo/>
          </div>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghosted"
              textColor="text-custom-gray"
              hoverBgColor="hover:opacity-70"
              className="absolute top-2 right-1 p-0 w-auto h-auto"
            >
              <PanelLeftOpen size={20} />
            </Button>
          </>
        ) : (
          <div className="flex justify-center">
            <Button
              onClick={() => setIsExpanded(true)}
              variant="filled"
              rounded="lg"
              bgColor="bg-custom-teal"
              hoverBgColor="hover:opacity-90"
              textColor="text-custom-white"
              className="px-1 w-12 flex justify-center  items-center"
            >
              <PanelLeftClose size={30} className="text-custom-white" />
            </Button>
          </div>
        )}
      </div>

      {/* Scrollable Menu */}
      <div
        className={`flex-1 hide-scrollbar overflow-y-auto ${isExpanded ? "px-2" : "px-1"}`}
      >
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
              }}
              className="cursor-pointer group block"
            >
              <div
                className={`rounded-lg transition-colors cursor-pointer
                  ${
                    isExpanded
                      ? "px-2 py-4 mt-4 mx-2 flex items-center gap-3"
                      : "w-full py-2.5 my-3 flex justify-center items-center"
                  } 
                  ${
                    isExpanded
                      ? isActive
                        ? "bg-custom-teal text-custom-white"
                        : "bg-custom-white hover:bg-custom-teal hover:text-custom-white"
                      : isActive
                        ? "bg-custom-teal"
                        : "bg-transparent hover:bg-custom-teal"
                  }
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
                      : isExpanded
                        ? "group-hover:brightness-0 group-hover:invert transition-all"
                        : "opacity-50 grayscale group-hover:brightness-0 group-hover:invert group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                  }
                />
                {isExpanded && <span className="text-sm">{item.title}</span>}
              </div>
            </Link>
          );
        })}

      <div
        className={`${isExpanded ? "p-4" : "pb-4 pt-2 flex justify-center"}`}
      >
        {isExpanded ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-md transition-all duration-300 bg-custom-teal text-custom-white hover:bg-custom-green disabled:opacity-70"
          >
            <LogOut size={18} className="shrink-0" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Logout"
            className="w-full flex justify-center items-center py-2.5 min-h-[44px] px-4 font-medium rounded-lg transition-all duration-300 bg-transparent text-custom-gray/60 hover:bg-custom-teal hover:text-custom-white group disabled:opacity-70"
          >
            <LogOut
              size={22}
              className="text-custom-gray/60 group-hover:text-custom-white transition-colors shrink-0"
            />
          </button>
        )}
      </div>
      </div>

      {/* Logout fixed at bottom */}
 
    </div>
  );
}
