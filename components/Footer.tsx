"use client";
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  return (
    <section>
      {/* Footer Solutions, Products, Services */}

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid md:grid-cols-4 gap-8 ">
            <div>
              <div className="logo z-10">
                <Link href="/">
                  <div className="logo-container flex items-center space-x-2">
                    <Image
                      src="/logo.jpg"
                      alt="KAGOF Logo"
                      width={60}
                      height={60}
                      className="sm:w-[90px] sm:h-[90px] rounded-md hover:shadow-lg transition-shadow duration-300"
                    />
                  </div>
                </Link>
              </div>
              {/* <p className="text-gray-400 p-2">
                Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation - Providing comprehensive women's healthcare with traditional Ayurvedic wisdom and modern medical excellence.
              </p> */}

              {/* Social Media Links */}
              {/* <div className="flex space-x-4 mt-4 ml-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Youtube size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Linkedin size={20} />
                </a>
              </div> */}
            </div>

            <div>
              <h4 className="font-semibold mb-4">Events</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/events" className="hover:text-white transition-colors">All Events</Link> </li>
                <li><Link href="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Past Events</Link></li>
                {/* <li onClick={() => router.push("/services/fertility")} className="cursor-pointer hover:text-white transition-colors">Fertility Consultation</li> */}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blogs</Link></li>
                {/* <li><Link href="/events" className="hover:text-white transition-colors">All Events</Link></li> */}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-start space-x-3">
                  <Phone size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm"> 095963 06387</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="mailto:shrss02@gmail.com"
                      className="text-sm hover:text-white transition-colors"
                    >
                      shrss02@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm">KAGOF</p>
                    {/* <p className="text-sm">City, State - 000000</p> */}
                  </div>
                </div>

                <div className="mt-4">

                </div>
              </div>
            </div>
          </div>



          {/* Copyright and Legal */}
          <div className="container text-white mx-auto mt-2 pt-4 border-t border-gray-700 text-center text-sm flex flex-col md:flex-row justify-center items-center gap-4">
            <p>&copy; 2025 Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation. All rights reserved</p>
            <div className="flex items-center space-x-4">
              <Link
                href="/terms"
                className="relative inline-block 
             before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] 
             before:w-0 before:bg-white before:transition-all before:duration-300 
             hover:before:w-full"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacypolicy"
                className="relative inline-block
             before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px]
             before:w-0 before:bg-white before:transition-all before:duration-300
             hover:before:w-full"
              >
                Privacy Policy
              </Link>
              <Link
                href="/medicaldisclaimer"
                className="relative inline-block
             before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px]
             before:w-0 before:bg-white before:transition-all before:duration-300
             hover:before:w-full"
              >
                Medical Disclaimer
              </Link>
            </div>
          </div>

          {/* <div className='container text-white mx-auto pt-4 border-gray-700 text-center text-sm flex flex-col md:flex-row justify-center items-center gap-4'>
            <p>Healthcare Management System powered by <span className="text-green-400 font-bold">Edvenswa Tech Pvt. Ltd.</span></p>
          </div> */}
        </div>
      </footer>
    </section>
  );
}