"use client";
import { useState, useEffect, useRef } from "react";
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
  const userDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      {/* Main Header */}
      <header className="bg-white relative">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">

            {/* Logo and Organization Name Section */}
            <div className="flex items-center space-x-3 sm:space-x-8">
              {/* Main Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    <Image
                      src="/logo.jpg"
                      alt="KAGOF Logo"
                      width={60}
                      height={60}
                      className="sm:w-[90px] sm:h-[90px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    />
                  </div>
                </Link>
              </div>

              {/* Organization Name - Enhanced Typography */}
              <div className="hidden lg:block">
                <div className="text-left space-y-1">
                  <h1 className="text-m font-bold text-gray-800 uppercase tracking-wide leading-tight">
                    <span className="text-blue-700">KAASHYAPI AYURVEDA</span>
                    <br />
                    <span className="text-gray-700">GYNAECOLOGISTS</span>
                  </h1>
                  <h2 className="text-m font-semibold text-gray-600 uppercase tracking-wide">
                    AND OBSTETRICIANS FOUNDATION
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Mobile-only KAGOF title (hidden on tablet and above) */}
            <div className="block sm:hidden absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-extrabold text-blue-700 tracking-wider">
                KAGOF
              </h1>
            </div>


            {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 whitespace-nowrap">

              {/* Default links - hidden for user */}
              <>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href="/about-us"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                >
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/events"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                >
                  Events
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                >
                  Blogs
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href="/gallery"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                >
                  Gallery
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href="/membership"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                >
                  Membership
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <>
                  {!session && (
                    <Link
                      href="/register"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                    >
                      Registration
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  )}
                </>
                {session && role === "user" && (
                  <>
                    <Link
                      href="/user/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 lg:px-3 rounded-md hover:bg-blue-50 relative group text-sm lg:text-base"
                    >
                      Dashboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
              </>

              {/* User Profile Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors p-1.5 lg:p-2 rounded-full hover:bg-blue-50"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-5 duration-200">
                    {!session && (
                      <Link
                        href="/login"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        <div>
                          <div className="font-medium">Sign In</div>
                          <div className="text-sm text-gray-500">Access your account</div>
                        </div>
                      </Link>
                    )}
                    {session && role === "user" && (
                      <>
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Sign Out</div>
                            <div className="text-sm text-red-400">End your session</div>
                          </div>
                        </button>
                      </>
                    )}
                    {session && role === "admin" && (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Admin Panel</div>
                            <div className="text-sm text-gray-500">Manage system</div>
                          </div>
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Sign Out</div>
                            <div className="text-sm text-red-400">End admin session</div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Organization Name */}
        <div className="lg:hidden px-2 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100">
          <div className="text-center pt-2 sm:pt-3">
            {/* <h2 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wide">
              Kaashyapi Ayurveda Gynaecologists
            </h2>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
              & Obstetricians Foundation
            </h3> */}
            {/* <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-1 sm:mt-2"></div> */}

            {/* Mobile Session Info */}
            {/* {session?.user && (
              <div className="mt-2 flex items-center justify-center">
                <div className="flex items-center space-x-1 bg-green-50 rounded-full px-2 py-1 border border-green-200">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">
                    {session.user.email.split('@')[0]}
                  </span>
                  {session.user.role && (
                    <span className="px-1 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                      {session.user.role}
                    </span>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 max-h-screen overflow-y-auto">
            <div className="px-2 sm:px-4 py-4 sm:py-6 space-y-1">
              {/* User-specific mobile menu */}
              <>
                <Link
                  href="/"
                  className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                  onClick={toggleMobileMenu}
                >
                  Blogs
                </Link>

                <Link
                  href="/about-us"
                  className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                  onClick={toggleMobileMenu}
                >
                  About Us
                </Link>

                <Link
                  href="/membership"
                  className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                  onClick={toggleMobileMenu}
                >
                  Membership
                </Link>

                <Link
                  href="/events"
                  className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                  onClick={toggleMobileMenu}
                >
                  Events
                </Link>
                <Link
                  href="/gallery"
                  className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                  onClick={toggleMobileMenu}
                >
                  Gallery
                </Link>
                {!session && (
                  <Link
                    href="/register"
                    className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                    onClick={toggleMobileMenu}
                  >
                    Registration

                  </Link>
                )}
                {session && role === "user" && (
                  <Link
                    href="/user/dashboard"
                    className="flex items-center px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                )}
              </>

              {/* Account mobile dropdown */}
              <div className="pt-2 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                  className="flex items-center justify-between w-full px-3 sm:px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                >
                  <div className="flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    Account
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubmenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenuOpen && (
                  <div className="ml-3 sm:ml-4 mt-2 space-y-1">
                    {!session && (
                      <Link
                        href="/login"
                        className="flex items-center px-3 sm:px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-sm sm:text-base"
                        onClick={toggleMobileMenu}
                      >
                        Sign In
                      </Link>
                    )}
                    {session && role === "user" && (
                      <>
                        <Link
                          href="/user/dashboard"
                          className="flex items-center px-3 sm:px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-sm sm:text-base"
                          onClick={toggleMobileMenu}
                        >
                          My Dashboard
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </>
                    )}
                    {session && role === "admin" && (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-3 sm:px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-sm sm:text-base"
                          onClick={toggleMobileMenu}
                        >
                          Admin Panel
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
