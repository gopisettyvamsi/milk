"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserLayout from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, User } from "lucide-react";
import Link from "next/link";
import EventCard from "@/components/Card"
import ProfileUpdateToast from "@/components/profiletoaster"; 
import { Toaster } from "react-hot-toast";
import ProfilePopup from "@/components/ProfilePopup";
interface PaymentRecord {
  payment_id: number;
  user_id: number;
  event_id: number;
  order_id: string;
  transaction_id: string;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  amount: number;
  created_date: string;
  event_title: string;
  user_name: string;
  user_email: string;
}
interface User_Joined {
  id: number;
  created_at: string;
}

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dummyData, setDummyData] = useState<any>(null);
  const [successfulEventsCount, setSuccessfulEventsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolledEvents, setEnrolledEvents] = useState<any>([]);
  const [paymentData, setPaymentData] = useState<PaymentRecord[]>([]);
  const loggedInEmail = session?.user?.email || "";
  const [joinedYear, setJoinedYear] = useState<string>("");

  useEffect(() => {
    const fetchJoinedYear = async () => {
      try {
        const res = await fetch("/api/user/joined-year");
        if (!res.ok) throw new Error("Failed to fetch joined year");
        const data: User_Joined = await res.json();

        // Extract year from created_at
        const year = new Date(data.created_at).getFullYear().toString();
        setJoinedYear(year);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJoinedYear();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!loggedInEmail) return;
      const response = await fetch('/api/payments');
      const data = await response.json();

      // Filter only records matching the logged-in user's email
      const filtered = data.filter(
        (payment: PaymentRecord) => payment.user_email === loggedInEmail
      );

      setPaymentData(filtered);

    };
    fetchPayments();
  }, [loggedInEmail]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
    else if (session.user.role !== "user") router.push("/admin/dashboard");


    const fetchEnrolledEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/enrolled`);
        if (!res.ok) throw new Error("Failed to fetch enrolled events");
        const data = await res.json();
        setEnrolledEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledEvents();



    // Fetch the total number of successful events
    const fetchSuccessfulEventsCount = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/payment/successful-events`);
        if (!res.ok) throw new Error("Failed to fetch successful events count");
        const data = await res.json();
        setSuccessfulEventsCount(data.successfulEvents.length || 0); // Update the state with the count
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessfulEventsCount();
  }, [session, status, router]);

  const [totalSpent, setTotalSpent] = useState<number>(0);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
    else if (session.user.role !== "user") router.push("/admin/dashboard");

    // Fetch the total spent amount
    const fetchTotalSpent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/payment/total-spent`);
        if (!res.ok) throw new Error("Failed to fetch total spent");
        const data = await res.json();
        setTotalSpent(data.totalSpent || 0); // Update the state with the total spent
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalSpent();
  }, [session, status, router]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
    else if (session.user.role !== "user") router.push("/admin/dashboard");
    setDummyData({
      profile: {
        name: session?.user?.name || "User",
        email: session?.user?.email,
      },
    });
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role === "user") {
    return (
      <UserLayout>
        <Toaster position="top-right" /> {/* <- This renders the toasts */}
        <ProfileUpdateToast profile={session?.user?.profile} />
          <ProfilePopup/>  
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
          <div className="container mx-auto px-2 sm:px-4 py-8">

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Enrolled Events</p>
                    <p className="text-3xl font-bold text-blue-600">{loading ? "Loading..." : successfulEventsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Spent</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{loading ? "Loading..." : totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Member Since</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {joinedYear || "----"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

            </div>

            {/* Main Dashboard Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Enrolled Events Card */}
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold">Enrolled Events</span>
                      <p className="text-blue-100 text-sm font-normal">Your upcoming activities</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {enrolledEvents?.length > 0 ? (
                    <div className="space-y-4">
                      {/* Limit to 4 events */}
                      {enrolledEvents.slice(0, 2).map((event: any) => (
                        <Link key={event.id} href={`/event/${event.slug}`}>
                          <div
                            className="group p-4 rounded-lg border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                                  {event.title}
                                </h4>
                                <p className="text-sm text-blue-600 mt-1 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(event.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="w-3 h-3 bg-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                          </div>
                        </Link>
                      ))}

                      {/* Show View More only when events > 4 */}
                      {enrolledEvents.length > 2 && (
                        <div className="text-center mt-4">
                          <Link href="/user/enrolled-events">
                            <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
                              View More →
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No enrolled events yet</p>
                      <p className="text-sm text-gray-400">Start exploring our upcoming events</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Payment History Card */}

              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold">Payment History</span>
                      <p className="text-green-100 text-sm font-normal">Your transaction records</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {paymentData?.filter(p => p.payment_status === "SUCCESS").length > 0 ? (
                    <div className="space-y-4">
                      {paymentData
                        .filter(p => p.payment_status === "SUCCESS")
                        .slice(0, 2)
                        .map((payment) => (
                          <div
                            key={payment.payment_id}
                            className="group p-4 rounded-lg border border-green-100 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                {/* Event Title */}
                                <h4 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                                  {payment.event_title}
                                </h4>
                                {/* Payment Date */}
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(payment.created_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                {/* Transaction ID */}
                                <p className="text-xs text-gray-400 mt-1 font-mono">
                                  Txn: {payment.transaction_id}
                                </p>
                              </div>

                              {/* Right Side: Amount */}
                              <div className="text-right">
                                <span className="text-lg font-bold text-green-600">
                                  {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                  }).format(payment.amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* View More Button */}
                      {paymentData.filter(p => p.payment_status === "SUCCESS").length > 2 && (
                        <div className="text-center mt-4">
                          <Link href="/user/payment-history">
                            <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
                              View More →
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No successful payments</p>
                      <p className="text-sm text-gray-400">Your successful transactions will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Profile Info Card */}
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold">My Profile</span>
                      <p className="text-purple-100 text-sm font-normal">Account information</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <h4 className="text-xl font-bold text-gray-800 mb-2">{dummyData?.profile.name}</h4>
                    <p className="text-gray-600 mb-6">{dummyData?.profile.email}</p>

                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <a href="/user/profile"> Edit Profile</a>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12">
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gradient-to-r from-blue-500 to-purple-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  Upcoming Events
                </h3>
                <div className="text-center py-12 text-gray-500">
                  <EventCard />
                </div>
              </div>
            </div>

          </div>
        </div>
      </UserLayout>
    );
  }

  return null;
};

export default UserDashboard;