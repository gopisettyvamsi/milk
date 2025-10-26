"use client";
import PageMetadata from '@/components/PageMetaData';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';
import TopContactStrip from '@/components/TopContactStrip';

interface Event {
  id: string;
  event_title: string;
  event_description: string;
  event_image: string;
  event_location: string;
  event_date: string;
  event_start_date: string;
  event_end_date: string;
  event_start_time: string;
  event_end_time: string;
  event_category: string;
  max_attendees: number;
  created_at: string;
}

const EventDetails = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        if (data && data.id) {
          setEvent(data);
        } else {
          setEvent(null);
        }
      } catch (error) {
        setEvent(null);
      }
    };
    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to format date display based on start and end dates
  const getFormattedDateDisplay = () => {
    if (!event) return "Date not set";

    const hasStartDate = event.event_start_date && event.event_start_date.trim() !== '';
    const hasEndDate = event.event_end_date && event.event_end_date.trim() !== '';

    if (!hasStartDate) return "Date not set";

    if (hasEndDate) {
      const startDate = new Date(event.event_start_date);
      const endDate = new Date(event.event_end_date);

      // If start and end dates are the same, show only one date
      if (startDate.getTime() === endDate.getTime()) {
        return formatDate(event.event_start_date);
      } else {
        // Show date range
        return `${formatDate(event.event_start_date)} - ${formatDate(event.event_end_date)}`;
      }
    } else {
      // Only start date is available
      return formatDate(event.event_start_date);
    }
  };

  return (
    <>
      <TopContactStrip />
      <NavigationMenu />
      <PageMetadata
        title={event ? `${event.event_title} - Kagof` : "Event - Kagof"}
        description={event ? event.event_description : "Event details"}
        keywords="events, Kagof, meetups, workshops, conferences"
        ogUrl={`/events/${eventId}`}
        canonicalUrl={`/events/${eventId}`}
      />
      <div className="min-h-screen">
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.push("/events")}
              className="flex self-start justify-start text-left text-[#019c9d] hover:text-[#019c9d]/80 p-3 h-auto relative z-10 mb-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Events
            </Button>
            {!event ? (
              <div className="text-center text-gray-500 py-24">

              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-black/20 rounded-xl overflow-hidden shadow-md"
              >
                <div
                  className="h-48 bg-gray-200 relative bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${event.event_image})`,
                  }}
                >
                  <span className="absolute top-4 left-4 bg-[#019c9d] text-white text-xs font-medium px-3 py-1 rounded-full">
                    {event.event_category}
                  </span>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap items-center text-sm text-foreground/60 mb-4 gap-4">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {getFormattedDateDisplay()}
                    </span>
                    {(event.event_start_time || event.event_end_time) && (
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {event.event_start_time && formatTime(event.event_start_time)}
                        {event.event_end_time && event.event_start_time && <> – </>}
                        {event.event_end_time && formatTime(event.event_end_time)}
                      </span>
                    )}
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {event.event_location}
                    </span>
                    {/* <span className="flex items-center">
                      <Users size={14} className="mr-1" />
                      Max: {event.max_attendees}
                    </span> */}
                  </div>
                  <h1 className="text-3xl font-display font-bold mb-4">
                    {event.event_title}
                  </h1>
                  <p
                    className="text-lg mb-6"
                    dangerouslySetInnerHTML={{ __html: event.event_description }}
                  ></p>
                  {/* <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#019c9d] hover:text-[#019c9d]/80 p-0 h-auto"
                      onClick={() => router.push("/events")}
                    >
                      Back to Events <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div> */}
                </div>
              </motion.div>
            )}
          </div>
        </section>
        {/* <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button> */}
        <ScrollToTopButton />
        <Footer />
      </div>
    </>
  );
};

export default EventDetails;
