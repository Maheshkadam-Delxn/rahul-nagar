"use client"
import React from 'react';
import { User, Home, Calendar, DollarSign, Settings, Bell, MessageSquare, BarChart2, Layers, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminDashboardOverview = () => {
  const { user } = useAuth();
  console.log("AdminDashboardOverview: Auth context received:", { user });
  // Mock data for the dashboard
  const dashboardData = {
    stats: [
      { id: 1, title: 'Total Residents', value: 432, icon: User, change: '+5%', color: 'bg-blue-100 text-blue-600' },
      { id: 2, title: 'Active Units', value: 376, icon: Home, change: '+2%', color: 'bg-green-100 text-green-600' },
      { id: 3, title: 'Monthly Revenue', value: '$87,525', icon: DollarSign, change: '+12%', color: 'bg-purple-100 text-purple-600' },
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart2 className="h-6 w-6 mr-2" />
            Dashboard Overview
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {dashboardData.stats.map(stat => (
            <div key={stat.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{stat.value}</h2>
                  <p className="text-gray-500">{stat.title}</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                <span className="text-gray-500 text-sm"> from last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentActivities.map(activity => (
                    <div key={activity.id} className="flex">
                      <div className={`p-2 rounded-full ${activity.color} mr-4 flex-shrink-0 mt-1`}>
                        <activity.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View all activity →</a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Quick Links</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <a href="#" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition">
                    <User className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Manage Residents</span>
                  </a>
                  <a href="#" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition">
                    <Settings className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm font-medium">Maintenance</span>
                  </a>
                  <a href="#" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <span className="text-sm font-medium">Events</span>
                  </a>
                  <a href="#" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <span className="text-sm font-medium">Payments</span>
                  </a>
                  <a href="#" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                    <span className="text-sm font-medium">Messages</span>
                  </a>
                  <a href="#" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition">
                    <Layers className="h-6 w-6 mx-auto mb-2 text-red-600" />
                    <span className="text-sm font-medium">Reports</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Alerts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {dashboardData.alerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-4 rounded-lg border ${getAlertTypeClass(alert.type)}`}
                    >
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <p className="text-sm">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium">Pending Tasks</h3>
                <span className="text-gray-500 text-sm">{dashboardData.pendingTasks.length} tasks</span>
              </div>
              <div className="p-6">
                <div className="divide-y divide-gray-100">
                  {dashboardData.pendingTasks.map(task => (
                    <div key={task.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-3" />
                        <span className="text-sm">{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">{task.due}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View all tasks →</a>
                </div>
              </div>
            </div>

            {/* Calendar Preview */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Upcoming Events</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 mr-4">
                      <div className="text-center">
                        <div className="text-xs font-medium">MAR</div>
                        <div className="text-sm font-bold">25</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Water Outage Maintenance</h4>
                      <p className="text-xs text-gray-500">Block A & B, 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-800 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 mr-4">
                      <div className="text-center">
                        <div className="text-xs font-medium">MAR</div>
                        <div className="text-sm font-bold">28</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Residents Committee Meeting</h4>
                      <p className="text-xs text-gray-500">Community Hall, 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-amber-100 text-amber-800 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 mr-4">
                      <div className="text-center">
                        <div className="text-xs font-medium">APR</div>
                        <div className="text-sm font-bold">02</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Society Cultural Event</h4>
                      <p className="text-xs text-gray-500">Community Garden, 5:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View calendar →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;