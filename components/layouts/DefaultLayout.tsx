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
import TopContactStrip from "../TopContactStrip";



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
      <TopContactStrip/>
      

      <NavigationMenu />


      <ScrollToTopButton />
      <Footer />
    </div>

  );
}
