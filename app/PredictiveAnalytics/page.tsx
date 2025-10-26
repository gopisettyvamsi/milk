"use client"
import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Business() {


  const predictiveAnalyticsData = [
    {
      title: "Kagof Foresight",
      description:
        "Predictive analytics engine for real-time operational foresight. Transforms observability data into forward-looking insights using custom-built models tuned to your environment. Detects anomalies, bottlenecks, and emerging risks before they impact performance or users."
    },
    {
      title: "Kagof SignalScope",
      description:
        <p>Telemetry-driven modeling for early failure and anomaly detection. Combines real-time data with domain-specific machine learning to uncover subtle signals across logs, traces, and metrics. Enables <strong>DevOps</strong> and <strong>SecOps</strong> teams to act before incidents escalate.</p>
    },
    {
      title: "Kagof TrendLoop",
      description:
        "Adaptive forecasting engine that continuously learns from your system’s behavior. Integrates with observability pipelines to detect evolving usage patterns, capacity shifts, and performance drift. Uses closed-loop intelligence to fine-tune alerts, guide scaling decisions, and trigger automation based on real-world trends not just static thresholds."
    },
    {
      title: "Kagof LoadSense",
      description:
        "Infrastructure-aware load forecasting and resource planning. Anticipates spikes in system load, helping teams plan capacity, scale infrastructure dynamically, and prevent outages. Ideal for hybrid cloud and Kubernetes-based deployments."
    },
    // {
    //   title: "Kagof ThreatFore",
    //   description:
    //     "Predictive security analytics for breach prevention and risk mitigation. Identifies risky behaviors and early breach indicators using historical behavior and real-time correlation. Helps security teams act with foresight to reduce incident response times."
    // },
    // {
    //   title: "Kagof InsightMesh",
    //   description:
    //     "Strategic foresight woven into your data fabric. Predictive analytics as a built-in capability—not a bolt-on—enabling continuous decision intelligence across IT and business operations. Empowers proactive governance, resilience, and agility."
    // }
  ];

  return (
    <>
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



      {/* Predictive Analytics Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Predictive Analytics</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We help teams unlock foresight using predictive analytics deeply embedded into your telemetry fabric.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {predictiveAnalyticsData.map((item, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <ScrollToTopButton />

      {/* Footer */}

      <Footer />
    </>
  );
}
