'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import {
  Users,
  X,
  Menu,
  UserCircle,
  LogOut,
  Home,
  Loader2,
  Briefcase,
  PanelTop,
  File,
  Folders,
  Wallet,
  Calendar,
  CalendarClock,
  LayoutDashboard,
  Image
} from 'lucide-react';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[]; // Add roles to specify who can see this menu item
}

const menuItems: MenuItem[] = [
    {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    title: 'Web Users',
    path: '/admin/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin'],
  },
 
  // {
  //   title: 'Job Posts',
  //   path: '/Admin-jobs-panel/',
  //   icon: <Briefcase className="w-5 h-5" />,
  //   roles: ['hr', 'recruiter'],
  // },
  // {
  //   title: 'Investor Docs',
  //   path: '/admin/Investors',
  //   icon: <File className="w-5 h-5" />,
  //   roles: ['hr', 'investor'],
  // },
   {
    title: 'All Events',
    path: '/Admin-event-panel',
    icon: <Calendar className="w-5 h-5" />,
    roles: ['admin', 'investor'],
  },

    {
    title: 'Enrolled Events',
    path: '/Admin-enrolled-events',
    icon: <CalendarClock className="w-5 h-5" />,
    roles: ['admin', 'investor'],
  },
    {
    title: 'Payment History',
    path: '/Admin-payment-history',
    icon: <Wallet className="w-5 h-5" />,
    roles: ['admin', 'hr'],
  },
   {
    title: 'Blog Posts',
    path: '/Admin-blog-panel/',
    icon: <PanelTop className="w-5 h-5" />,
    roles: ['admin', 'cms user'],
  },
     {
    title: 'Gallery',
    path: '/admin/gallery',
    icon: <Image className="w-5 h-5" />,
    roles: ['admin'],
  },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
const [isSidebarOpen, setSidebarOpen] = useState<boolean>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("adminSidebarOpen");
    return saved === "true";
  }
  return false;
});

const toggleSidebar = () => {
  setSidebarOpen((prev) => {
    const newState = !prev;
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSidebarOpen", String(newState));
    }
    return newState;
  });
};

  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const router = useRouter();

  // const toggleSidebar = () => {
  //   setSidebarOpen((prev) => !prev);
  // };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return session?.user?.role && item.roles.includes(session.user.role);
  });

  return (
    <>
    {/* Desktop */}
    <div className='hidden md:block'>
      <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">KAGOF</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg hover:bg-gray-100">
              <Home className="w-5 h-5" />
            </Link>

            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
                <div className="p-1 rounded-full bg-gray-100">
                  <UserCircle className="w-6 h-6" />
                </div>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-1 py-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <Link
                      href="/admin/profile"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                    >
                      <UserCircle className="w-4 h-4" />
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-16'
          } bg-white shadow-sm transition-all duration-300 min-h-[calc(100vh-64px)]`}
        >
          <nav className="p-4">
            {status === 'loading' ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredMenuItems.map((item) => (
<li key={item.path} className="relative group">
  <Link
    href={item.path}
    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 relative ${
      pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
    }`}
  >
    <div className="relative flex items-center">
      {item.icon}
      {/* Tooltip visible only when sidebar is collapsed */}
      {!isSidebarOpen && (
        <span
          className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap
                     bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0
                     group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
        >
          {item.title}
        </span>
      )}
    </div>

    {isSidebarOpen && (
      <span className="font-medium">{item.title}</span>
    )}
  </Link>
</li>

                ))}
              </ul>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {status === 'loading' ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
      </div>
    </div>
    {/* Mobile */}
    <div className='block md:hidden'>
        <div className="min-h-screen bg-gray-100">
  {/* Header */}
  <header className="bg-white shadow-sm fixed w-full top-0 z-40">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle for mobile */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">KAGOF</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-lg hover:bg-gray-100">
          <Home className="w-5 h-5" />
        </Link>

        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <div className="p-1 rounded-full bg-gray-100">
              <UserCircle className="w-6 h-6" />
            </div>

            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-1 py-2 w-48 bg-white rounded-lg shadow-xl z-50">
                <Link
                  href="/admin/profile"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </header>

  <div className="flex pt-16">
    {/* Overlay for mobile */}
    {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
        onClick={toggleSidebar}
      ></div>
    )}

    {/* Sidebar */}
    <aside
      className={`bg-white shadow-sm transition-transform duration-300 min-h-[calc(100vh-64px)] 
        sm:translate-x-0 sm:static sm:w-64 
        fixed top-0 left-0 h-full z-40 w-full transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Cross button visible only on mobile */}
      <div className="sticky top-0 bg-white z-50 flex justify-end p-4 border-b sm:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="p-4 overflow-y-auto">
        {status === "loading" ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => {
                    setSidebarOpen(false); // close sidebar on mobile
                  }}
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                    pathname === item.path ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-6">
      {status === "loading" ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : (
        children
      )}
    </main>
  </div>
   </div>
    </div>

    </>
  );
};

export default AdminLayout;
