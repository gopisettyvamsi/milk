"use client";
import React, { useState } from "react";
import { CheckCircle, Crown, Users, Award, Heart, ArrowRight, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import TopContactStrip from "@/components/TopContactStrip";
import Link from "next/link";

// Membership Card
const MembershipCard = ({ plan, isPopular = false, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      whileHover={{ scale: 1.05, y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden flex flex-col group ${isPopular ? "ring-4 ring-purple-400/50 scale-105 transform" : ""
        }`}
    >
      {/* Popular Tag */}
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
            <Crown className="w-4 h-4 mr-1" />
            Most Popular
            <Sparkles className="w-4 h-4 ml-1" />
          </div>
        </div>
      )}

      {/* Gradient Header Background */}
      <div className={`absolute top-0 left-0 right-0 h-32 ${isPopular
        ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20'
        : index === 0
          ? 'bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-teal-500/15'
          : 'bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-teal-500/15'
        }`}></div>

      {/* Plan Header */}
      <div className="relative p-8 text-center border-b border-white/20">
        <div className="flex justify-center mb-4">
          {isPopular ? (
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Crown className="w-8 h-8 text-white" />
            </div>
          ) : index === 0 ? (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        <h3 className={`text-3xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r transition-all duration-300 ${isPopular
          ? 'text-gray-800 group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text'
          : index === 0
            ? 'text-gray-800 group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text'
            : 'text-gray-800 group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text'
          }`}>
          {plan.name}
        </h3>
        <p className="text-gray-600 text-lg">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="p-8 text-center bg-gradient-to-br from-white/50 to-gray-50/50">
        <div className={`text-5xl font-bold mb-3 ${isPopular
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          : index === 0
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
          }`}>
          {plan.name === "Basic" ? (
            <span className="text-3xl text-blue-600">Members</span>
          ) : (
            <>
              ₹{plan.price.toLocaleString()}
              <span className="text-2xl font-normal text-gray-500 ml-2">
                /{plan.billing}
              </span>
            </>
          )}
        </div>

        {plan.originalPrice && (
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg text-gray-400 line-through">
              ₹{plan.originalPrice.toLocaleString()}
            </span>
            <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
              Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="px-8 py-6 flex-1 bg-gradient-to-br from-gray-50/30 to-white/50">
        <ul className="space-y-4">
          {plan.features.map((feature, featureIndex) => (
            <motion.li
              key={featureIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.2) + (featureIndex * 0.1) }}
              className="flex items-start group/feature"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover/feature:scale-110 transition-transform duration-200 ${isPopular
                ? 'bg-gradient-to-br from-purple-100 to-pink-100'
                : index === 0
                  ? 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  : 'bg-gradient-to-br from-green-100 to-emerald-100'
                }`}>
                <CheckCircle className={`w-4 h-4 ${isPopular
                  ? 'text-purple-600'
                  : index === 0
                    ? 'text-blue-600'
                    : 'text-green-600'
                  }`} />
              </div>
              <span className="text-gray-700 font-medium leading-relaxed group-hover/feature:text-gray-900 transition-colors duration-200">
                {feature}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="p-8 bg-gradient-to-br from-white/50 to-gray-50/50 border-t border-white/20">
        <Link
          href={plan.name === "Basic" ? "/events" : "/login"}
          className="block"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg group/button flex items-center justify-center ${isPopular
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              : index === 0
                ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              }`}
          >
            <Heart className="w-5 h-5 mr-2 group-hover/button:scale-110 transition-transform duration-200" />
            Choose {plan.name}
            <ArrowRight className="w-5 h-5 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
          </motion.button>
        </Link>

      </div>

      {/* Hover Glow Effect */}
      {isHovered && (
        <div className={`absolute inset-0 rounded-2xl opacity-20 pointer-events-none ${isPopular
          ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-purple-400'
          : index === 0
            ? 'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-400'
            : 'bg-gradient-to-br from-green-400 via-emerald-400 to-green-400'
          } blur-xl`}></div>
      )}
    </motion.div>
  );
};

// Membership Section
const MembershipSection = () => {
  const plans = [
    {
      id: 1,
      name: "Basic",
      description: "Perfect for beginners in Ayurvedic practice",
      price: 2999,
      billing: "month",
      features: [
        "Access to 2 foundational events per month",
        "Basic Ayurvedic course materials & guides",
        "KAGOF community forum access",
        "Email support from experts",
        "Monthly wellness newsletters",
        "Digital certificates for completed courses"
      ],
    },
    {
      id: 2,
      name: "Professional",
      description: "For practicing gynecologists & obstetricians",
      price: 3000,
      // originalPrice: 12000,
      billing: "lifetime",
      features: [
        "Unlimited access to all events & webinars",
        "Premium Ayurvedic research materials",
        "1-on-1 mentorship with senior practitioners",
        "Priority registration for conferences",
        "Professional certification programs",
        "Access to exclusive research papers",
        // "Case study database access",
        // "Direct consultation opportunities"
      ],
    },
    // {
    //   id: 3,
    //   name: "Institution",
    //   description: "For medical institutions & hospitals",
    //   price: 25000,
    //   billing: "month",
    //   features: [
    //     "Multiple practitioner access (up to 50 users)",
    //     "Custom Ayurvedic training programs",
    //     "On-site workshops & seminars",
    //     "Dedicated institutional support manager",
    //     "Bulk professional certificates",
    //     "Research collaboration opportunities",
    //     "Institutional branding on certificates",
    //     "Annual progress reporting & analytics"
    //   ],
    // },
  ];

  return (
    <>
      <TopContactStrip />
      <NavigationMenu />
      <section className="">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden  py-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob opacity-30"></div>
            <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 opacity-30"></div>
            <div className="absolute -bottom-8 left-40 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 opacity-30"></div>
          </div>

          <div className="relative z-10 container mx-auto px-2 sm:px-4">
            {/* Header Section */}
            <div className="text-center mb-16 animate-fade-in">
              {/* <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Crown className="w-4 h-4 mr-2" />
                KAGOF Membership Plans
              </div> */}
              <h2
                className="text-2xl md:text-5xl font-bold mb-9 pb-2 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                Membership Plans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Choose the perfect plan for your Ayurvedic gynecology learning journey and join our community of healthcare professionals
              </p>
            </div>

            {/* Plans Grid */}
            <div className="flex justify-center">
              <div className="grid gap-8 md:grid-cols-2 place-items-center items-stretch mb-16">
                {plans.map((plan, index) => (
                  <MembershipCard
                    key={plan.id}
                    plan={plan}
                    isPopular={index === 1}
                    index={index}
                  />
                ))}
              </div>
            </div>


            {/* Additional Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 mb-12"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  All Plans Include
                </h3>
                <p className="text-xl text-gray-600">
                  Every KAGOF membership comes with these essential benefits
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 hover:bg-blue-50/50 rounded-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Global Community</h4>
                  <p className="text-sm text-gray-600">Connect with practitioners worldwide</p>
                </div>

                <div className="text-center p-4 hover:bg-purple-50/50 rounded-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Certifications</h4>
                  <p className="text-sm text-gray-600">Recognized professional credentials</p>
                </div>

                <div className="text-center p-4 hover:bg-pink-50/50 rounded-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Patient Impact</h4>
                  <p className="text-sm text-gray-600">Improve women's healthcare outcomes</p>
                </div>

                <div className="text-center p-4 hover:bg-green-50/50 rounded-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Lifetime Access</h4>
                  <p className="text-sm text-gray-600">Continued learning resources</p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action Footer */}
            <div className="text-center animate-fade-in">
              <Link
                href="/user/dashboard" // 👈 change this to your target route
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Start Your KAGOF Journey Today</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Custom CSS */}
          <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MembershipSection;