'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import {
  Users,
  Menu,
  UserCircle,
  LogOut,
  Home,
  Loader2,
  Briefcase,
  PanelTop,
  File,
} from 'lucide-react';
import PageMetadata from '../PageMetaData';
import NavigationMenu from '../NavigationMenu';
import Hero from '../Hero';
import Footer from '../Footer';
import UserMenu from '../UserMenu';
import TopContactStrip from '../TopContactStrip';



const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">



      <PageMetadata
        title="Home - KAOGF"
        description="KOGAF"
        keywords=""
        ogUrl="/"
        canonicalUrl="/"
      />


      <TopContactStrip/>
      <NavigationMenu />
      <UserMenu />


      {status === 'loading' ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : (
        children
      )}

      <Footer />

    </div>

  );
};

export default UserLayout;
