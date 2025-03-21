import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Users, 
  ShieldCheck, 
  RefreshCw, 
  Settings, 
  UserCircle, 
  LogOut, 
  Bell 
} from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing the site",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen bg-gray-100">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-[#1E0A2E] text-white">
            <div className="p-4 border-b border-[#3D1F56]">
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <nav className="mt-6">
              <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase">Dashboard</div>
              <MenuItem href="/admin" icon={<BarChart3 size={18} />} label="Overview" />
              
              <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Content</div>
              <MenuItem href="/admin/event" icon={<Calendar size={18} />} label="Event Management" />
              <MenuItem href="/admin/blog" icon={<FileText size={18} />} label="Blog Management" />
              <MenuItem href="/admin/updates" icon={<RefreshCw size={18} />} label="Updates" />
              
              <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Users</div>
              <MenuItem href="/admin/user-management" icon={<Users size={18} />} label="User Management" />
              <MenuItem href="/admin/document-management" icon={<ShieldCheck size={18} />} label="Document Management" />
              
              <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase">Settings</div>
              <MenuItem href="/admin/site-settings" icon={<Settings size={18} />} label="Site Settings" />
              <MenuItem href="/admin/profile" icon={<UserCircle size={18} />} label="Your Profile" />
              
              <div className="mt-6 border-t border-[#3D1F56] pt-4">
                <MenuItem href="/auth/logout" icon={<LogOut size={18} />} label="Logout" />
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {/* Top header */}
            <div className="bg-white shadow-md p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Admin User</span>
                </div>
              </div>
            </div>
            
            {/* Page content */}
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

// Menu Item Component
function MenuItem({ href, icon, label }) {
  return (
    <Link 
      href={href} 
      className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#341452] hover:text-white transition-colors duration-200"
    >
      <span className="mr-3">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}