import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 my-2 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="logo-container relative p-2 transform transition-transform duration-300 hover:scale-105">
            <Image
              src="/edvenswa-logo-150x150.png"
              alt="Edvenswa Logo"
              width={120} 
              height={40} 
              className="rounded-md hover:shadow-lg transition-shadow duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-800 hover:text-brand-teal">
            Business
          </Link>
          <Link href="/resources" className="text-gray-800 hover:text-brand-teal">
            Resources
          </Link>
          <Link href="/careers" className="text-gray-800 hover:text-brand-teal">
            Careers
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-brand-teal">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-brand-teal">
            Contact Us
          </Link>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-800 hover:text-brand-teal py-2">
                Business
              </Link>
              <Link href="/resources" className="text-gray-800 hover:text-brand-teal py-2">
                Resources
              </Link>
              <Link href="/careers" className="text-gray-800 hover:text-brand-teal py-2">
                Careers
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-brand-teal py-2">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-800 hover:text-brand-teal py-2">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
