"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Calendar,
  GraduationCap,
  BookOpenText,
  CreditCard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({
    users: null as number | null,
    events: null as number | null,
    enrolled: null as number | null,
    blogs: null as number | null,
    payments: null as number | null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
    else if (session.user.role !== "admin") router.push("/user/dashboard");
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userRes,
          eventRes,
          enrolledRes,
          blogRes,
          paymentRes,
          chartRes,
        ] = await Promise.all([
          fetch("/api/users?count=true"),
          fetch("/api/events?count=true"),
          fetch("/api/events/enrolled?count=true"),
          fetch("/api/blogs?count=true"),
          fetch("/api/payment/total-spent?global=true"),
          fetch("/api/events/enrollment-stats"), // ✅ new endpoint
        ]);

        const [
          userData,
          eventData,
          enrolledData,
          blogData,
          paymentData,
          chartDataResponse,
        ] = await Promise.all([
          userRes.json(),
          eventRes.json(),
          enrolledRes.json(),
          blogRes.json(),
          paymentRes.json(),
          chartRes.json(),
        ]);

        setStats({
          users: userData?.count ?? 0,
          events: eventData?.count ?? 0,
          enrolled: enrolledData?.count ?? 0,
          blogs: blogData?.count ?? 0,
          payments: paymentData?.total_amount ?? 0,
        });

        if (chartDataResponse?.data) setChartData(chartDataResponse.data);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );

  if (session?.user?.role !== "admin") return null;

  const handleCardClick = (path: string) => router.push(path);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D7263D"];

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <nav className="text-sm text-gray-500">
          <a href="/admin/dashboard" className="hover:underline">Home</a> / <span>Dashboard</span>
        </nav>
      </div>

      {/* ✅ Dashboard Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
        <Card
          onClick={() => handleCardClick("/admin/users")}
          className="text-center shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
        >
          <CardContent className="p-6">
            <Users className="mx-auto text-blue-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-sm">Total Users</h3>
            <p className="text-3xl font-bold mt-1">{stats.users ?? "--"}</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleCardClick("/Admin-event-panel")}
          className="text-center shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
        >
          <CardContent className="p-6">
            <Calendar className="mx-auto text-green-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-sm">Total Events</h3>
            <p className="text-3xl font-bold mt-1 text-green-700">
              {stats.events ?? "--"}
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleCardClick("/Admin-enrolled-events")}
          className="text-center shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
        >
          <CardContent className="p-6">
            <GraduationCap className="mx-auto text-purple-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-sm">Enrolled</h3>
            <p className="text-3xl font-bold mt-1 text-purple-700">
              {stats.enrolled ?? "--"}
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleCardClick("/Admin-blog-panel")}
          className="text-center shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
        >
          <CardContent className="p-6">
            <BookOpenText className="mx-auto text-orange-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-sm">Total Blogs</h3>
            <p className="text-3xl font-bold mt-1 text-orange-700">
              {stats.blogs ?? "--"}
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleCardClick("/Admin-payment-history")}
          className="text-center shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
        >
          <CardContent className="p-6">
            <CreditCard className="mx-auto text-pink-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-sm">Total Revenue</h3>
            <p className="text-3xl font-bold mt-1 text-pink-700">
              ₹{stats.payments?.toLocaleString("en-IN") ?? "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Pie Chart Section */}
      <Card className="mt-10 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Users Registered per Event
          </h3>
          {chartData.length === 0 ? (
            <p className="text-gray-500 text-center">
              No enrollment data available
            </p>
          ) : (
            <div className="w-full h-[400px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
