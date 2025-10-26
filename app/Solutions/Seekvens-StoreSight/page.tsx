



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
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kagof StoreSight</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Unified retail observability across POS, e-commerce, and inventory systems. Detects fraud, enhances CX, and streamlines operations through real-time log enrichment, edge processing, and centralized analytics—all powered by <strong>Cribl</strong> pipelines.
                        </p>
                    </div>

                    {/* Subheading */}
                    <div className="text-center mb-12">
                        <h3 className="text-xl text-teal-600 font-semibold uppercase tracking-wide">
                            Retail & CPG Log Intelligence Solution
                        </h3>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* POSMonitor */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof POSMonitor</h4>
                            <p className="text-gray-600">
                                Captures logs from POS terminals, correlates with transaction metadata, and routes for fraud detection or operational alerts.
                            </p>
                        </div>

                        {/* OmniChannelLog */}
                      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof OmniChannelLog</h4>
                            <p className="text-gray-600">
                                Unifies web, app, and in-store telemetry — transforms for behavior analytics, performance dashboards, and CX optimization.
                            </p>
                        </div>

                        {/* StoreSight (Core Platform) */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof StoreSight</h4>
                            <p className="text-gray-600">
                                Centralized platform for retail observability — integrates <strong>Cribl</strong> pipelines for enriched logs, anomaly detection, and smarter retail operations.
                            </p>
                        </div>

                        {/* InventoryPulse */}
                      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof InventoryPulse</h4>
                            <p className="text-gray-600">
                                Monitors warehouse/stock systems in real time, enriching logs with product metadata and routing anomalies to alerting systems.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

