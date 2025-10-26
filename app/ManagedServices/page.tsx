"use client";
import React from "react";
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import PageMetadata from "@/components/PageMetaData";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManagedServices() {
  const managedServicesData = [
    // {
    //   title: "Kagof OpsLayer",
    //   description:
    //     "Delivers end-to-end lifecycle support—including deployment, scaling, upgrades, and issue resolution—so your data pipelines remain healthy and future-ready.",
    // },
    {
      title: "Kagof Watchtower",
      description:
        "Provides round-the-clock coverage for cloud-native and hybrid environments, ensuring availability, stability, and SLA adherence with minimal internal overhead.",
    },
    // {
    //   title: "Kagof TuneIQ",
    //   description:
    //     "Analyzes usage trends, identifies bottlenecks, and applies expert tuning to maintain peak system efficiency—no matter how your workloads evolve.",
    // },
    // {
    //   title: "Kagof ConfigSync",
    //   description:
    //     "Controls drift, enforces standardization, and automates updates across environments—lowering risk and accelerating delivery timelines.",
    // },
    {
      title: "Kagof ScaleAssist",
      description:
        "Adjusts infrastructure parameters based on real-time demand and strategic goals supporting seasonal spikes, product rollouts, and long-term growth.",
    },
    {
      title: "Kagof EdgeOps",
      description:
        "Handles deployment, updates, and troubleshooting across distributed, bandwidth-sensitive nodes ensuring consistency from the edge to the cloud.",
    },
    {
      title: "Kagof InsightCare",
      description:
        "Combines technical excellence with business understanding to help your teams make better decisions, faster freeing them to focus on innovation, not maintenance.",
    },
  ];

  return (
    <>
      <NavigationMenu />

      <PageMetadata
        title="Managed Services - KAGOF"
        description="Expert-managed observability infrastructure, performance optimization, and 24/7 support services."
        keywords=""
        ogUrl="/"
        canonicalUrl="/"
      />

      <div className="w-full h-64 md:h-96 relative bg-gray-200">
        <Image
          src="/banners/services_logo.jpg"
          alt="Kagof Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Managed Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              End-to-end observability infrastructure and operational support engineered for resilience, scalability, and proactive performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {managedServicesData.map((item, index) => (
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

      <Footer />
    </>
  );
}
