"use client"
import React from 'react';
import { User, Home, Calendar, DollarSign, Settings, Bell, MessageSquare, BarChart2, Layers, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import animationData from "@/assets/welcom.json"
const AdminDashboardOverview = () => {
  const router = useRouter()
  const { user } = useAuth();
  // Mock data for the dashboard
  const dashboardData = {
    stats: [
      { id: 1, title: 'Total Residents', value: 432, icon: Home, change: '+5%', color: 'bg-blue-100 text-blue-600' },
      { id: 2, title: 'Total Flats', value: 376, icon: User, change: '+2%', color: 'bg-green-100 text-green-600' },
      { id: 4, title: 'Total Updates', value: 4, icon: Calendar, change: '+3', color: 'bg-amber-100 text-amber-600' },
      { id: 4, title: 'Upcoming Events', value: 8, icon: Calendar, change: '+3', color: 'bg-amber-100 text-amber-600' }
    ],
    recentActivities: [
      { id: 1, title: 'Payment Received', description: 'John Doe (Unit 302) paid $1,200 for March rent', time: '2 hours ago', icon: DollarSign, color: 'bg-green-100 text-green-600' },
      { id: 2, title: 'Maintenance Request', description: 'Leaking faucet reported in Unit 215', time: '4 hours ago', icon: Settings, color: 'bg-amber-100 text-amber-600' },
      { id: 3, title: 'New Resident', description: 'Priya Sharma registered for Unit 118', time: '1 day ago', icon: User, color: 'bg-blue-100 text-blue-600' },
      { id: 4, title: 'Announcement Posted', description: 'Water outage scheduled for March 25th', time: '1 day ago', icon: Bell, color: 'bg-purple-100 text-purple-600' },
      { id: 5, title: 'Complaint Resolved', description: 'Noise complaint in Block B resolved', time: '2 days ago', icon: CheckCircle, color: 'bg-green-100 text-green-600' }
    ],
    pendingTasks: [
      { id: 1, title: 'Review maintenance requests', priority: 'High', due: 'Today' },
      { id: 2, title: 'Approve resident applications', priority: 'Medium', due: 'Tomorrow' },
      { id: 3, title: 'Schedule quarterly inspection', priority: 'Medium', due: 'Mar 27' },
      { id: 4, title: 'Generate monthly financial report', priority: 'High', due: 'Mar 31' }
    ],
    alerts: [
      { id: 1, title: 'Payment Overdue', description: '18 residents have overdue payments', type: 'warning' },
      { id: 2, title: 'Maintenance Backlog', description: '7 maintenance requests pending for > 48 hours', type: 'warning' },
      { id: 3, title: 'Security System Update', description: 'Security system update required by April 1st', type: 'info' }
    ]
  };

  // Function to get priority badge class
  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get alert type badge class
  const getAlertTypeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return ( 
   
    
  
    <div className="bg-gray-50 min-h-screen">
    {/* Header - responsive padding */}
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          Dashboard Overview
        </h1>
      </div>
    </header>
    
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      {/* Animation Container - visible on top for small screens, below for larger screens */}
      <div className="flex flex-col md:order-2 order-1 items-center gap-3 mb-6 md:mb-0">
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72">
          <Lottie 
            animationData={animationData} 
            loop={false}
            options={{
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}
            className="w-full h-full"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#7A42F5]">Welcome to Rahul Nagar Dashboard</h1>
      </div>

      {/* Stats Cards - responsive grid, below animation on small screens, above on larger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 md:order-1 order-2 pt-14">
        {dashboardData.stats.map(stat => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-full ${stat.color} mr-3 sm:mr-4`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</h2>
                <p className="text-gray-500 text-sm sm:text-base">{stat.title}</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-right">
              <span className="text-green-600 text-xs sm:text-sm font-medium">{stat.change}</span>
              <span className="text-gray-500 text-xs sm:text-sm"> from last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
      );
    };

export default AdminDashboardOverview;