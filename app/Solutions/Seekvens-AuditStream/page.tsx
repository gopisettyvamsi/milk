



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
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kagof AuditStream</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Compliance and audit toolkit with log replay and fine-grained retention policies. Enables secure, cost-effective long-term storage and rehydration of logs from <strong>Cribl</strong> Lake or S3 without losing searchability or context.
                        </p>
                    </div>

                    {/* Subheading */}
                    <div className="text-center mb-12">
                        <h3 className="text-xl text-teal-600 font-semibold uppercase tracking-wide">
                            Compliance, replay, and forensics accelerator
                        </h3>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* POSMonitor */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof ReplayPro</h4>
                            <p className="text-gray-600">
                                Pulls archived logs from <strong>S3</strong> or <strong>Cribl</strong> Lake and replays into SIEMs for retrospective analysis or compliance checks.
                            </p>
                        </div>

                        {/* OmniChannelLog */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-teal-50 transition">

                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kagof Retain360</h4>
                            <p className="text-gray-600">
                                Enables fine-grained retention by dataset (1 day to 10 years) — ensures the right data is stored in the right place, at the right cost.
                            </p>
                        </div>


                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

