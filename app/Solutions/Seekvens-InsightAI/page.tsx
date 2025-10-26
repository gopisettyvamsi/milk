



"use client"
import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Globe, TrendingUp, Database, Shield, Zap } from "lucide-react";


export default function Business() {
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
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto max-w-7xl">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kagof InsightAI</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            AI-augmented pipelines with natural language automation, log summarization, and root cause detection. Speeds triage, enriches context, and simplifies pipeline development using LLMs—empowering observability and SecOps teams to scale smarter.
                        </p>
                    </div>

                    {/* Subheading */}
                    <div className="text-center mb-12">
                        <h3 className="text-xl text-teal-600 font-semibold uppercase tracking-wide">
                            AI-augmented observability and enrichment
                        </h3>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* POSMonitor */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof NLQ Assistant</h4>
                            <p className="text-gray-600">
                                Use natural language to build <strong>Cribl</strong> pipelines — e.g., "mask IPs and sample 10% from CrowdStrike logs."
                            </p>
                        </div>

                        {/* OmniChannelLog */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof InsightAI Summarizer</h4>
                            <p className="text-gray-600">
                                Inline LLM summarization of verbose logs into structured fields for better SIEM ingestion and searchability.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof RootCauseX</h4>
                            <p className="text-gray-600">
                                Uses AI to cluster related events and surface probable root causes for anomalies in logs, metrics, and traces.
                            </p>
                        </div>


                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

