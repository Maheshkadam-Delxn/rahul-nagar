"use client"
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Edit, Save, Camera, CheckCircle, X, AlertTriangle, Shield, Key, LogOut, Calendar, Clock } from 'lucide-react';

const AdminProfilePage = () => {
  // State for admin profile data
  const [profileData, setProfileData] = useState({
    personal: {
      name: "Rahul Sharma",
      email: "rahul.sharma@harmonyheights.org",
      phone: "+1 (555) 987-6543",
      position: "Society Administrator",
      bio: "Dedicated administrator with over 7 years of experience in cooperative housing management. Passionate about creating a vibrant and well-maintained community for all residents.",
      joinDate: "2021-06-15",
      profileImage: "/images/profile-photo.jpg"
    },
    security: {
      lastPasswordChange: "2024-02-20",
      twoFactorEnabled: true,
      loginNotifications: true,
      recoveryEmailSet: true,
      lastLogin: "2025-03-21T08:45:32"
    },
    preferences: {
      language: "English",
      theme: "light",
      emailNotifications: true,
      desktopNotifications: false,
      autoSave: true
    },
    accessRights: {
      manageUsers: true,
      manageContent: true,
      manageSettings: true,
      viewReports: true,
      managePayments: true,
      manageEvents: true
    }
  });

  // State for editing mode
  const [editingSection, setEditingSection] = useState(null);
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for showing success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Toggle editing mode for a section
  const toggleEditing = (section) => {
    if (editingSection === section) {
      setEditingSection(null);
    } else {
      setEditingSection(section);
    }
  };
  
  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setProfileData({
      ...profileData,
      [section]: {
        ...profileData[section],
        [field]: value
      }
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (section, field) => {
    setProfileData({
      ...profileData,
      [section]: {
        ...profileData[section],
        [field]: !profileData[section][field]
      }
    });
  };
  
  // Handle password input changes
  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };
  
  // Handle save profile
  const handleSaveProfile = (section) => {
    // In a real app, this would submit to an API
    console.log(`Saving ${section} data:`, profileData[section]);
    
    // Show success message
    setSuccessMessage(`Your ${section} information has been updated successfully!`);
    setShowSuccessMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    // Exit editing mode
    setEditingSection(null);
  };
  
  // Handle password update
  const handleUpdatePassword = () => {
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    // In a real app, this would verify current password and update with the new one
    console.log("Updating password");
    
    // Show success message
    setSuccessMessage("Your password has been updated successfully!");
    setShowSuccessMessage(true);
    
    // Reset password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format datetime for display
  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-2" />
            Admin Profile
          </h1>
        </div>
      </header>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-out">
          <div className="flex items-center">
            <div className="py-1">
              <CheckCircle className="h-6 w-6 text-green-500 mr-4" />
            </div>
            <div>
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 text-center">
                <div className="relative inline-block">
                  <div className="h-32 w-32 rounded-full bg-gray-200 mb-4 mx-auto overflow-hidden">
                    <img 
                      src="/api/placeholder/128/128" 
                      alt="Admin profile" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-4 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold">{profileData.personal.name}</h2>
                <p className="text-gray-600">{profileData.personal.position}</p>
                
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {formatDate(profileData.personal.joinDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-700 mb-3">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileData.personal.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileData.personal.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-4">
                <a href="#" className="block py-2 px-4 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </a>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-medium">Personal Information</h3>
                {editingSection !== 'personal' ? (
                  <button 
                    onClick={() => toggleEditing('personal')}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingSection(null)}
                      className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveProfile('personal')}
                      className="text-green-600 hover:text-green-800 flex items-center text-sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {editingSection === 'personal' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profileData.personal.name}
                          onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          value={profileData.personal.position}
                          onChange={(e) => handleInputChange('personal', 'position', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={profileData.personal.email}
                          onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={profileData.personal.phone}
                          onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={profileData.personal.bio}
                        onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
                        rows="4"
                        className="w-full p-2 border rounded-md"
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                        <p>{profileData.personal.name}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Position</h4>
                        <p>{profileData.personal.position}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p>{profileData.personal.email}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                        <p>{profileData.personal.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                      <p className="text-sm text-gray-700">{profileData.personal.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-medium">Security Settings</h3>
                {editingSection !== 'security' ? (
                  <button 
                    onClick={() => toggleEditing('security')}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingSection(null)}
                      className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveProfile('security')}
                      className="text-green-600 hover:text-green-800 flex items-center text-sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {editingSection === 'security' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={profileData.security.twoFactorEnabled}
                          onChange={() => handleCheckboxChange('security', 'twoFactorEnabled')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Notifications</h4>
                        <p className="text-sm text-gray-500">Receive email alerts for new sign-ins</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={profileData.security.loginNotifications}
                          onChange={() => handleCheckboxChange('security', 'loginNotifications')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <h4 className="text-sm font-medium">Password</h4>
                        <p className="text-xs text-gray-500">Last changed {formatDate(profileData.security.lastPasswordChange)}</p>
                      </div>
                      <button
                        onClick={() => toggleEditing('password')}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md hover:bg-blue-50 flex items-center"
                      >
                        <Key className="h-3 w-3 mr-1" />
                        Change
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                        <p className="text-xs text-gray-500">
                          {profileData.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        profileData.security.twoFactorEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profileData.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <h4 className="text-sm font-medium">Login Notifications</h4>
                        <p className="text-xs text-gray-500">
                          {profileData.security.loginNotifications ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        profileData.security.loginNotifications 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profileData.security.loginNotifications ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <h4 className="text-sm font-medium">Recovery Email</h4>
                        <p className="text-xs text-gray-500">
                          {profileData.security.recoveryEmailSet ? 'Set' : 'Not set'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        profileData.security.recoveryEmailSet 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profileData.security.recoveryEmailSet ? 'Set' : 'Not set'}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Last login: {formatDateTime(profileData.security.lastLogin)}</span>
                    </div>
                  </div>
                )}
                
                {/* Password Change Form */}
                {editingSection === 'password' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleUpdatePassword}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Access Rights */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Access Rights</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profileData.accessRights).map(([right, value]) => (
                    <div key={right} className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          {right.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {value ? 'Granted' : 'Not granted'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  <p>Access rights can only be modified by the super administrator.</p>
                </div>
              </div>
            </div>
            
            {/* Preferences */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-medium">Interface Preferences</h3>
                {editingSection !== 'preferences' ? (
                  <button 
                    onClick={() => toggleEditing('preferences')}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingSection(null)}
                      className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveProfile('preferences')}
                      className="text-green-600 hover:text-green-800 flex items-center text-sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {editingSection === 'preferences' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        value={profileData.preferences.language}
                        onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                        className="w-full p-2 border rounded-md bg-white"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Gujarati">Gujarati</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                      <select
                        value={profileData.preferences.theme}
                        onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                        className="w-full p-2 border rounded-md bg-white"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Notification Preferences</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            checked={profileData.preferences.emailNotifications}
                            onChange={() => handleCheckboxChange('preferences', 'emailNotifications')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                            Email Notifications
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="desktopNotifications"
                            checked={profileData.preferences.desktopNotifications}
                            onChange={() => handleCheckboxChange('preferences', 'desktopNotifications')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="desktopNotifications" className="ml-2 block text-sm text-gray-900">
                            Desktop Notifications
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="autoSave"
                            checked={profileData.preferences.autoSave}
                            onChange={() => handleCheckboxChange('preferences', 'autoSave')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-900">
                            Auto-save changes
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Language</h4>
                      <p>{profileData.preferences.language}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Theme</h4>
                      <p className="capitalize">{profileData.preferences.theme}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email Notifications</h4>
                      <p>{profileData.preferences.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Desktop Notifications</h4>
                      <p>{profileData.preferences.desktopNotifications ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Auto-save Changes</h4>
                      <p>{profileData.preferences.autoSave ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;