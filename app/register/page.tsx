'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Loader2, Stethoscope, Home, User, Calendar, Phone, CheckCircle, AlertCircle, X, ChevronDown } from 'lucide-react';
import PageMetadata from '@/components/PageMetaData';
import React from 'react';

// Types
interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface StethoscopeNotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

// Custom Notification Component
const StethoscopeNotification: React.FC<StethoscopeNotificationProps> = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-md w-full mx-4 ${bgColor} border rounded-lg shadow-lg p-4 animate-slide-in`}>
      <div className="flex items-start">
        {/* Hanging Stethoscope Icon */}
        <div className="flex-shrink-0 mr-3">
          <div className="relative">
            <Stethoscope className={`w-6 h-6 ${iconColor} animate-gentle-swing`} />
            {/* Small status indicator */}
            <div className="absolute -top-1 -right-1">
              {isSuccess ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
        
        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${textColor}`}>
            {isSuccess ? 'Registration Successful!' : 'Registration Failed'}
          </p>
          <p className={`text-sm mt-1 ${textColor.replace('800', '700')}`}>
            {message}
          </p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`ml-4 flex-shrink-0 ${textColor} hover:${textColor.replace('800', '600')} transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Modern Date Picker Component
const ModernDatePicker = ({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Generate options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Update parent when values change
  React.useEffect(() => {
    if (day && month && year) {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onChange(formattedDate);
    }
  }, [day, month, year, onChange]);

  // Initialize from value prop
  React.useEffect(() => {
    if (value) {
      const [yearPart, monthPart, dayPart] = value.split('-');
      setYear(yearPart);
      setMonth(monthPart);
      setDay(dayPart);
    }
  }, []);


  return (
    <div className="relative">
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default function DoctorSignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dobError, setDobError] = useState('');


  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 8000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setNotification(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
    };

    try {
      // First, check if email already exists
      const emailCheckRes = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: payload.email }),
      });

      if (emailCheckRes.ok) {
        const emailCheckData = await emailCheckRes.json();
        
        if (emailCheckData.exists) {
          showNotification('error', `Email ${payload.email} is already registered. Please use a different email address.`);
          setError('This email is already registered. Please use another email address.');
          return;
        }
      }

      // If email doesn't exist, proceed with registration
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        
        // Handle specific error cases
        if (res.status === 409) {
          // Conflict - email already exists
          showNotification('error', `Email ${payload.email} is already registered. Please use a different email address.`);
          setError('This email is already registered. Please use another email address.');
          return;
        }
        
        throw new Error(errorData.message || 'Failed to register');
      }

      const data = await res.json();

      showNotification('success', `Registration successful! A temporary password has been sent to ${payload.email}. Please check your inbox.`);
      
      // Redirect after showing notification
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle different types of errors
      if (err.message?.includes('email') || err.message?.includes('duplicate')) {
        showNotification('error', `Email ${payload.email} is already registered. Please use a different email address.`);
        setError('This email is already registered. Please use another email address.');
      } else {
        showNotification('error', 'Registration failed. Please check your information and try again.');
        setError('Unexpected error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMetadata
        title="Doctor Portal Sign Up"
        description="Create your doctor account to access the portal"
        canonicalUrl="/admin/signup"
      />

      {/* Notification */}
      {notification && (
        <StethoscopeNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="min-h-screen flex relative">
        {/* Home Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-50 bg-white/90 backdrop-blur-sm hover:bg-white/100 text-green-600 hover:text-green-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <Home className="w-6 h-6" />
        </Link>

        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-16 relative z-10">
          <div className="max-w-md w-full mx-auto">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <Stethoscope className="w-8 h-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-green-700">KAGOF</h1>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600 mb-6">Fill in your details to get started</p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
              </div>
              
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-300"
              />

              <button
                type="submit"
                disabled={isLoading || !!dobError}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                Sign Up
              </button>
            </form>

            {/* Link to login */}
            <p className="mt-6 text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - keep your existing hero bubble section */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white relative overflow-hidden">
          <img
            src="/baby.jpg"
            alt="Healthcare background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-800/70 to-green-700/60"></div>
          
          {/* Floating Baby in Water Bubble */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Main Bubble */}
            <div className="relative animate-float">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-300/20 blur-xl scale-110 animate-pulse-slow"></div>
              
              {/* Water bubble */}
              <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-cyan-100/40 via-blue-200/30 to-teal-200/40 backdrop-blur-md border border-white/30 shadow-2xl overflow-hidden">
                {/* Water effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-300/20 to-transparent animate-wave"></div>
                
                {/* Baby Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden animate-gentle-bob shadow-2xl border-4 border-white/20">
                    <img 
                      src="/baby.jpg" 
                      alt="Baby in water bubble" 
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                    />
                    {/* Overlay for water effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-200/20 via-transparent to-blue-200/10 pointer-events-none"></div>
                  </div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-float-delay-1"></div>
                <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-float-delay-2"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-200/60 rounded-full animate-float-delay-3"></div>
              </div>
            </div>
            
            {/* Smaller bubbles around */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-200/20 to-blue-300/10 backdrop-blur-sm animate-float-small"></div>
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-teal-200/20 to-cyan-300/10 backdrop-blur-sm animate-float-small-delay"></div>
            <div className="absolute top-1/2 right-1/6 w-8 h-8 rounded-full bg-gradient-to-br from-blue-200/25 to-cyan-300/15 backdrop-blur-sm animate-float-tiny"></div>
          </div>

          {/* Optional text overlay */}
          <div className="relative z-10 p-12 flex flex-col justify-end max-w-lg">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Nurturing Life, Embracing Care
            </h3>
            <p className="text-lg text-green-100/90">
              Where every heartbeat matters and every life is precious
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-small {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(10px); }
          66% { transform: translateY(-5px) translateX(-8px); }
        }
        
        @keyframes float-small-delay {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(-12px); }
          66% { transform: translateY(-18px) translateX(6px); }
        }
        
        @keyframes float-tiny {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes gentle-bob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        
        @keyframes gentle-swing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-small {
          animation: float-small 8s ease-in-out infinite;
        }
        
        .animate-float-small-delay {
          animation: float-small-delay 7s ease-in-out infinite 2s;
        }
        
        .animate-float-tiny {
          animation: float-tiny 4s ease-in-out infinite 1s;
        }
        
        .animate-gentle-bob {
          animation: gentle-bob 4s ease-in-out infinite;
        }
        
        .animate-gentle-swing {
          animation: gentle-swing 3s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-float-delay-1 {
          animation: float 5s ease-in-out infinite 1s;
        }
        
        .animate-float-delay-2 {
          animation: float 4s ease-in-out infinite 2s;
        }
        
        .animate-float-delay-3 {
          animation: float 6s ease-in-out infinite 3s;
        }
      `}</style>
    </>
  );
}