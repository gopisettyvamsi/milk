



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
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kagof FactoryPulse</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Bridges OT/IT observability by ingesting and enriching industrial telemetry from protocols like Modbus and MQTT. Enables predictive maintenance and anomaly detection through structured data delivery into cloud analytics platforms.
                        </p>
                    </div>

                    {/* Subheading */}
                    <div className="text-center mb-12">
                        <h3 className="text-xl text-teal-600 font-semibold uppercase tracking-wide">
                            Smart manufacturing observability framework
                        </h3>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* POSMonitor */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof FactoryPulse OTBridge</h4>
                            <p className="text-gray-600">
                                Ingests SCADA and IoT telemetry (MQTT, OPC-UA, Modbus), enriches with plant metadata, and routes to <strong>Snowflake</strong>/<strong>Databricks</strong>.
                            </p>
                        </div>

                        {/* OmniChannelLog */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof FactoryPulse AnomalyLens</h4>
                            <p className="text-gray-600">
                                Detects OT anomalies with pre-built transformations and replay triggers — reducing downtime and maintenance cost.
                            </p>
                        </div>


                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

