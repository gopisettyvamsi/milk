// app/terms/page.tsx

import React from 'react';
// import TechNavigation from '@/components/TechNavigation'; // Optional if needed
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';
import Link from 'next/link';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-2 sm:px-4 py-8  bg-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          {/* <p className="text-gray-600 mt-2">Last updated: March 15, 2025</p> */}
        </div>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>By accessing or using kagof&apos;s services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
            <p>kagof provides enterprise data services and AI-powered solutions, including:</p>
            <ul className="list-disc pl-6">
              <li>Data stream processing</li>
              <li>Storage solutions</li>
              <li>Observability pipeline</li>
              <li>Edge data collection</li>
              <li>Security and compliance services</li>
              <li>Managed services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Service Level Agreement</h2>
            <p>Our services are provided &quot;as is&quot; and &quot;as available.&quot; We strive to maintain high availability and performance according to our Service Level Agreement (SLA).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <ul className="list-disc pl-6">
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Ensure compliance with applicable laws and regulations</li>
              <li>Use services in accordance with acceptable use policies</li>
              <li>Maintain appropriate security measures</li>
              <li>Promptly report any security incidents</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>All intellectual property rights in our services remain the property of kagof. Users receive a limited license to use our services according to these terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Processing</h2>
            <p>We process data in accordance with:</p>
            <ul className="list-disc pl-6">
              <li>Our Privacy Policy</li>
              <li>Applicable data protection laws</li>
              <li>Data processing agreements</li>
              <li>Industry standards and best practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, kagof shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of any material changes and continued use of our services constitutes acceptance of the modified terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p>For questions about these Terms and Conditions, please contact us at:</p>
            <p className="mt-4">
              Email:{' '}
              <a href="mailto:shrss02@gmail.com" className="text-teal-600 hover:text-teal-700">
                shrss02@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditionsPage;
