"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  Heart,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import TopContactStrip from "@/components/TopContactStrip";
import { useSession } from "next-auth/react";

interface Event {
  id: number;
  event_title: string;
  slug: string;
  event_description: string;
  event_image: string;
  event_location: string;
  event_category: string;
  event_start_date: string;
  event_end_date: string;
  event_start_time: string;
  event_end_time: string | null;
  created_at: string;
  event_price: number;
  earlybird_registration_date?: string | null;
  category_prices?: Array<{
    id: number;
    event_id: number;
    category_id: number;
    category_name: string;
    price: string | number | null;
    earlybird_registration_price?: string | null;
    spot_registration_price?: string | null;
  }>;
}

interface ApiResponse {
  success?: boolean;
  data?: Event[];
  events?: Event[];
  message?: string;
}

const EventCard: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [eventPricesMap, setEventPricesMap] = useState<Record<number, any[]>>({});
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // ✅ Fetch events and prices
  useEffect(() => {
    const fetchEventsAndPrices = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/events/user/list");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const result: ApiResponse | Event[] = await res.json();
        let events: Event[] = [];
        if (Array.isArray(result)) events = result;
        else if (result.data) events = result.data;
        else if (result.events) events = result.events;

        setUpcomingEvents(events);

        // ✅ Fetch pricing data
        try {
          const priceRes = await fetch("/api/events/user/eventPrices");
          if (priceRes.ok) {
            const prices = await priceRes.json();
            const map: Record<number, any[]> = {};
            if (Array.isArray(prices)) {
              prices.forEach((p: any) => {
                const eid = Number(p.event_id);
                if (!map[eid]) map[eid] = [];
                map[eid].push(p);
              });
            }
            setEventPricesMap(map);
          }
        } catch (e) {
          console.error("Error fetching event prices:", e);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load events. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndPrices();
  }, []);

  // ✅ Fetch user details (for category-based price)
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserDetails = async () => {
        try {
          const res = await fetch(`/api/userdetails?user_id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUserDetails(data);
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      };
      fetchUserDetails();
    }
  }, [session]);

  // ✅ Price logic
  const computePriceForEvent = (event: Event): number => {
    const basePrice = Number(event.event_price) || 0;
    const prices = eventPricesMap[event.id];
    const now = Date.now();

    if (userDetails && userDetails.category && Array.isArray(prices)) {
      const userCat = userDetails.category.toString().toLowerCase();
      const matched = prices.find(
        (p: any) =>
          p.category_name?.toString().toLowerCase() === userCat
      );

      if (matched) {
        const ebDate = event.earlybird_registration_date
          ? new Date(event.earlybird_registration_date).getTime()
          : null;
        const startDate = event.event_start_date
          ? new Date(event.event_start_date).getTime()
          : null;

        // Spot registration
        if (startDate && now >= startDate && matched.spot_registration_price) {
          const p = Number(matched.spot_registration_price);
          if (!isNaN(p)) return p;
        }

        // Early bird
        if (ebDate && now < ebDate && matched.earlybird_registration_price) {
          const p = Number(matched.earlybird_registration_price);
          if (!isNaN(p)) return p;
        }

        // Default category price
        if (matched.price) {
          const p = Number(matched.price);
          if (!isNaN(p)) return p;
        }
      }
    }

    return basePrice;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "TBD";
    }
  };

  const formatTime = (timeString: string | null): string => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const calculateDuration = (
    startTime: string,
    endTime: string | null
  ): string => {
    if (!startTime || !endTime) return "3 hours";
    try {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return h > 0 && m > 0
        ? `${h}h ${m}m`
        : h > 0
        ? `${h} hours`
        : `${m} minutes`;
    } catch {
      return "3 hours";
    }
  };

  const generateSlug = (slug: string): string => slug || "";

  // ✅ Loading
  if (loading) {
    return (
      <section className="">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading upcoming events...</p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <section className="">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="bg-white/80 p-8 rounded-2xl shadow-xl border border-white/20 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Unable to Load Events
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ✅ No Events
  if (upcomingEvents.length === 0) {
    return (
      <section className="">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="bg-white/80 p-8 rounded-2xl shadow-xl border border-white/20 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Upcoming Events
            </h3>
            <p className="text-gray-600">
              Check back soon for new events and workshops!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Main UI
  return (
    <section className="">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob opacity-30"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 opacity-30"></div>
          <div className="absolute -bottom-8 left-40 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 opacity-30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-2 sm:px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl md:text-5xl font-bold mb-3 pb-2 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 mx-auto leading-relaxed pb-5">
              Discover our latest workshops and seminars designed to bring
              holistic wellness and Ayurvedic wisdom closer to you.
            </p>
          </div>

          <div className="space-y-8">
            {upcomingEvents.slice(0, 2).map((event, index) => {
              const eventSlug = generateSlug(event.slug);
              const eventImage = event.event_image;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  onHoverStart={() => setHoveredCard(event.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-1/3 w-full relative overflow-hidden">
                      <motion.img
                        src={eventImage}
                        alt={event.event_title}
                        className="h-64 lg:h-full w-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      {(event.event_category === "Conference" ||
                        event.event_category === "Workshop") && (
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="lg:w-2/3 w-full flex flex-col">
                      <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-white/20">
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                          {event.event_category}
                        </span>
                        {hoveredCard === event.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Available
                          </motion.div>
                        )}
                      </div>

                      <div className="px-8 py-6 flex-grow">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                          {event.event_title}
                        </h3>
                      </div>

                      <div className="px-8 py-6 grid grid-cols-2 gap-4 bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-t border-white/20">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="text-xs text-gray-500">Date</div>
                            <div className="font-semibold">
                              {formatDate(event.event_start_date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 text-purple-600 mr-3" />
                          <div>
                            <div className="text-xs text-gray-500">
                              Duration
                            </div>
                            <div className="font-semibold">
                              {calculateDuration(
                                event.event_start_time,
                                event.event_end_time
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <div className="text-xs text-gray-500">
                              Location
                            </div>
                            <div className="font-semibold">
                              {event.event_location || "Online"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="w-5 h-5 text-pink-600 mr-3" />
                          <div>
                            <div className="text-xs text-gray-500">Time</div>
                            <div className="font-semibold">
                              {formatTime(event.event_start_time)}{" "}
                              {event.event_end_time &&
                                ` - ${formatTime(event.event_end_time)}`}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-8 py-6 flex items-center justify-between bg-gradient-to-r from-white/50 to-gray-50/50 border-t border-white/20">
                        <div className="flex items-center space-x-4">
                          {/* <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            ₹{computePriceForEvent(event).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            per person
                          </div> */}
                        </div>
                        <Link href={`/event/${eventSlug}`}>
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center">
                            <Heart className="w-4 h-4 mr-2 group-hover:scale-110" />
                            Register Now
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {upcomingEvents.length > 2 && (
              <div className="text-center mt-6">
                <Link href="/events">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    View More Events
                  </button>
                </Link>
              </div>
            )}


          </div>
        </div>

        {/* Custom CSS */}
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-fade-in { animation: fade-in 0.8s ease-out; }


          
        `}</style>
      </div>

    </section>
  );
};

export default EventCard;