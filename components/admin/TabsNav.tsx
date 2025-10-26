"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const TabsNav = () => {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Automatically updates on route change

  const tabs = [
    { name: "Add Event", path: "/Admin-event-panel/add-event" },
    { name: "Magazine", path: "/Admin-event-panel/magazine" },
    { name: "Questions", path: "/Admin-event-panel/questions" },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <button
            key={tab.name}
            onClick={() => router.push(tab.path)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "border-[#019c9d] text-[#019c9d] bg-[#019c9d]/10"
                : "border-transparent text-gray-500 hover:text-[#019c9d] hover:bg-[#019c9d]/5"
            }`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNav;
