"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/lib/route-protection";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import MobileSidebar from "./components/layout/MobileSidebar";
import "react-datepicker/dist/react-datepicker.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 shrink-0">
        <Header
          onToggleMobileSidebar={() =>
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
          }
        />
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-custom-white hidden md:block border-r border-custom-gray/20
            transition-all duration-300
            ${isExpanded ? "w-64" : "w-18 px-3"}
            overflow-auto
          `}
        >
          {/* Sidebar scrolls independently */}
          <div className="h-full">
            <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-[#F9FAFB]  overflow-auto">
          {/* Main content scrolls independently */}
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
