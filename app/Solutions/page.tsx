"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, ShieldCheck, Factory, ShoppingCart, Server } from "lucide-react";

const solutionsData = [
    {
        href: "/Solutions/Kagof-LogHub",
        icon: <Server className="w-6 h-6 text-blue-600" />,
        title: "Kagof LogHub",
        description: "Unified observability pipeline for log ingestion, enrichment, and routing.",
        bgColor: "bg-blue-100"
    },
    {
        href: "/Solutions/Kagof-StoreSight",
        icon: <ShoppingCart className="w-6 h-6 text-indigo-600" />,
        title: "Kagof StoreSight",
        description: "Retail and CPG observability across POS, inventory, and digital channels.",
        bgColor: "bg-indigo-100"
    },
    {
        href: "/Solutions/Kagof-FactoryPulse",
        icon: <Factory className="w-6 h-6 text-green-600" />,
        title: "Kagof FactoryPulse",
        description: "Real-time OT/IT integration and anomaly detection for smart manufacturing.",
        bgColor: "bg-green-100"
    },
    {
        href: "/Solutions/Kagof-AuditStream",
        icon: <ShieldCheck className="w-6 h-6 text-yellow-600" />,
        title: "Kagof AuditStream",
        description: "Log replay, retention, and compliance engine for security and governance.",
        bgColor: "bg-yellow-100"
    },
    {
        href: "/Solutions/Kagof-InsightAI",
        icon: <Brain className="w-6 h-6 text-pink-600" />,
        title: "Kagof InsightAI",
        description: "AI-augmented observability with natural language pipelines and root cause intelligence.",
        bgColor: "bg-pink-100"
    },
    {
        href: "/Solutions/Kagof-FHIRBridge",
        icon: <Activity className="w-6 h-6 text-red-600" />,
        title: "Kagof FHIRBridge",
        description: "Real-time HL7, EDI, CDA, and FHIR conversion for healthcare interoperability.",
        bgColor: "bg-red-100"
    }
];

export default function Business() {
    const router = useRouter();

    return (
        <section>
            <NavigationMenu />
            <PageMetadata
                title="Business - KAGOF"
                description="KAGOF"
                keywords=""
                ogUrl="/"
                canonicalUrl="/"
            />

            <div>
                <div className="w-full h-64 md:h-96 relative bg-gray-200">
                    <Image
                        src="/banners/solutions_banner.jpg"
                        alt="Edvenswa Team in Office"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                <section className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <div className="text-center my-2 px-4">
                                <h2 className="inline-block uppercase tracking-wider text-teal-600 font-bold px-4 py-2 text-lg md:text-xl">
                                    Solutions
                                </h2>

                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Empowering enterprises with scalable data & AI solutions
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {solutionsData.map((solution, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer transition-all duration-300 hover:scale-105"
                                    onClick={() => router.push(solution.href)}
                                >
                                    <Card className="h-full hover:shadow-lg">
                                        <CardHeader>
                                            <div className={`w-12 h-12 ${solution.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                                {solution.icon}
                                            </div>
                                            <CardTitle>{solution.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>
                                                {solution.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

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
            </div>
        </section>
    );
}