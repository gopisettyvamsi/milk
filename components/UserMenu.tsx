"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserTabs() {
  const { data: session } = useSession();
  const role = session?.user?.role || "guest";
  const pathname = usePathname();
  const [greeting, setGreeting] = useState("Welcome");
  const [userName, setUserName] = useState("User");

  // ✅ Fetch user details (firstname, lastname)
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) return;

        // Matches your backend route: /api/userdetails?user_id=...
        const res = await fetch(`/api/userdetails?user_id=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user details");

        const data = await res.json();

        if (data.firstname || data.lastname) {
          const fullName = [data.firstname, data.lastname].filter(Boolean).join(" ");
          const prefix =   data.prefix? data.prefix === "Other"? data.other_prefix || "": data.prefix: "Dr.";
        setUserName(`${toTitleCase(prefix)} ${toTitleCase(fullName)}`.trim());
        } else {
          setUserName(session?.user?.email?.split("@")[0] || "User");
        }
      } catch (err) {
        console.error("Error loading user name:", err);
        setUserName(session?.user?.email?.split("@")[0] || "User");
      }
    };

    fetchUserName();
  }, [session]);

  // ✅ Greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 16) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (role !== "user") return null;

  const tabs = [
    { key: "dashboard", label: "Dashboard", href: "/user/dashboard" },
    { key: "enrolled-events", label: "Enrolled Events", href: "/user/enrolled-events" },
    { key: "payment-history", label: "Payment History", href: "/user/payment-history" },
    { key: "profile", label: "My Profile", href: "/user/profile" },
    { key: "account", label: "My Account", href: "/user/account" },
  ];
  // 🔤 Helper: Capitalize first letter of each word, rest lowercase
const toTitleCase = (str: string) =>
  str
    ?.toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();


  return (
    <div className="bg-gradient-to-b from-[#f0f4ff] to-[#ffffff] flex flex-col">
      {/* Header */}
      <div className="bg-black text-center py-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide">
          {greeting}, {userName}
        </h1>
      </div>

      {/* Responsive Tabs Nav */}
      <div className="bg-[#121216] text-white shadow-md overflow-x-auto">
        <div className="flex justify-start md:justify-center space-x-4 sm:space-x-6 px-4 min-w-max">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm sm:text-base transition-colors ${
                pathname === tab.href
                  ? "text-white border-b-4 border-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
