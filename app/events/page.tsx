"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Star, Heart, ArrowRight, Play, CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import TopContactStrip from "@/components/TopContactStrip";
import { useSession } from 'next-auth/react';
import ProfilePopup from "@/components/ProfilePopup";
import { Button } from "@/components/ui/button";

// TypeScript interface based on the API response
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
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [eventPricesMap, setEventPricesMap] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/events/user/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse | Event[] = await response.json();

        // Handle different API response structures
        let events: Event[] = [];
        if (Array.isArray(result)) {
          events = result;
        } else if (result.data && Array.isArray(result.data)) {
          events = result.data;
        } else if (result.events && Array.isArray(result.events)) {
          events = result.events;
        }

        setUpcomingEvents(events);
        // fetch event prices for all events after events loaded
        try {
          const pricesRes = await fetch('/api/events/user/eventPrices');
          if (pricesRes.ok) {
            const prices = await pricesRes.json();
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
        } catch (err) {
          console.error('Error fetching event prices:', err);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, ['234']);

  // Fetch user details when session is available
  useEffect(() => {
    if (session?.user?.id) {
      const fetchDetails = async () => {
        try {
          const res = await fetch(`/api/userdetails?user_id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUserDetails(data);
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
        }
      };
      fetchDetails();
    }
  }, [session]);

  // Compute price for an event considering user category and earlybird
  const computePriceForEvent = (event: Event): number => {
    const basePrice = Number(event.event_price) || 0;
    const prices = eventPricesMap[event.id];
    const now = Date.now();

    if (userDetails && userDetails.category && Array.isArray(prices)) {
      const userCat = userDetails.category.toString().toLowerCase();
      const matched = prices.find((p: any) => p.category_name?.toString().toLowerCase() === userCat);
      if (matched) {
        // prefer earlybird if available and still valid
        const ebDate = event.earlybird_registration_date ? new Date(event.earlybird_registration_date).getTime() : null;
        // added for spot registration condition
        const startDate = event.event_start_date ? new Date(event.event_start_date).getTime() : null;
        if (startDate && now >= startDate && matched.spot_registration_price) {
          const p = Number(matched.spot_registration_price);
          if (!isNaN(p))
            console.log(p,"spot");
           return p;
        }
        if (ebDate && now < ebDate && matched.earlybird_registration_price) {
          const p = Number(matched.earlybird_registration_price);
          if (!isNaN(p))
            console.log(p);
           return p;
        }
        if (matched.price) {
          const p = Number(matched.price);
          if (!isNaN(p)) 
                        console.log(p,"dsd");

            return p;
        }
      }
    }

    // if no user-specific price, check if global earlybird on event applies (rare)
    if (event.earlybird_registration_date) {
      const eb = new Date(event.earlybird_registration_date).getTime();
      if (!isNaN(eb) && now < eb) {
        // no per-category earlybird found; fall back to basePrice
      }
    }

    return basePrice;
  };

  // Format date helper function
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'TBD';
    }
  };

  // Format time helper function
  const formatTime = (timeString: string | null): string => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  // Calculate duration helper function
  const calculateDuration = (startTime: string, endTime: string | null): string => {
    if (!startTime || !endTime) return '3 hours'; // Default duration

    try {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);

      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;

      const durationMinutes = endTotalMinutes - startTotalMinutes;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours} hours`;
      } else if (minutes > 0) {
        return `${minutes} minutes`;
      } else {
        return '3 hours';
      }
    } catch {
      return '3 hours';
    }
  };

  // Generate slug from title
  const generateSlug = (slug: string): string => {
    return slug ? slug : '';
  };

  // Handle broken image
  // const handleImageError = (eventId: number) => {
  //   setBrokenImages(prev => new Set([...prev, eventId]));
  // };

  // Pagination calculations
  const totalPages = Math.ceil(upcomingEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = upcomingEvents.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="">
        <TopContactStrip />
        <NavigationMenu />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading upcoming events...</p>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="">
        <NavigationMenu />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Events</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  // No events state
  if (upcomingEvents.length === 0) {
    return (
      <section className="">
        <TopContactStrip />
        <NavigationMenu />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 max-w-md mx-auto">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600">Check back soon for new events and workshops!</p>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  return (
    <section className="">
      <TopContactStrip />
      <NavigationMenu />
      <ProfilePopup/>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden py-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob opacity-30"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 opacity-30"></div>
          <div className="absolute -bottom-8 left-40 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 opacity-30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-2 sm:px-4">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            {/* <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming KAGOF Events
            </div> */}
            <h2
              className="text-2xl md:text-5xl font-bold  pb-3 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Upcoming Events
            </h2>
            <br></br>
            <p className="text-xl text-gray-600 mx-auto leading-relaxed mb-5">
              Discover our latest workshops and seminars designed to bring holistic wellness and ancient Ayurvedic wisdom closer to you
            </p>
          </div>

          {/* Events Grid */}
          <div className="space-y-8">
            {paginatedEvents.map((event: Event, index: number) => {
              const eventSlug = generateSlug(event.slug);
              const hasValidImage = !brokenImages.has(event.id);

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
                    {/* Image Section */}
                    {hasValidImage && (
                      <div className="lg:w-1/3 w-full relative overflow-hidden">
                        <motion.img
                          src={event.event_image}
                          alt={event.event_title}
                          className="h-64 lg:h-full w-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          // onError={() => handleImageError(event.id)}
                        />
                        {/* Category-based featured badge */}
                        {(event.event_category === 'Conference' || event.event_category === 'Workshop') && (
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="lg:w-2/3 w-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-white/20">
                        <div className="flex items-center space-x-4">
                          <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-blue-200">
                            {event.event_category}
                          </span>

                        </div>
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

                      {/* Title & Description */}
                      <div className="px-8 py-6 flex-grow">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                          {event.event_title}
                        </h3>
                        {/* <p className="text-gray-600 leading-relaxed text-lg">
                          {event.event_description || 'Join us for an enriching experience in holistic wellness and Ayurvedic practices.'}
                        </p> */}
                      </div>

                      {/* Event Details */}
                      <div className="px-8 py-6 grid grid-cols-2 gap-4 bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-t border-white/20">
                        <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Date</div>
                            <div className="font-semibold">
                              {formatDate(event.event_start_date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-3">
                            <Clock className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Duration</div>
                            <div className="font-semibold">
                              {calculateDuration(event.event_start_time, event.event_end_time)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mr-3">
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Location</div>
                            <div className="font-semibold">{event.event_location || 'Online'}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 hover:text-pink-600 transition-colors duration-200">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Time</div>
                            <div className="font-semibold">
                              {formatTime(event.event_start_time)}
                              {event.event_end_time && ` - ${formatTime(event.event_end_time)}`}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="px-8 py-6 flex items-center justify-between bg-gradient-to-r from-white/50 to-gray-50/50 border-t border-white/20">
                        <div className="flex items-center space-x-4">
                          {/* <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            ₹{computePriceForEvent(event).toLocaleString()}
                          </div> */}
                          {/* <div className="text-sm text-gray-500">
                            per person

                          </div> */}
                        </div>
                        <div className="flex space-x-3">

                          <Link href={`/event/${eventSlug}`}>
                            <button
                              type="button"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center"
                            >
                              <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                              Register Now
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-6 mt-12"
            >
              {/* Page Navigation */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white shadow-md hover:shadow-xl hover:scale-105'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsis =
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-2 text-gray-400 font-bold">
                          ⋯
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-11 h-11 rounded-xl font-bold transition-all duration-300 ${currentPage === page
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl scale-110'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg hover:scale-105'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white shadow-md hover:shadow-xl hover:scale-105'
                    }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Page Info Card */}
              <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {paginatedEvents.length === 0 ? 0 : startIndex + 1}
                  </span>
                  {" "}-{" "}
                  <span className="font-bold text-blue-600">
                    {Math.min(endIndex, upcomingEvents.length)}
                  </span>
                  {" "}of{" "}
                  <span className="font-bold text-purple-600">{upcomingEvents.length}</span>
                  {" "}events
                </p>
              </div>
            </motion.div>
          )}
        </div>
       <style jsx>{`
  /* 🌈 Base animations */
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

  /* 📱 MOBILE ONLY (≤640px) */
  @media (max-width: 640px) {
    /* --- Stack card vertically --- */
    .flex.flex-col.lg\\:flex-row {
      flex-direction: column !important;
    }

    .flex.flex-col.lg\\:flex-row img {
      width: 100% !important;
      height: 220px !important;
      object-fit: cover;
    }

    /* Compact padding for cards */
    .px-8 {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }

    .py-6 {
      padding-top: 1rem !important;
      padding-bottom: 1rem !important;
    }

    /* Stack price & button */
    .flex.items-center.justify-between {
      flex-direction: column !important;
      align-items: center;
      gap: 0.75rem;
    }

    /* Reduce gap between cards */
    .space-y-8 > * + * {
      margin-top: 1.5rem !important;
    }

    /* --- Header alignment under logo --- */
    .text-center.mb-12.animate-fade-in {
      margin-top: 1rem;
      padding-top: 4rem;
    }

    h2 {
      font-size: 1.5rem;
      text-align: center;
      margin-top: 0.5rem;
      line-height: 2rem;
    }

    p.text-xl {
      font-size: 1rem;
      line-height: 1.6;
      text-align: center;
      padding: 0 1rem;
      margin-top: 0.5rem;
    }

    /* --- Event details stacked line-by-line --- */
    .px-8.py-6.grid.grid-cols-2.gap-4 {
      grid-template-columns: 1fr !important;
      row-gap: 1rem !important;
    }

    /* Each field (Date, Duration, Location, Time) */
    .flex.items-center.text-gray-600 {
      display: flex;
      flex-direction: row; /* icon left, text right */
      align-items: flex-start;
      gap: 0.75rem;
      word-break: break-word;
      white-space: normal;
    }

    /* Icon fixed size */
    .flex.items-center.text-gray-600 .w-10 {
      flex-shrink: 0;
      min-width: 2.5rem;
    }

    /* Labels */
    .flex.items-center.text-gray-600 .text-xs {
      display: block;
      color: #6b7280;
      font-size: 0.75rem;
      margin-bottom: 0.1rem;
      line-height: 1.1;
    }

    /* Values */
    .flex.items-center.text-gray-600 .font-semibold {
      max-width: 100%;
      font-size: 0.95rem;
      line-height: 1.4;
      overflow-wrap: break-word;
      white-space: normal;
    }

    /* Disable the transparent line between fields */
    .flex.items-center.text-gray-600:not(:last-child) {
      border-bottom: none !important;
      padding-bottom: 0 !important;
    }

    /* Soften background blobs */
    .absolute.inset-0.overflow-hidden {
      opacity: 0.25;
      filter: blur(40px);
    }

    /* --- CTA section: "Don't Miss Out!" --- */
    .mt-16.text-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center !important;
      width: 100% !important;
      margin: 0 auto;
      padding: 1rem 0;
    }

    .mt-16.text-center .bg-white\\/80 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: auto !important;
      max-width: 90%;
      margin: 0 auto;
      padding: 1.25rem !important;
    }

    /* Center "Become a Member" button */
    .flex.flex-col.sm\\:flex-row.gap-4.justify-center {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      width: 100% !important;
      margin: 0 auto !important;
    }

    .mt-16.text-center button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto !important;
      width: auto !important;
      min-width: 200px;
    }

    /* Resize CTA heading slightly */
    .text-3xl.font-bold {
      font-size: 1.5rem;
      text-align: center;
    }

    /* Buttons center-aligned */
    .flex.flex-col.sm\\:flex-row.gap-4.justify-center {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }
  }
`}</style>

      </div>
      <Footer />
    </section>
  );
};

export default EventCard;


