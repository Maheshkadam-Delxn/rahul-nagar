"use client"
import React, { useState } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
              <MenuItem href="/admin/site-settings" icon={<Settings size={18} />} label="Site Settings" onClick={closeSidebar} />
              <MenuItem href="/admin/profile" icon={<UserCircle size={18} />} label="Your Profile" onClick={closeSidebar} />
              
              <div className="mt-6 border-t border-[#3D1F56] pt-4">
                <MenuItem href="/auth/logout" icon={<LogOut size={18} />} label="Logout" onClick={closeSidebar} />
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
                  <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                    A
                  </div>
                  <span className="hidden md:inline ml-2 text-sm font-medium text-gray-700">Admin User</span>
                </div>
              </div>
            </div>
            
            {/* Page content */}
            <div className="p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
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