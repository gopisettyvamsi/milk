"use client";
import React, { useState } from "react";
import { Award, Star, User, Heart, ArrowRight, Stethoscope, BookOpen, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

const DoctorCard = ({ doctor, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.3, duration: 0.8 }}
      whileHover={{ scale: 1.03, y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden flex flex-col group"
    >
      {/* Doctor Image Section */}
      <div className="relative p-8 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50">
        <div className="flex flex-col items-center">
          {/* Doctor Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-white/50">
              <User className="w-16 h-16 text-blue-600" />
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center shadow-lg">
              <Star className="w-4 h-4 text-amber-500 fill-current mr-1" />
              <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Details */}
      <div className="flex-1 p-8">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
            Dr. {doctor.name}
          </h3>
          <p className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {doctor.specialization}
          </p>
          <p className="text-gray-600 font-medium">{doctor.experience}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{doctor.certifications}</div>
            <div className="text-xs text-gray-600 font-medium">Certifications</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <Stethoscope className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{doctor.patients}+</div>
            <div className="text-xs text-gray-600 font-medium">Patients</div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-green-600" />
            Specialties
          </h4>
          <div className="flex flex-wrap gap-2">
            {doctor.specialties.map((specialty, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 rounded-full text-xs font-medium border border-green-200"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
            <MapPin className="w-4 h-4 mr-3 text-blue-600" />
            <span className="text-sm">{doctor.location}</span>
          </div>
          <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200">
            <Phone className="w-4 h-4 mr-3 text-green-600" />
            <span className="text-sm">{doctor.phone}</span>
          </div>
          <div className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200">
            <Mail className="w-4 h-4 mr-3 text-purple-600" />
            <span className="text-sm">{doctor.email}</span>
          </div>
        </div>

        {/* Full Rating Display */}
        <div className="flex items-center justify-center mb-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="flex text-amber-400 mr-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(doctor.rating) ? "fill-current" : ""
                } hover:scale-110 transition-transform duration-200`}
              />
            ))}
          </div>
          <span className="font-semibold text-amber-700">
            {doctor.rating} ({doctor.reviews} reviews)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-8 bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-t border-white/20">
        <div className="flex space-x-3">
          <button className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 flex items-center justify-center group/btn">
            <Calendar className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            View Profile
          </button>
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn flex items-center justify-center">
            <Heart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            Book Appointment
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-10 pointer-events-none blur-xl"></div>
      )}
    </motion.div>
  
  );
};

// Main Doctors Section
const DoctorsSection = () => {
  const doctors = [
    {
      id: 1,
      name: "Priya Sharma",
      specialization: "Reproductive Ayurveda Specialist",
      experience: "15+ years in Ayurvedic Gynecology",
      certifications: 12,
      rating: 4.9,
      reviews: 245,
      patients: 1200,
      location: "Hyderabad, Telangana",
      phone: "+91 9876543210",
      email: "dr.priya@kagof.org",
      specialties: ["PCOS Treatment", "Fertility Enhancement", "Menstrual Disorders", "Herbal Therapy"]
    },
    {
      id: 2,
      name: "Meera Krishnan",
      specialization: "Prenatal & Postnatal Care Expert",
      experience: "20+ years in Women's Health",
      certifications: 15,
      rating: 4.8,
      reviews: 312,
      patients: 1800,
      location: "Chennai, Tamil Nadu",
      phone: "+91 9876543211",
      email: "dr.meera@kagof.org",
      specialties: ["Pregnancy Care", "Postpartum Recovery", "Lactation Support", "Ayurvedic Nutrition"]
    },
    {
      id: 3,
      name: "Kavitha Reddy",
      specialization: "Women's Wellness & Hormonal Health",
      experience: "12+ years in Ayurvedic Practice",
      certifications: 10,
      rating: 4.7,
      reviews: 189,
      patients: 950,
      location: "Bangalore, Karnataka",
      phone: "+91 9876543212",
      email: "dr.kavitha@kagof.org",
      specialties: ["Hormonal Imbalance", "Menopause Management", "Stress Relief", "Yoga Therapy"]
    },
    {
      id: 4,
      name: "Anita Gupta",
      specialization: "Pediatric Ayurveda & Child Care",
      experience: "18+ years in Mother & Child Health",
      certifications: 14,
      rating: 4.9,
      reviews: 267,
      patients: 1500,
      location: "Mumbai, Maharashtra",
      phone: "+91 9876543213",
      email: "dr.anita@kagof.org",
      specialties: ["Child Development", "Immunotherapy", "Growth Disorders", "Ayurvedic Pediatrics"]
    }
  ];

  return (
    <section id="doctors" className="">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob opacity-30"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 opacity-30"></div>
        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 opacity-30"></div>
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
            <Stethoscope className="w-4 h-4 mr-2" />
            Meet Our Expert Doctors
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Expert Doctors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our distinguished team of Ayurvedic gynecologists and obstetricians dedicated to advancing women's healthcare through traditional wisdom and modern expertise
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid gap-8 lg:grid-cols-2 grid-cols-1 mb-16">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Impact
            </h3>
            <p className="text-xl text-gray-600">
              Together, our doctors have transformed thousands of lives
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 hover:bg-blue-50/50 rounded-xl transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                5,450+
              </div>
              <p className="text-gray-600 font-medium">Patients Treated</p>
            </div>
            
            <div className="text-center p-6 hover:bg-purple-50/50 rounded-xl transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                51
              </div>
              <p className="text-gray-600 font-medium">Total Certifications</p>
            </div>
            
            <div className="text-center p-6 hover:bg-green-50/50 rounded-xl transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                65+
              </div>
              <p className="text-gray-600 font-medium">Years Combined Experience</p>
            </div>
            
            <div className="text-center p-6 hover:bg-amber-50/50 rounded-xl transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                4.8
              </div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
            <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span>Join Our Medical Team</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
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
  );
};

export default DoctorsSection;