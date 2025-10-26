"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AyurvedaTabs() 
{
    const tabs = [
        { key: "courses", label: "Dashboard" },
        { key: "lists", label: "Enrolled Events" },
        { key: "wishlist", label: "Payment History" },
        { key: "archived", label: "My Profile" },
    ];

    const [activeTab, setActiveTab] = useState("courses");
    const { data: session } = useSession();
    const getUserDisplayName = () => {
            if (!session?.user) {
              return null; 
            }
            const user = session.user;
            const displayName = user.name || user.email?.split("@")[0] || "User";
            return user.name ? `Dr. ${displayName}` : displayName;
    };

  const userName = getUserDisplayName();
    const role = session?.user?.role || "guest";

  // Show only for role "user"
  if (role !== "user") return null;

    return (
      
        <div className="bg-[#121216] text-white">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-black p-4">
                Welcome,  {userName}!
            </h1>
            {/* Tab Header */}
            <div className="flex border-b border-gray-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === tab.key
                                ? "text-white font-semibold border-b-4 border-white"
                                : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white text-black">
                {activeTab === "courses" && (
                    <p>📚 Browse all Ayurveda courses and programs.</p>
                )}
                {activeTab === "lists" && (
                    <p>📝 Your saved lists of preferred courses and therapies.</p>
                )}
                {activeTab === "wishlist" && (
                    <p>💖 The courses and treatments you’ve wishlisted.</p>
                )}
                {activeTab === "archived" && (
                    <p>📦 Archived sessions and past enrollments.</p>
                )}
                {/* {activeTab === "tools" && (
          <p>🛠 Explore Ayurveda learning tools and resources.</p>
        )} */}
            </div>
        </div>
    );
}
