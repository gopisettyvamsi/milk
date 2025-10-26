"use client"
import React from 'react';
import Link from 'next/link';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';

import { MapPin, Phone, Mail, Building2, Rocket, Crown, Scroll } from 'lucide-react';


const ContactCard = ({ title, address, phone, email, icon: Icon, type = "office" }) => {
  const getCardStyles = () => {
    switch (type) {
      case "headquarters":
        return "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg";
      case "regional":
        return "bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-lg";
      case "incubation":
        return "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg";
      default:
        return "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 shadow-md";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "headquarters":
        return "text-blue-600";
      case "regional":
        return "text-purple-600";
      case "incubation":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${getCardStyles()}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-full bg-white shadow-md ${getIconColor()}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-gray-500 mt-1 flex-shrink-0" />
          <p className="text-gray-700 text-sm leading-relaxed">{address}</p>
        </div>

        {phone && (
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-gray-500 flex-shrink-0" />
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              {phone}
            </a>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-500 flex-shrink-0" />
            <a href={`mailto:${email}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              {email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ContactUs() {


  const offices = [
    {
      title: "Company Headquarters",
      address: "11205 Alpharetta Hwy Suite H2 Roswell, GA 30076",
      phone: "877-253-3484 (Toll free) / 925-428-5025",
      email: "info@edvenswa.com",
      icon: Building2,
      type: "headquarters"
    },
    {
      title: "Branch Office - San Jose",
      address: "1925 Zanker Rd San Jose, CA 95112, USA",
      phone: null,
      email: null,
      icon: Building2,
      type: "office"
    },
    {
      title: "Branch Office - Bellevue",
      address: "Executive Plaza, 12835 Bellevue Redmond Road, Ste 215 and 216, Bellevue, WA 98005, USA",
      phone: null,
      email: null,
      icon: Building2,
      type: "office"
    },
    {
      title: "Registered Office - India",
      address: "H.No: 1-36/13 Manju Anurag Enclave, Malkajgiri Hyderabad, Telangana 500047",
      phone: "+91-4042039977",
      email: null,
      icon: Building2,
      type: "office"
    },
    {
      title: "Offshore Development Center",
      address: "Quadrant 3-A2, First Floor, Cyber Towers, Hitech City, Madhapur, Hyderabad, Telangana 500081",
      phone: "+91-4042039977",
      email: null,
      icon: Building2,
      type: "office"
    },
    {
      title: "Startup Incubation Center",
      address: "Edvenswa Towers H.No: 6-149/5/B/1 Bowrampet Village Hyderabad, Telangana 500043",
      phone: null,
      email: null,
      icon: Rocket,
      type: "incubation"
    },
    {
      title: "Regional Head Office - KSA",
      address: "Building No. 44, Ibn Katheer St, King Abdul Aziz, Unit A11, Riyadh 13334",
      phone: null,
      email: null,
      icon: Crown,
      type: "regional"
    }
  ];


  return (
    <section>
      <NavigationMenu />
      <PageMetadata
        title="Contact Us - KAGOF"
        description="KAGOF"
        keywords=""
        ogUrl="/"
        canonicalUrl="/"
      />
      

      <div>
        <div className="w-full h-64 md:h-96 relative bg-gray-200">
          <Image
            src="/contact-us-new.jpg"
            alt="Edvenswa Team in Office"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="text-center my-6 px-4">
        <h2 className="inline-block uppercase tracking-wider text-teal-600 font-bold px-4 py-2 text-lg md:text-xl">
            Contact
          </h2>

      </div>
        <div className="text-center mt-4 mb-4">
          <h2 className="text-2xl md:text-3xl text-black">
            We’re here to help.
          </h2>
        </div>



      </div>
      <section className="py-20 px-6 bg-gray-900 text-white mb-10">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Optimize Your Data Infrastructure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Partner with kagof for expert implementation and managed services that maximize the value of your data investments.
          </p>
          <a href="mailto:sales@kagof?subject=Contact%20Enquiry" className="text-xl text-teal-400 hover:text-teal-300 mb-8 block">sales@kagof</a>
        
        </div>
      </section>
      <div className="px-4">
        <ContactForm />
      </div>
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
    </section>
  );
}