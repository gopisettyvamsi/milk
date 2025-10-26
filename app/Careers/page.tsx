import React from 'react';
import Hero from '@/components/Hero';

import NavigationMenu from '@/components/NavigationMenu';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import PageMetadata from '@/components/PageMetaData';

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col">
      <NavigationMenu />
      <PageMetadata 
        title="Careers - KAGOF"
        description="KAGOF"
        keywords=""
        ogUrl="/"
        canonicalUrl="/"
      />
      <div className="px-4">
        <Hero />
        <ContactForm />
      </div>
      <Footer />
    </main>
  );
};

export default HomePage;