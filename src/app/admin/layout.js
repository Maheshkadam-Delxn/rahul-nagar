"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import router for redirection
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { useAuth } from "@/context/AuthContext";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  ShieldCheck, 
  RefreshCw, 
  Settings, 
  UserCircle, 
  LogOut, 
  Bell,
  Building,
  Menu,
  X
} from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({ children }) {
  const router = useRouter(); // Initialize router
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  // Check for user role and redirect if not found
  useEffect(() => {
    const checkUserRole = () => {
      // Set a short timeout to ensure we give auth context time to initialize
      const timer = setTimeout(() => {
        if (user?.role) {
          setCurrentUserRole(user.role);
          console.log("User role set:", user.role);
          setIsLoading(false);
          setIsMenuLoading(false);
        } else {
          // Check if we have role in localStorage as fallback
          const storedRole = localStorage.getItem('userRole');
          if (storedRole) {
            setCurrentUserRole(storedRole);
            console.log("Using stored role:", storedRole);
            setIsLoading(false);
            setIsMenuLoading(false);
          } else {
            // Show skeleton loading for a moment before redirecting
            setTimeout(() => {
              // No role found - redirect to login
              console.log("No user role found, redirecting to login");
              router.push('/signin');
            }, 1000); // Show skeleton for 1 second before redirect
          }
        }
      }, 500); // Give a small delay to let auth context initialize

      return () => clearTimeout(timer);
    };

    checkUserRole();
  }, [user, router]);

  // Store role in localStorage when it changes
  useEffect(() => {
    if (user?.role) {
      localStorage.setItem('userRole', user.role);
    }
  }, [user?.role]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Skeleton menu items for loading state
  const renderSkeletonMenu = () => {
    return (
      <>
        <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase">Dashboard</div>
        {[...Array(3)].map((_, index) => (
          <div key={`skeleton-dash-${index}`} className="flex items-center px-4 py-3">
            <div className="w-5 h-5 mr-3 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>
        ))}
        
        <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Content</div>
        {[...Array(4)].map((_, index) => (
          <div key={`skeleton-content-${index}`} className="flex items-center px-4 py-3">
            <div className="w-5 h-5 mr-3 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
        ))}
        
        <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Users</div>
        {[...Array(2)].map((_, index) => (
          <div key={`skeleton-users-${index}`} className="flex items-center px-4 py-3">
            <div className="w-5 h-5 mr-3 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-28 animate-pulse"></div>
          </div>
        ))}
      </>
    );
  };

  // Render menu items based on user role
  const renderDashboardItems = () => {
    // Show skeleton loading while menu is loading
    if (isMenuLoading) {
      return renderSkeletonMenu();
    }

    // Use currentUserRole instead of directly accessing user?.role
    switch(true) {
      case currentUserRole === "Super-Admin":
        return (
          <>
            <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase">Dashboard</div>
            <MenuItem href="/admin" icon={<BarChart3 size={18} />} label="Overview" onClick={closeSidebar} />
            
            <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Content</div>
            <MenuItem href="/admin/event" icon={<Calendar size={18} />} label="Event Management" onClick={closeSidebar} />
            <MenuItem href="/admin/building-management" icon={<Building size={18} />} label="Building Management" onClick={closeSidebar} />
            <MenuItem href="/admin/gallery-management" icon={<Building size={18} />} label="Gallery Management" onClick={closeSidebar} />
           
            <MenuItem href="/admin/updates" icon={<RefreshCw size={18} />} label="Updates" onClick={closeSidebar} />
            
            <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Users</div>
            <MenuItem href="/admin/associate-member" icon={<Building size={18} />} label="Associate Member Management" onClick={closeSidebar} />
            <MenuItem href="/admin/user-management" icon={<Users size={18} />} label="User Management" onClick={closeSidebar} />
            <MenuItem href="/admin/document-management" icon={<ShieldCheck size={18} />} label="Document Management" onClick={closeSidebar} />
            
            <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Settings</div>
            <MenuItem href="/admin/site-settings" icon={<Settings size={18} />} label="Site Settings" onClick={closeSidebar} />
            <MenuItem href="/admin/profile" icon={<UserCircle size={18} />} label="Your Profile" onClick={closeSidebar} />
          </>
        );
      case currentUserRole === "Admin":
        return (
          <>
            <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase">Dashboard</div>
            <MenuItem href="/admin" icon={<BarChart3 size={18} />} label="Overview" onClick={closeSidebar} />
            
            <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Content</div>
            <MenuItem href="/admin/event" icon={<Calendar size={18} />} label="Event Management" onClick={closeSidebar} />
            <MenuItem href="/admin/building-management" icon={<Building size={18} />} label="Building Management" onClick={closeSidebar} />
            <MenuItem href="/admin/updates" icon={<RefreshCw size={18} />} label="Updates" onClick={closeSidebar} />
            
            <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Users</div>
            <MenuItem href="/admin/user-management" icon={<Users size={18} />} label="User Management" onClick={closeSidebar} />
            <MenuItem href="/admin/document-management" icon={<ShieldCheck size={18} />} label="Document Management" onClick={closeSidebar} />
            
            <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Settings</div>
            <MenuItem href="/admin/profile" icon={<UserCircle size={18} />} label="Your Profile" onClick={closeSidebar} />
          </>
        );
      case currentUserRole?.startsWith("Building"):
        return (
          <>
            <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Content</div>
            <MenuItem href="/admin/building-management" icon={<Building size={18} />} label="Building Management" onClick={closeSidebar} />
            <MenuItem href="/admin/document-management" icon={<ShieldCheck size={18} />} label="Document Management" onClick={closeSidebar} />
          </>
        );
      default:
        // Fallback skeleton loading
        return renderSkeletonMenu();
    }
  };

  // Handle logout with proper cleanup
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    logout();
    router.push('/signin');
  };

  // Show loading state or redirect if no role is found
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 flex items-center justify-between p-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 bg-[#1E0A2E] text-white rounded-md mr-4"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Admin Sidebar - Responsive */}
      <aside 
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-[#1E0A2E] text-white 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 z-50
          pt-16 md:pt-0 overflow-y-auto
        `}
      >
        <div className="p-4 border-b border-[#3D1F56] flex justify-between items-center md:block">
          <h2 className="text-xl font-bold hidden md:block">Admin Panel</h2>
          <button 
            onClick={closeSidebar} 
            className="md:hidden p-2"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-6">
          {renderDashboardItems()}
          
          <div className="mt-6 border-t border-[#3D1F56] pt-4">
            {isMenuLoading ? (
              <div className="flex items-center px-4 py-3">
                <div className="w-5 h-5 mr-3 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            ) : (
              <MenuItem href="#" icon={<LogOut size={18} />} label="Logout" onClick={handleLogout} />
            )}
          </div>
        </nav>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Main Content - Responsive */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto md:pt-0 pt-16">
        {/* Top header - Responsive */}
        <div className="bg-white shadow-md p-4 justify-between items-center hidden md:flex">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center">
              {isMenuLoading ? (
                <>
                  <div className="h-8 w-8 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="ml-2 h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <span className="hidden md:inline ml-2 text-sm font-medium text-gray-700">
                    {user?.name || 'Admin User'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Menu Item Component
function MenuItem({ href, icon, label, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#341452] hover:text-white transition-colors duration-200"
    >
      <span className="mr-3">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}