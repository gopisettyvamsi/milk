"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User, Star, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import UserLayout from "@/components/layouts/UserLayout";
import Link from "next/link";

interface EnrolledEvent {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  image: string;
}

const EventCard = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EnrolledEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/events/enrolled');
        if (!res.ok) throw new Error('Failed to fetch enrolled events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledEvents();
  }, []);

  const handleEventClick = (slug: string) => {
    router.push(`/event/${slug}`);
  };

  if (loading) return <UserLayout><div>Loading...</div></UserLayout>;

  if (events.length === 0) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh] container mx-auto px-2 sm:px-4">
          <div className="w-full bg-white shadow-xl rounded-2xl border border-gray-200 p-8 text-center">            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Enrolled Events
            </h2>
            <p className="text-gray-600 mb-6">
              You haven’t joined any events yet. Explore our upcoming events and
              be part of the journey!
            </p>
            <Link href="/events">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">
                Browse Events
              </button>
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }


  return (
    <UserLayout>
      <div className="container mx-auto px-2 sm:px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              onClick={() => handleEventClick(event.slug)}
            >
              <div className="flex flex-col">
                <div className="relative overflow-hidden h-52">
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 text-xs font-semibold rounded-full">
                    {event.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                    <span className="text-xs font-bold text-gray-800">Enrolled</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">{event.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default EventCard;