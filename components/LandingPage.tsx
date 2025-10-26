"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Menu,
  Shield,
  Zap,
  Clock,
  Users,
  Code,
  Heart,
} from "lucide-react";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const LandingPage = () => {
  // const [openSubmenu, setOpenSubmenu] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // console.log(data);

  const menuItems = [
    {
      title: "Products",
      items: ["Software", "Solutions", "Platforms", "Tools"],
    },
    {
      title: "Services",
      items: ["Consulting", "Development", "Support", "Training"],
    },
    {
      title: "Company",
      items: ["About", "Careers", "Blog", "Contact"],
    },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Enterprise Security",
      description: "Bank-grade security protocols to protect your data",
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "Optimized performance for quick load times",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "24/7 Support",
      description: "Round-the-clock technical assistance",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Team Collaboration",
      description: "Built for teams of all sizes",
    },
    {
      icon: <Code className="w-8 h-8 text-blue-600" />,
      title: "Custom Development",
      description: "Tailored solutions for your needs",
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      title: "User-Friendly",
      description: "Intuitive interface for better experience",
    },
  ];

  const mainMenuItems = ["Home", "About", "Products", "Services", "Contact"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-sm">
          <div>📞 Contact: (555) 123-4567</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-300">
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              LOGO
            </div>

            {/* Main Menu - Right Aligned */}
            <div className="hidden md:flex items-center space-x-8">
              {mainMenuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
              {/*<button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                Sign In
              </button> */}

              {session ? (
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            {mainMenuItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                {item}
              </a>
            ))}
            <div className="p-4 space-y-2">
              {/* <button className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                Sign In
              </button> */}
              {session ? (
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

  


      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Transform Your Ideas Into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Digital Reality
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create stunning digital experiences with our modern solutions and
              expert team.
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2">
                Get Started <ArrowRight size={20} />
              </button>
              <button className="px-8 py-3 text-blue-600 border border-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the features that make our platform stand out
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center bg-blue-600 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-8 text-blue-100">
              Join thousands of satisfied customers today
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2024 Your Company. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {menuItems.map((menu) => (
                <a
                  key={menu.title}
                  href={`#${menu.title.toLowerCase()}`}
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {menu.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
