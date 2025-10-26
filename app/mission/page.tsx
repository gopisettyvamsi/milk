"use client"
import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';




const MissionPage = () => {
  return (
    <>
         <NavigationMenu />
         <div className="w-full h-64 md:h-96 relative bg-gray-200">
                    <Image
                        src="/Bussiness.jpg"
                        alt=""
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
            <PageMetadata 
        title="Business - KAGOF"
        description="KAGOF"
        keywords=""
        ogUrl="/"
        canonicalUrl="/"
      />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Header Widget */}
        
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-center my-4 px-4">
                    <h2 className="inline-block uppercase tracking-wider text-gray-800 font-semibold bg-gray-200 px-4 py-2 text-lg md:text-xl">
                        Our Mission
                    </h2>
                </div>
              </div>
            </div>

           

        {/* Main Mission Widget */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Our mission is to <strong>simplify, secure, and optimize</strong> enterprise data pipelines by delivering 
              <strong>intelligent integrations</strong> and <strong>deep observability</strong> across the entire data lifecycle, 
              whether in motion or at rest. As a trusted systems integration partner, we enable organizations to achieve 
              <strong>real-time analytics</strong>, <strong>intelligent automation</strong>, and <strong>cost-effective optimization</strong>, 
              transforming data into a strategic asset. Our solutions combine <strong>AI-powered intelligence</strong> with 
              <strong>best-in-class observability</strong> to drive actionable insights, enhance control, and accelerate 
              enterprise agility in a data-driven world.
            </p>
          </div>
        </div>

        {/* Core Capabilities Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Simplify & Secure
            </h3>
            <p className="text-gray-600 text-sm">
              Streamlined data pipelines with enterprise-grade security
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Deep Observability
            </h3>
            <p className="text-gray-600 text-sm">
              Complete visibility across the entire data lifecycle
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              AI-Powered Intelligence
            </h3>
            <p className="text-gray-600 text-sm">
              Intelligent automation and actionable insights
            </p>
          </div>
        </div>

        {/* Partnership & Value Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trusted Partnership
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Systems Integration Partner
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Real-time Analytics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Cost-effective Optimization
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Strategic Outcomes
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Actionable Insights
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Enhanced Control
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Enterprise Agility
              </li>
            </ul>
          </div>
        </div>

        {/* Data Transformation Widget */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
            Transforming Data into Strategic Assets
          </h3>
          <p className="text-gray-700 text-center">
            We enable organizations to harness the full potential of their data through intelligent integrations 
            and comprehensive observability in a data-driven world.
          </p>
        </div>

        {/* Tagline Widget */}
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Because when you Seek More from Your Data
          </h2>
          <p className="text-blue-700 text-lg font-medium">
            you achieve more for your business
          </p>
        </div>
      </div>
    </div>
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
           <Footer /></>
  );
};

export default MissionPage;