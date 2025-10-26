"use client";
import { useState,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function NavigationMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showEventsSubmenu, setShowEventsSubmenu] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [mobileBusinessSubmenuOpen, setMobileBusinessSubmenuOpen] =
    useState(false);
  const [mobileEventsSubmenuOpen, setMobileEventsSubmenuOpen] =
    useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showContactStrip, setShowContactStrip] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { data: session } = useSession();
  const role = session?.user?.role || "guest";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setMobileSubmenuOpen(false);
      setMobileBusinessSubmenuOpen(false);
      setMobileEventsSubmenuOpen(false);
    }
  };

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scrolling down
      setShowContactStrip(false);
    } else {
      // Scrolling up
      setShowContactStrip(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <div className=" sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">

  {/* Top Contact Strip */}
      {showContactStrip && (
        <div className="bg-[#009E60] border-b border-blue-100">
          <div className="container mx-auto px-2 sm:px-4 py-1.5 sm:py-2">
            <div className="flex justify-between items-center text-xs">
              {/* Left Side - Contact Info */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-1 text-white-700">
                  <Phone className="w-3 h-3 text-white" />
                  <span className="font-medium text-xs sm:text-sm text-white">
                    095963 06387
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-white-700">
                  <Mail className="w-3 h-3 text-white" />
                  <span className="font-medium text-xs sm:text-sm text-white">
                    shrss02@gmail.com
                  </span>
                </div>
              </div>

              {/* Right Side Content */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Session Info - Desktop */}
                {session?.user && (
                  <div className="hidden lg:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex items-center space-x-1 text-xs bg-green/[0.15] backdrop-blur-xl rounded-full px-2 py-1 border border-white/40 shadow-[inset_0_1px_8px_rgba(255,255,255,0.25),inset_0_-1px_4px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.12),0_2px_4px_rgba(255,255,255,0.1)] relative overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-black/5 before:pointer-events-none">
                      <span className="font-medium text-white/95 blur-[0.3px] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] truncate max-w-24 relative z-10 mix-blend-overlay">
                        {session.user.email.split('@')[0]}
                      </span>
                      {session.user.role && (
                        <span className="px-1.5 py-0.5 bg-white/[0.18] backdrop-blur-lg text-white/95 rounded-full text-xs font-medium border border-white/30 shadow-[inset_0_1px_4px_rgba(255,255,255,0.3),0_2px_6px_rgba(0,0,0,0.1)] relative z-10 blur-[0.3px] mix-blend-overlay">
                          {session.user.role}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Session Info for Medium screens (md) - glass style like desktop */}
{session?.user && (
  <div className="hidden md:flex lg:hidden items-center space-x-2">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    <div className="flex items-center space-x-1 text-xs 
        bg-white/[0.15] backdrop-blur-xl rounded-full px-2.5 py-1.5 
        border border-white/40 shadow-[inset_0_1px_8px_rgba(255,255,255,0.25),inset_0_-1px_4px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.12),0_2px_4px_rgba(255,255,255,0.1)] 
        relative overflow-hidden 
        before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-black/5 before:pointer-events-none">
      
      <span className="font-medium text-white/95 blur-[0.3px] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] truncate max-w-24 relative z-10 mix-blend-overlay">
        {session.user.email.split('@')[0]}
      </span>

      {session.user.role && (
        <span className="px-1.5 py-0.5 bg-white/[0.18] backdrop-blur-lg text-white/95 rounded-full text-xs font-medium border border-white/30 shadow-[inset_0_1px_4px_rgba(255,255,255,0.3),0_2px_6px_rgba(0,0,0,0.1)] relative z-10 blur-[0.3px] mix-blend-overlay">
          {session.user.role}
        </span>
      )}
    </div>
  </div>
)}

                
                {/* Social Icons */}
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <div className="flex space-x-0.5 sm:space-x-1">
                    <a  target="_blank" href="https://www.facebook.com/kaashyapi/" className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors group">
                      <Facebook className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </a>
                    <a href="#" className="w-4 h-4 sm:w-5 sm:h-5 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors">
                      <Twitter className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </a>
                    <a href="#" className="w-4 h-4 sm:w-5 sm:h-5 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                      <Youtube className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </a>
                    <a href="#" className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors">
                      <Linkedin className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </a>
                    <a href="#" className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-colors">
                      <Instagram className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      

    </div>
  )
}