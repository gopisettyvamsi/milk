"use client"
import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageMetadata from '@/components/PageMetaData';
import Image from 'next/image';
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton';

const VisionPage = () => {
  return (<>
  <NavigationMenu />
  <div className="w-full h-64 md:h-96 relative bg-gray-200">
                    <Image
                        src="/vision_b.jpg"
                        alt="Edvenswa Team in Office"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
    <div className="min-h-screen bg-gray-50 p-6">
        
            <PageMetadata 
        title="Business - Edvenswa Enterprises Website"
        description="Edvenswa Enterprises"
        keywords="Edvenswa Enterprises Software solutions, artificial intelligence, machine learning, business transformation, Edvenswa, AI consulting, enterprise AI"
        ogUrl="/"
        canonicalUrl="/"
      />
      <div className="container mx-auto">
        {/* Header Widget */}
       
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-center my-5 px-4">
                    <h2 className="inline-block uppercase tracking-wider text-gray-800 font-semibold bg-gray-200 px-4 py-2 text-lg md:text-xl">
                        Our Vision
                    </h2>
                </div>
              </div>
            </div>

            

        {/* Main Vision Widget */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              To empower enterprises with <strong>seamless observability and control</strong> over their data, 
              in motion and at rest, so they can unlock its full potential. Through <strong>intelligent automation</strong>, 
              <strong>advanced analytics</strong>, and <strong>continuous optimization</strong>, we strive to enhance 
              data security, operational efficiency, and scalable growth across the enterprise landscape.
            </p>
          </div>
        </div>

        {/* Key Focus Areas Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Data Observability
            </h3>
            <p className="text-gray-600 text-sm">
              Seamless control over data in motion and at rest
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Intelligent Automation
            </h3>
            <p className="text-gray-600 text-sm">
              Advanced analytics for continuous optimization
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Enterprise Growth
            </h3>
            <p className="text-gray-600 text-sm">
              Enhanced security and operational efficiency
            </p>
          </div>
        </div>

        {/* Tagline Widget */}
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Seek More from Your Data
          </h2>
          <p className="text-blue-700 text-lg">
            every day, in every way
          </p>
        </div>

        {/* Stats/Benefits Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Core Benefits
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Enhanced Data Security
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Operational Efficiency
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Scalable Growth
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Technology Focus
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Advanced Analytics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Continuous Optimization
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Intelligent Automation
              </li>
            </ul>
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
    </div>
     <Footer />
  </>);
};

export default VisionPage;