"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import Link from 'next/link';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Globe, TrendingUp, Database, Shield, Zap } from "lucide-react";

const servicesData = [
    {
        icon: <Database className="w-6 h-6 text-teal-600" />,
        title: "Data Stream Processing",
        description:
            "Route, filter, and transform data in motion with advanced stream processing capabilities powered by <strong>Cribl</strong> Stream.",
        bgColor: "bg-teal-100",
    },
    {
        icon: <Zap className="w-6 h-6 text-blue-600" />,
        title: "Storage Solutions",
        description:
            <p>End-to-end implementation and optimization of your <strong>Snowflake</strong> data cloud, from architecture to automation.</p>,
        bgColor: "bg-blue-100",
    },
    {
        icon: <TrendingUp className="w-6 h-6 text-green-600" />,
        title: "Observability Pipeline",
        description:
            "Reduce costs and improve data quality with intelligent observability pipelines that process and route machine data at scale.",
        bgColor: "bg-green-100",
    },
    {
        icon: <Shield className="w-6 h-6 text-purple-600" />,
        title: "Edge Data Collection",
        description:
            "Collect and process data at the edge with <strong>Cribl</strong> Edge, reducing latency and bandwidth costs while ensuring data quality.",
        bgColor: "bg-purple-100",
    },
    {
        icon: <Globe className="w-6 h-6 text-orange-600" />,
        title: "Security & Compliance",
        description:
            "Implement robust security controls and maintain compliance with industry regulations while managing sensitive data.",
        bgColor: "bg-orange-100",
    },
    {
        icon: <CheckCircle className="w-6 h-6 text-red-600" />,
        title: "Managed Services",
        description:
            "24/7 monitoring, maintenance, and optimization of your data infrastructure to ensure peak performance and reliability.",
        bgColor: "bg-red-100",
    },
    {
        // href: "/Services/data-pipeline",
        icon: <Database className="w-6 h-6 text-teal-600" />,
        title: "Data Pipeline Creation",
        description: "Build robust, scalable data pipelines that seamlessly integrate with your existing infrastructure and ensure reliable data flow across your organization.",
        bgColor: "bg-teal-100"
    },
    {
        // href: "/Services/design-validation",
        icon: <Zap className="w-6 h-6 text-blue-600" />,
        title: "Design Validation",
        description: "Validate your data architecture and AI models with comprehensive testing frameworks to ensure optimal performance and reliability.",
        bgColor: "bg-blue-100"
    },
    {
        // href: "/Services/predictive-analytics",
        icon: <TrendingUp className="w-6 h-6 text-green-600" />,
        title: "Predictive Analytics",
        description: "Leverage advanced machine learning algorithms to predict trends, identify opportunities, and make data-driven decisions for your business.",
        bgColor: "bg-green-100"
    },
    {
        // href: "/Services/data-integration",
        icon: <Shield className="w-6 h-6 text-purple-600" />,
        title: "Data Integration",
        description: "Seamlessly integrate data from multiple sources and formats to create a unified, comprehensive view of your business operations.",
        bgColor: "bg-purple-100"
    },
    {
        // href: "/Services/scada-controls",
        icon: <Globe className="w-6 h-6 text-orange-600" />,
        title: "Scada & Controls",
        description: "Implement advanced SCADA systems and industrial controls for real-time monitoring and automated decision-making in industrial environments.",
        bgColor: "bg-orange-100"
    },
    {
        // href: "/Services/project-services",
        icon: <CheckCircle className="w-6 h-6 text-red-600" />,
        title: "Project Services",
        description: "End-to-end project management for complex data initiatives, ensuring timely delivery and successful implementation of your data strategy.",
        bgColor: "bg-red-100"
    },

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
                        src="/banners/services_logo.jpg"
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
                                    Services
                                </h2>

                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Comprehensive data and AI solutions tailored to your enterprise needs
                            </p>
                        </div>

                        {/* <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {servicesData.map((service, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer transition-all duration-300 hover:scale-105"
                                // onClick={() => router.push(service.href)}
                                >
                                    <Card className="h-full hover:shadow-lg">
                                        <CardHeader>
                                            <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                                {service.icon}
                                            </div>
                                            <CardTitle>{service.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>
                                                {service.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div> */}

                        <div className="grid md:grid-cols-3 gap-8 mx-auto items-stretch">
                            <Link href={"/DataPipelineCreation"}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                            <Database className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <CardTitle>Data Pipeline Creation</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>
                                            Build robust, scalable data pipelines that seamlessly integrate with your existing infrastructure and ensure reliable data flow across your organization.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href={"/PredictiveAnalytics"}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                            <TrendingUp className="w-6 h-6 text-green-600" />
                                        </div>
                                        <CardTitle>Predictive Analytics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>
                                            Leverage advanced machine learning algorithms to predict trends, identify opportunities, and make data-driven decisions for your business.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href={"/DataIntegration"}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                            <Shield className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <CardTitle>Data Integration</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>
                                            Seamlessly integrate data from multiple sources and formats to create a unified, comprehensive view of your business operations.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href={"/AIMachineLearning"}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                            <Globe className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <CardTitle>AI & Machine Learning</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>
                                            Our expertise in prompt engineering vector search and structured telemetry lets us create ML experiences that are explainable domain aware and business relevant.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href={"/DataStreamProcessing"}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                            <Database className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <CardTitle>Data Stream Processing</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>
                                            Route, filter, and transform data in motion with advanced stream processing capabilities powered by <strong>Cribl</strong> Stream.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href={"/StorageSolutions"}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                            <Zap className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <CardTitle>Storage Solutions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>
                                            End-to-end implementation and optimization of your <strong>Snowflake</strong> data cloud, from architecture to automation.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                            {/* 
            <Link href={"/ObservabilityPipeline"}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Observability Pipeline</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    Reduce costs and improve data quality with intelligent observability pipelines that process and route machine data at scale.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href={"/EdgeDataCollection"}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Edge Data Collection</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    Collect and process data at the edge with Cribl Edge, reducing latency and bandwidth costs while ensuring data quality.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href={"/SecurityandCompliance"}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle>Security & Compliance</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    Implement robust security controls and maintain compliance with industry regulations while managing sensitive data.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link> */}

                            <Link href={"/ManagedServices"}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                            <CheckCircle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <CardTitle>Managed Services</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>
                                            24/7 monitoring, maintenance, and optimization of your data infrastructure to ensure peak performance and reliability.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
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