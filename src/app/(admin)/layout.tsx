"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <AuthGuard>
      <div className="min-h-screen xl:flex ">
        <div className="z-49">
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
        </div>
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}>
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="relative  w-full min-h-[calc(100vh-140px)] max-w-(--breakpoint-2xl)  mx-auto p-4  md:p-6  ">
            {children}

            <div className=" w-64  h-40 md:w-80  md:h-56   absolute -z-10 bottom-0 left-0 transform -translate-x-1/2  bg-amber-300 rounded-full blur-[280px]" />
            <div className="w-64  h-40 md:w-80  md:h-56  absolute -z-10 top-40 right-0 bg-amber-300 rounded-full blur-[280px]" />
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
