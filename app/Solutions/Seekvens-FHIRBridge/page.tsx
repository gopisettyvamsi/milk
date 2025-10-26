



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
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kagof FHIRBridge</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Real-time conversion of HL7, EDI, and CDA formats into FHIR resources. Unlocks healthcare interoperability and analytics by delivering structured, standards-compliant clinical and claims data into platforms like <strong>Snowflake</strong> or <strong>Health DataHubs</strong>.
                        </p>
                    </div>

                    {/* Subheading */}
                    <div className="text-center mb-12">
                        <h3 className="text-xl text-teal-600 font-semibold uppercase tracking-wide">
                            Health data integration & normalization framework
                        </h3>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* POSMonitor */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof HL7 Adapter</h4>
                            <p className="text-gray-600">
                                Parses HL7v2 messages in-stream and converts them into normalized FHIR bundles, ready for ingestion into a Health DataHub or <strong>Snowflake</strong>.
                            </p>
                        </div>

                        {/* OmniChannelLog */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof ClaimsSync</h4>
                            <p className="text-gray-600">
                                Converts EDI X12 837/835 claims into FHIR Claims or ExplanationOfBenefit resources. Used by payers for analytics and AI modeling.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof CCD Translator</h4>
                            <p className="text-gray-600">
                                Converts CDA/CCD XML into structured FHIR resources — ideal for care coordination and interoperability across clinical platforms.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof SnowPipe</h4>
                            <p className="text-gray-600">
                                Enriched, structured FHIR data flows into <strong>Snowflake</strong> using <strong>Cribl</strong>’s event breaker, batching, and compression for analytics-ready storage.
                            </p>
                        </div>


                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

