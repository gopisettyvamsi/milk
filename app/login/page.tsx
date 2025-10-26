'use client';

import { useEffect, useState } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Loader2, Stethoscope, Home } from 'lucide-react';
import PageMetadata from '@/components/PageMetaData';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
    const { data: session, status } = useSession();


    useEffect(() => {
    if (status === "loading") return; // Wait for the session to load
    
    if (session) {
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  }, [session, status, router]);


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
  
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
  
      if (res?.error) {
        setError("Invalid credentials");
        console.log(res.error);
        setIsLoading(false);
        return;
      }
  
      // Fetch updated session after sign-in
      const updatedSession = await getSession(); 
  
      if (updatedSession?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else if (updatedSession?.user?.role === "user") {
        router.push("/user/dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (error) {
      setError("An error occurred");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
 

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/user/dashboard' });
  };

  return (
    <>
      <PageMetadata
        title="Doctor Portal Login"
        description="Secure login and signup for doctors with Google or credentials"
        canonicalUrl="/admin/login"
      />

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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-6">Continue with Google or enter your details</p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-300"
              />
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

                            {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                Sign in
              </button>
            </form>

            {/* Or divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google login */}
   <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2 text-gray-600" />
              ) : (
                <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Signing in...' : 'Login with Google'}
            </button>
            {/* Link to signup/login */}
            <p className="mt-6 text-center text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-green-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Hero Image with Floating Baby */}
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
        
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
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
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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