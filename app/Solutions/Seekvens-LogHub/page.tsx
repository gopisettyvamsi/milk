



"use client"
import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Globe, TrendingUp, Database, Shield, Zap, Scroll } from "lucide-react";


export default function Business() {
  return (
    <section>
      {/* Header */}
      <NavigationMenu />

      {/* Page Metadata */}
      <PageMetadata
        title="Business - KAGOF"
        description="KAGOF"
        keywords=""
        ogUrl="/"
        canonicalUrl="/"
      />

      {/* Banner Image */}
      <div className="w-full h-64 md:h-96 relative bg-gray-200">
        <Image
          src="/banners/services_logo.jpg"
          alt="Kagof Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* LogHub Content Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kagof LogHub</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              <strong>Cribl</strong>-powered observability pipelines that reduce, enrich, and route logs across cloud, edge, and apps. Enables 40–70% log reduction while improving visibility and cost efficiency across platforms like <strong>Splunk</strong>, <strong>Snowflake</strong>, and S3.
            </p>
          </div>

          {/* Subheading */}
          <div className="text-center mb-12">
            <h3 className="text-xl text-teal-600 font-semibold uppercase tracking-wide">
               <strong>Cribl</strong>-powered observability, enrichment, and routing platform
            </h3>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Core */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

              <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof Core</h4>
              <p className="text-gray-600">
                Turnkey observability pipeline to ingest, filter, enrich, and route logs to any destination (<strong>Splunk</strong>, <strong>S3</strong>, <strong>Snowflake</strong>). Reduces log volume by 40–70%.
              </p>
            </div>

            {/* CloudRoute */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof CloudRoute</h4>
              <p className="text-gray-600">
                Purpose-built for hybrid cloud — collects logs from AWS CloudWatch, Azure Monitor, and GCP, transforms, then routes to centralized storage or SIEM.
              </p>
            </div>

            {/* EdgeLite */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof EdgeLite</h4>
              <p className="text-gray-600">
                Lightweight <strong>Cribl</strong> Edge deployments for remote offices, retail stores, or plants — local filtering + enrichment before upstreaming data.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof AppTrace</h4>
              <p className="text-gray-600">
                Targeted at app developers and SREs — enriches application logs with trace context, app versioning, and GeoIP metadata before routing.
              </p>
            </div>

            {/* FinSight */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof FinSight</h4>
              <p className="text-gray-600">
                Pre-built filters for financial organizations — masks PCI data, aggregates transaction logs, and supports compliance logging for audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      {/* <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button> */}
      <ScrollToTopButton />

      {/* Contact Form Section */}

      {/* Footer */}
      <Footer />
    </section>

  );
}

