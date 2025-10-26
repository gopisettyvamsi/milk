"use client"
import { Button } from "@/components/ui/button";
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Globe, TrendingUp, Database, Shield, Zap, Settings, Map, Calendar, Clock, Locate, User, Badge, BadgeCheck, ArrowRight, ChevronRight, MapPin, Scroll } from "lucide-react";
import HeroSection from "@/components/Hero";
import EventCard from "@/components/Card";
import DoctorCard from "@/components/DoctorCard";
import MembershipSection from "@/components/Membership";
import About from "@/components/About";
import TopContactStrip from "@/components/TopContactStrip";
import ProfilePopup from "@/components/ProfilePopup";

const SimpleImageSlider = () => {
  const images = [
    { src: "/healtcarebanner.png", alt: "HealthCare" },
    { src: "/technology.jpg", alt: "Edvenswa Tech" },
    { src: "/edvenswa-epc.jpg", alt: "Edvenswa Epc" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="absolute w-full h-[75vh] md:h-[85vh] overflow-hidden">
      {/* Slider Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute w-full h-full transition-transform duration-500 ease-in-out z-10"
          style={{
            transform: `translateX(${100 * (index - currentIndex)}%)`,
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority={index === 0}
          />
        </div>
      ))}


      {/* Wave SVG Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] overflow-hidden leading-[0] z-20">
        <svg
          className="w-full h-full -scale-y-100"  // Flips the wave vertically
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            className="fill-white"
            opacity="0.66"
            d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 
        s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"
          />
          <path
            className="fill-white"
            opacity="0.33"
            d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 
        c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"
          />
          <path
            className="fill-white"
            d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6
        C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"
          />
        </svg>
      </div>

    </div>
  );
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageMetadata
        title="Home - KAGOF"
        description="KAGOF"
        keywords=""
        ogUrl="/"
        canonicalUrl="/"
      />
      <TopContactStrip />
      <NavigationMenu />
      <ProfilePopup />
      <HeroSection />
      <EventCard />
      <About />

      {/* <MembershipSection /> */}
      {/* <BadgeCheck></BadgeCheck> */}
      {/* <ScrollToTopButton /> */}
      <Footer />
    </div>

  );
}
