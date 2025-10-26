"use client";
import React from "react";
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import PageMetadata from "@/components/PageMetaData";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StorageSolutions() {
  const storageData = [
    // {
    //   title: "Kagof DataVault",
    //   description:
    //     "Cloud-native storage architecture for secure, scalable observability. Purpose-built to store high-volume telemetry with resilience and efficiency. Supports rapid ingestion, long-term retention, and seamless integration with pipelines and analytics platforms.",
    // },
    // {
    //   title: "Kagof StoreIQ",
    //   description:
    //     "Intelligent storage tiering for lifecycle-optimized data management. Manages the full data lifecycle—from raw telemetry to long-term archival—while automating retention policies, reducing costs, and enabling real-time access when it counts.",
    // },
    {
      title: "Kagof SnowLayer",
      description:
        <p>Columnar analytics-ready storage powered by <strong>Snowflake</strong>. Optimized for deep telemetry querying and high-performance analytics. Converts raw logs and metrics into structured formats for insights, audits, and cross-team collaboration.</p>,
    },
    // {
    //   title: "Kagof IngestSafe",
    //   description:
    //     "Secure storage onboarding for high-velocity data streams. Handles initial ingestion and transformation with encryption, schema enforcement, and compliance tagging—ensuring every byte is trusted from the start.",
    // },
    {
      title: "Kagof AccessMesh",
      description:
        "Role-based access and global data governance at scale. Implements fine-grained control across teams, geographies, and workloads. Enables secure collaboration through access policies, versioning, and centralized oversight.",
    },
    {
      title: "Kagof CompliStore",
      description:
        <p>Retention-aware and audit-ready storage infrastructure. Ensures regulatory compliance with built-in encryption, audit trails, and long-term data protection. Supports standards like <strong>GDPR</strong>, <strong>HIPAA</strong>, and <strong>SOC 2</strong> out of the box.</p>,
    },
  ];

  return (
    <>
      <NavigationMenu />

      <PageMetadata
        title="Storage Solutions - KAGOF"
        description="KAGOF"
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
              Storage Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kagof offers storage solutions tailored for observability securing, optimizing, and governing telemetry throughout its lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {storageData.map((item, index) => (
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
