"use client";
import React, { useState, useEffect } from 'react';
import { Heart, Users, BookOpen, Award, ArrowRight, Play, Sparkles, Globe, TrendingUp, Leaf } from 'lucide-react';

const KAGOFHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Empowering Women's Health",
      subtitle: "Through Ancient Wisdom & Modern Science",
      description: "Join the leading community of Ayurvedic gynecologists and obstetricians advancing holistic women's healthcare worldwide.",
      gradient: "from-rose-10 via-pink-10 to-orange-10",
      backgroundImage: "/banner1.jpg"
    },
    {
      title: "Connect. Learn. Transform.",
      subtitle: "Building the Future of Ayurvedic Gynecology",
      description: "Access exclusive research, connect with global experts, and be part of revolutionary healthcare practices.",
      gradient: "from-emerald-10 via-teal-10 to-cyan-10",
      backgroundImage: "/banner2.png"
    },
    {
      title: "Your Journey Starts Here",
      subtitle: "Join 5000+ Healthcare Professionals",
      description: "Become part of KAGOF's mission to integrate traditional Ayurvedic practices with contemporary women's healthcare.",
      gradient: "from-purple-10 via-lavender-10 to-indigo-10",
      backgroundImage: "/banner3.jpg"
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, number: "5000+", label: "Members Worldwide" },
    { icon: <BookOpen className="w-6 h-6" />, number: "500+", label: "Research Papers" },
    { icon: <Award className="w-6 h-6" />, number: "50+", label: "Countries" },
    { icon: <TrendingUp className="w-6 h-6" />, number: "98%", label: "Success Rate" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div className="relative flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-50 min-h-[500px] md:min-h-[420px] overflow-hidden">
      {/* Background Image Layers with Crossfade */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${slide.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
        </div>
      ))}

      {/* Soft Background Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} transition-opacity duration-1000 opacity-20`}>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-6 text-center">
        {/* Main Hero Content */}
        <div className="max-w-5xl mx-auto">
          {/* Hero Title */}
          <div className="mb-8" key={currentSlide}>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white animate-slide-fade-in" 
              style={{ 
                textShadow: '3px 3px 8px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.3)',
                animationDelay: '0.1s',
                letterSpacing: '-0.02em'
              }}
            >
              {currentSlideData.title}
            </h2>
            <p 
              className="text-xl md:text-2xl lg:text-3xl mb-8 text-white font-semibold animate-slide-fade-in" 
              style={{ 
                textShadow: '2px 2px 6px rgba(0,0,0,0.5), 0 0 15px rgba(0,0,0,0.2)',
                animationDelay: '0.3s',
                letterSpacing: '-0.01em'
              }}
            >
              {currentSlideData.subtitle}
            </p>
            <p 
              className="text-base md:text-lg lg:text-xl text-white max-w-3xl mx-auto leading-relaxed font-light animate-slide-fade-in" 
              style={{ 
                textShadow: '2px 2px 6px rgba(0,0,0,0.6), 0 0 15px rgba(0,0,0,0.3)',
                animationDelay: '0.5s',
                letterSpacing: '0.01em'
              }}
            >
              {currentSlideData.description}
            </p>
          </div>

          {/* CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-400">
            <button className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-emerald-200/50 flex items-center justify-center min-w-[200px]">
              <Leaf className="w-5 h-5 mr-2" />
              <span>Join Foundation</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div> */}
        </div>

        {/* Slide Indicators */}
        {/* <div className="flex justify-center space-x-2 mt-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-emerald-500 shadow-lg'
                  : 'bg-emerald-300/60 hover:bg-emerald-400/80'
                }`}
            />
          ))}
        </div> */}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-fade-in {
          animation: slide-fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-15px) rotate(180deg); 
            opacity: 0.7;
          }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-10px);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .bg-sage-50 {
          background-color: #f0f4f0;
        }
        
        .bg-cream-50 {
          background-color: #fefcf8;
        }
        
        .from-lavender-50 {
          --tw-gradient-from: #f3f4f6;
        }

        .text-lavender-200 {
          color: #e9d5ff;
        }

        .text-sage-300 {
          color: #86efac;
        }

        /* Responsive background image adjustments */
        @media (max-width: 640px) {
          .bg-cover {
            background-size: cover;
            background-position: center;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .bg-cover {
            background-size: cover;
            background-position: center;
          }
        }
        
        @media (min-width: 1025px) {
          .bg-cover {
            background-size: cover;
            background-position: center;
          }
        }
      `}</style>
    </div>
  );
};

export default KAGOFHeroSection;