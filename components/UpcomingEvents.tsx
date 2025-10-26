"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  Heart,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const UpcomingEvents = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const upcomingEvents = [
    {
      id: 1,
      slug: "holistic-wellness-camp",
      category: "Ayurveda",
      rating: 4.8,
      title: "Holistic Wellness Camp",
      description:
        "A comprehensive workshop on Ayurveda and holistic healing. Learn authentic methods, guided by experienced practitioners with traditional wisdom.",
      date: "25th September 2025",
      duration: "3 hours",
      location: "Hyderabad, India",
      doctor: "Dr. Anand Sharma",
      price: 1500,
      image: "/holistic.jpg",
      featured: true,
      attendees: 45,
      capacity: 60,
    },
    // Add more events here as needed...
  ];

  return (
    <section id="events">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden py-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob opacity-30"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 opacity-30"></div>
          <div className="absolute -bottom-8 left-40 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 opacity-30"></div>
        </div>

        <div className="relative z-10 container max-w-6xl mx-auto px-6">

          {/* Events Grid */}
          <div className="space-y-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/3 w-full relative overflow-hidden">
                    <motion.img
                      src={event.image}
                      alt={event.title}
                      className="h-64 lg:h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    {event.featured && (
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                        {event.attendees}/{event.capacity} registered
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-2/3 w-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-white/20">
                      <div className="flex items-center space-x-4">
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-blue-200">
                          {event.category}
                        </span>
                        <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          <span className="text-sm font-medium text-amber-700">
                            {event.rating}
                          </span>
                        </div>
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
                        {event.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {event.description}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="px-8 py-6 grid grid-cols-2 gap-4 bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-t border-white/20">
                      <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">
                            Date
                          </div>
                          <div className="font-semibold">{event.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">
                            Duration
                          </div>
                          <div className="font-semibold">{event.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">
                            Location
                          </div>
                          <div className="font-semibold">{event.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 hover:text-pink-600 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">
                            Instructor
                          </div>
                          <div className="font-semibold">{event.doctor}</div>
                        </div>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="px-8 py-6 flex items-center justify-between bg-gradient-to-r from-white/50 to-gray-50/50 border-t border-white/20">
                      <div className="flex items-center space-x-4">
                        {/* <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                          ₹{event.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per person</div> */}
                      </div>
                      <div className="flex space-x-3">
                        <Link href={`/event/${event.slug}`}>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center">
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
            ))}
          </div>

          {/* Call to Action Footer */}
          <div className="mt-16 text-center animate-fade-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Don't Miss Out!
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare professionals advancing their
                knowledge in Ayurvedic gynecology and women's wellness
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/events">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center justify-center">
                    <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      View All Events
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </Link>
                <Link href="/membership">
                  <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105 flex items-center justify-center">
                    <User className="w-5 h-5 mr-2" />
                    Become a Member
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
        `}</style>
      </div>
    </section>
  );
};

export default UpcomingEvents;
