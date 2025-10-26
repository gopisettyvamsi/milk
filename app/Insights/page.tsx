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
import { CheckCircle, Users, Globe, TrendingUp, Database, Shield, Zap, Book, Video } from "lucide-react";

const insightsData = [
    {
        href: "/ThoughtLeadership",
        icon: <Globe className="w-6 h-6 text-indigo-600" />,
        title: "Thought Leadership",
        description: "Insights and expertise to navigate the future of AI and data innovation from strategic trends to disruptive technologies.",
        bgColor: "bg-indigo-100"
    },
    {
        href: "/ClientImpactStories",
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        title: "Client Impact Stories",
        description: "From strategy to execution, our work drives tangible results. Discover how we help organizations grow, adapt, and lead with confidence",
        bgColor: "bg-green-100"
    },
    {
        href: "/blog",
        icon: <Book className="w-6 h-6 text-yellow-600" />,
        title: "Blog",
        description: "Your go to source for the latest in AI and data engineering news, tutorials, and thought provoking commentary.",
        bgColor: "bg-yellow-100"
    },
    {
        href: "/events",
        icon: <Video className="w-6 h-6 text-red-600" />,
        title: "Events",
        description: "On-demand sessions exploring AI innovation, observability best practices, and deep dives into real-world architectures.",
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
                        src="/banners/insights_banner.jpg"
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
                                    Insights
                                </h2>
                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Actionable insights and AI perspectives for the modern enterprise
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {insightsData.map((insight, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer transition-all duration-300 hover:scale-105"
                                    onClick={() => router.push(insight.href)}
                                >
                                    <Card className="h-full hover:shadow-lg">
                                        <CardHeader>
                                            <div className={`w-12 h-12 ${insight.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                                {insight.icon}
                                            </div>
                                            <CardTitle>{insight.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>
                                                {insight.description}
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
                {/* Footer */}
                <Footer />
            </div>
        </section>
    );
}