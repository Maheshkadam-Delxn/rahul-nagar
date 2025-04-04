"use client"
import React, { useState } from 'react';
import { Settings, Save, Image, Edit, Home, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Calendar, FileText, Shield, Eye, EyeOff, Clock, X, Plus, Trash2, HelpCircle, AlertTriangle, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useSiteSettings from '@/hooks/useSiteSetting';

const SiteSettingsAdmin = () => {
  const { user } = useAuth();
  const {
    siteSettings,
    loading,
    error,
    hasUnsavedChanges,
    saving,
    handleInputChange,
    handleCheckboxChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    saveSettings
  } = useSiteSettings();

  // State for active section
  const [activeSection, setActiveSection] = useState('general');
  
  // State for showing success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // State for handling amenities
  const [newAmenity, setNewAmenity] = useState('');
  
  // Handle amenity addition
  const handleAddAmenity = () => {
    if (newAmenity.trim() !== '') {
      const updatedAmenities = [
        ...(siteSettings?.homepage?.featuredAmenities || []),
        newAmenity.trim()
      ];
      
      handleInputChange('homepage', 'featuredAmenities', updatedAmenities);
      setNewAmenity('');
    }
  };
  
  // Handle amenity removal
  const handleRemoveAmenity = (index) => {
    const updatedAmenities = siteSettings.homepage.featuredAmenities.filter((_, i) => i !== index);
    handleInputChange('homepage', 'featuredAmenities', updatedAmenities);
  };
  
  // Handle form submission
  const handleSaveSettings = async () => {
    const success = await saveSettings();
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };
  
  // Get navigation class based on active section
  const getNavClass = (section) => {
    return `flex items-center p-3 rounded-md ${activeSection === section 
      ? 'bg-blue-100 text-blue-700' 
      : 'hover:bg-gray-100'}`;
  };

  if (user?.role !== "Super-Admin") {
    return <p>You don't have access to this page</p>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-7xl mx-auto mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!siteSettings) {
    return <p>No settings data available</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="h-6 w-6 mr-2" />
            Site Settings
          </h1>
          
          {hasUnsavedChanges && (
            <div className="flex items-center">
              <span className="text-amber-600 mr-3 text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Unsaved changes
              </span>
              <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-out">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Settings saved successfully!</p>
              <p className="text-sm">Your changes have been applied to the website.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveSection('general')}
                className={getNavClass('general')}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>General</span>
              </button>
              
              <button 
                onClick={() => setActiveSection('homepage')}
                className={getNavClass('homepage')}
              >
                <Image className="h-5 w-5 mr-3" />
                <span>Homepage</span>
              </button>
              
              <button 
                onClick={() => setActiveSection('contact')}
                className={getNavClass('contact')}
              >
                <Mail className="h-5 w-5 mr-3" />
                <span>Contact</span>
              </button>
              
              <button 
                onClick={() => setActiveSection('social')}
                className={getNavClass('social')}
              >
                <Globe className="h-5 w-5 mr-3" />
                <span>Social Media</span>
              </button>
              
              <button 
                onClick={() => setActiveSection('seo')}
                className={getNavClass('seo')}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>SEO</span>
              </button>
              
              <button 
                onClick={() => setActiveSection('security')}
                className={getNavClass('security')}
              >
                <Shield className="h-5 w-5 mr-3" />
                <span>Security & Privacy</span>
              </button>
              
              <button 
                onClick={() => setActiveSection('notifications')}
                className={getNavClass('notifications')}
              >
                <Bell className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </button>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center px-3 text-sm text-gray-600">
                <HelpCircle className="h-4 w-4 mr-2" />
                <span>Need help? Contact support</span>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-4 bg-white p-6 rounded-lg shadow">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Society Name</label>
                    <input
                      type="text"
                      value={siteSettings.general.societyName || ''}
                      onChange={(e) => handleInputChange('general', 'societyName', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Tagline</label>
                    <input
                      type="text"
                      value={siteSettings.general.tagline || ''}
                      onChange={(e) => handleInputChange('general', 'tagline', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Year Founded</label>
                    <input
                      type="number"
                      value={siteSettings.general.foundedYear || ''}
                      onChange={(e) => handleInputChange('general', 'foundedYear', parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={siteSettings.general.registrationNumber || ''}
                      onChange={(e) => handleInputChange('general', 'registrationNumber', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={siteSettings.general.address || ''}
                      onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                      className="w-full p-2 border rounded-md h-20"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      value={siteSettings.general.email || ''}
                      onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings.general.phone || ''}
                      onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Alternate Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings.general.alternatePhone || ''}
                      onChange={(e) => handleInputChange('general', 'alternatePhone', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Office Hours</label>
                    <input
                      type="text"
                      value={siteSettings.general.officeHours || ''}
                      onChange={(e) => handleInputChange('general', 'officeHours', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-8 mb-4">Logo & Favicon</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo</label>
                    <div className="flex items-center mt-2">
                      <div className="h-16 w-16 border rounded-md flex items-center justify-center overflow-hidden bg-gray-100">
                        {siteSettings.general.logo ? (
                          <img src={siteSettings.general.logo} alt="Logo preview" className="max-h-full" />
                        ) : (
                          <Image className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <button className="ml-4 px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 text-sm">
                        Change Logo
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 200 x 60px, PNG or SVG</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Favicon</label>
                    <div className="flex items-center mt-2">
                      <div className="h-10 w-10 border rounded-md flex items-center justify-center overflow-hidden bg-gray-100">
                        {siteSettings.general.favicon ? (
                          <img src={siteSettings.general.favicon} alt="Favicon preview" className="max-h-full" />
                        ) : (
                          <Image className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <button className="ml-4 px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 text-sm">
                        Change Favicon
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 32 x 32px, ICO or PNG</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Homepage Settings */}
            {activeSection === 'homepage' && (
              <div>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Homepage Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={siteSettings.homepage.heroTitle || ''}
                      onChange={(e) => handleInputChange('homepage', 'heroTitle', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                    <textarea
                      value={siteSettings.homepage.heroSubtitle || ''}
                      onChange={(e) => handleInputChange('homepage', 'heroSubtitle', e.target.value)}
                      className="w-full p-2 border rounded-md h-20"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Background Image</label>
                    <div className="mt-2 flex items-center">
                      <div className="h-32 w-64 border rounded-md flex items-center justify-center overflow-hidden bg-gray-100">
                        {siteSettings.homepage.heroImage ? (
                          <img src={siteSettings.homepage.heroImage} alt="Hero preview" className="w-full" />
                        ) : (
                          <Image className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <button className="ml-4 px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 text-sm">
                        Change Image
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 1920 x 1080px, JPEG or PNG</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Homepage Sections</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showAnnouncements"
                          checked={siteSettings.homepage.showAnnouncements || false}
                          onChange={() => handleCheckboxChange('homepage', 'showAnnouncements')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showAnnouncements" className="ml-2 block text-sm text-gray-900">
                          Show Announcements Section
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showUpcomingEvents"
                          checked={siteSettings.homepage.showUpcomingEvents || false}
                          onChange={() => handleCheckboxChange('homepage', 'showUpcomingEvents')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showUpcomingEvents" className="ml-2 block text-sm text-gray-900">
                          Show Upcoming Events Section
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showFacilities"
                          checked={siteSettings.homepage.showFacilities || false}
                          onChange={() => handleCheckboxChange('homepage', 'showFacilities')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showFacilities" className="ml-2 block text-sm text-gray-900">
                          Show Facilities Section
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showTestimonials"
                          checked={siteSettings.homepage.showTestimonials || false}
                          onChange={() => handleCheckboxChange('homepage', 'showTestimonials')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showTestimonials" className="ml-2 block text-sm text-gray-900">
                          Show Testimonials Section
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Featured Amenities</h3>
                    
                    <div className="space-y-3">
                      {siteSettings.homepage.featuredAmenities?.map((amenity, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span>{amenity}</span>
                          <button 
                            onClick={() => handleRemoveAmenity(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <div className="flex mt-3">
                        <input
                          type="text"
                          value={newAmenity}
                          onChange={(e) => setNewAmenity(e.target.value)}
                          placeholder="Add new amenity"
                          className="flex-grow p-2 border rounded-l-md"
                        />
                        <button 
                          onClick={handleAddAmenity}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md flex items-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Settings */}
            {activeSection === 'contact' && (
              <div>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Contact Page Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Google Maps Embed Code</label>
                    <textarea
                      value={siteSettings.contact.googleMapsEmbed || ''}
                      onChange={(e) => handleInputChange('contact', 'googleMapsEmbed', e.target.value)}
                      className="w-full p-2 border rounded-md h-24 font-mono text-sm"
                      placeholder="<iframe src='https://www.google.com/maps/embed?...' width='600' height='450' frameborder='0'></iframe>"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Paste the embed iframe code from Google Maps</p>
                  </div>
                  
                  {/* Multiple Locations */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Locations</h3>
                    
                    {siteSettings.contact.locations?.map((location, index) => (
                      <div key={index} className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Location {index + 1}</h4>
                          <button 
                            onClick={() => handleRemoveItem('contact', 'locations', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Name/Description</label>
                            <input
                              type="text"
                              value={location.name || ''}
                              onChange={(e) => handleItemChange('contact', 'locations', index, 'name', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Main Office, Branch Office, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Address</label>
                            <textarea
                              value={location.address || ''}
                              onChange={(e) => handleItemChange('contact', 'locations', index, 'address', e.target.value)}
                              className="w-full p-2 border rounded-md h-16"
                              placeholder="Full address"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleAddItem('contact', 'locations', {name: '', address: ''})}
                      className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add New Location
                    </button>
                  </div>
                  
                  {/* Multiple Phone Numbers */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Phone Numbers</h3>
                    
                    {siteSettings.contact.phoneNumbers?.map((phone, index) => (
                      <div key={index} className="mb-3 flex items-center">
                        <div className="flex-grow grid grid-cols-5 gap-2">
                          <input
                            type="text"
                            value={phone.label || ''}
                            onChange={(e) => handleItemChange('contact', 'phoneNumbers', index, 'label', e.target.value)}
                            className="col-span-2 p-2 border rounded-md"
                            placeholder="Label (e.g. Main, Support)"
                          />
                          <input
                            type="text"
                            value={phone.number || ''}
                            onChange={(e) => handleItemChange('contact', 'phoneNumbers', index, 'number', e.target.value)}
                            className="col-span-3 p-2 border rounded-md"
                            placeholder="Phone number"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveItem('contact', 'phoneNumbers', index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleAddItem('contact', 'phoneNumbers', {label: '', number: ''})}
                      className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Phone Number
                    </button>
                  </div>
                  
                  {/* Multiple Email Addresses */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Email Addresses</h3>
                    
                    {siteSettings.contact.emailAddresses?.map((email, index) => (
                      <div key={index} className="mb-3 flex items-center">
                        <div className="flex-grow grid grid-cols-5 gap-2">
                          <input
                            type="text"
                            value={email.label || ''}
                            onChange={(e) => handleItemChange('contact', 'emailAddresses', index, 'label', e.target.value)}
                            className="col-span-2 p-2 border rounded-md"
                            placeholder="Label (e.g. Info, Support)"
                          />
                          <input
                            type="email"
                            value={email.address || ''}
                            onChange={(e) => handleItemChange('contact', 'emailAddresses', index, 'address', e.target.value)}
                            className="col-span-3 p-2 border rounded-md"
                            placeholder="Email address"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveItem('contact', 'emailAddresses', index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleAddItem('contact', 'emailAddresses', {label: '', address: ''})}
                      className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Email Address
                    </button>
                  </div>
                  
                  {/* Multiple Office Hours */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Office Hours</h3>
                    
                    {siteSettings.contact.officeHours?.map((hours, index) => (
                      <div key={index} className="mb-3 flex items-center">
                        <div className="flex-grow grid grid-cols-5 gap-2">
                          <input
                            type="text"
                            value={hours.label || ''}
                            onChange={(e) => handleItemChange('contact', 'officeHours', index, 'label', e.target.value)}
                            className="col-span-2 p-2 border rounded-md"
                            placeholder="Label (e.g. Weekdays, Weekends)"
                          />
                          <input
                            type="text"
                            value={hours.hours || ''}
                            onChange={(e) => handleItemChange('contact', 'officeHours', index, 'hours', e.target.value)}
                            className="col-span-3 p-2 border rounded-md"
                            placeholder="Hours (e.g. Mon-Fri: 9:00 AM - 5:00 PM)"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveItem('contact', 'officeHours', index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleAddItem('contact', 'officeHours', {label: '', hours: ''})}
                      className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Office Hours
                    </button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Contact Form Recipients (comma-separated)</h3>
                    <input
                      type="text"
                      value={siteSettings.contact.contactFormRecipients?.join(', ') || ''}
                      onChange={(e) => handleInputChange('contact', 'contactFormRecipients', e.target.value.split(', '))}
                      className="w-full p-2 border rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">Emails from the contact form will be sent to these addresses</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Contact Information Display</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showPhysicalAddress"
                          checked={siteSettings.contact.showPhysicalAddress || false}
                          onChange={() => handleCheckboxChange('contact', 'showPhysicalAddress')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showPhysicalAddress" className="ml-2 block text-sm text-gray-900">
                          Show Physical Address
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showEmailAddress"
                          checked={siteSettings.contact.showEmailAddress || false}
                          onChange={() => handleCheckboxChange('contact', 'showEmailAddress')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showEmailAddress" className="ml-2 block text-sm text-gray-900">
                          Show Email Address
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showPhoneNumbers"
                          checked={siteSettings.contact.showPhoneNumbers || false}
                          onChange={() => handleCheckboxChange('contact', 'showPhoneNumbers')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showPhoneNumbers" className="ml-2 block text-sm text-gray-900">
                          Show Phone Numbers
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Social Media Settings */}
            {activeSection === 'social' && (
              <div>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Social Media Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Facebook Page URL</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Facebook className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={siteSettings.social.facebook || ''}
                        onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Instagram Profile URL</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Instagram className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={siteSettings.social.instagram || ''}
                        onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Twitter Profile URL</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Twitter className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={siteSettings.social.twitter || ''}
                        onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Social Sharing</h3>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableSocialSharing"
                        checked={siteSettings.social.enableSocialSharing || false}
                        onChange={() => handleCheckboxChange('social', 'enableSocialSharing')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableSocialSharing" className="ml-2 block text-sm text-gray-900">
                        Enable social sharing buttons on announcements and events
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* SEO Settings */}
            {activeSection === 'seo' && (
              <div>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">SEO Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={siteSettings.seo.metaTitle || ''}
                      onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea
                      value={siteSettings.seo.metaDescription || ''}
                      onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                      className="w-full p-2 border rounded-md h-20"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
                    <input
                      type="text"
                      value={siteSettings.seo.googleAnalyticsId || ''}
                      onChange={(e) => handleInputChange('seo', 'googleAnalyticsId', e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="UA-XXXXXXXX-X or G-XXXXXXXXXX"
                    />
                  </div>
                  
                  <div className="border-t pt-4">
  <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
  
  <div>
    <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
    <input
      type="text"
      value={siteSettings.seo.keywords?.join(', ') || ''}
      onChange={(e) => handleInputChange('seo', 'keywords', e.target.value.split(', '))}
      className="w-full p-2 border rounded-md"
    />
  </div>
  
  <div className="mt-4">
    <div className="flex items-center">
      <input
        type="checkbox"
        id="enableSitemap"
        checked={siteSettings.seo.enableSitemap || false}
        onChange={() => handleCheckboxChange('seo', 'enableSitemap')}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor="enableSitemap" className="ml-2 block text-sm text-gray-900">
        Generate XML sitemap
      </label>
    </div>
  </div>
</div> </div> </div>)}
{/* Security & Privacy Settings */}
{activeSection === 'security' && (
  <div>
    <h2 className="text-xl font-bold mb-6 pb-2 border-b">Security & Privacy Settings</h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Privacy Policy</label>
        <textarea
          value={siteSettings.security.privacyPolicy || ''}
          onChange={(e) => handleInputChange('security', 'privacyPolicy', e.target.value)}
          className="w-full p-2 border rounded-md h-64"
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">This will be displayed on the Privacy Policy page</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Terms & Conditions</label>
        <textarea
          value={siteSettings.security.termsConditions || ''}
          onChange={(e) => handleInputChange('security', 'termsConditions', e.target.value)}
          className="w-full p-2 border rounded-md h-64"
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">This will be displayed on the Terms & Conditions page</p>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Security Features</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableCaptcha"
              checked={siteSettings.security.enableCaptcha || false}
              onChange={() => handleCheckboxChange('security', 'enableCaptcha')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableCaptcha" className="ml-2 block text-sm text-gray-900">
              Enable CAPTCHA on forms
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableSsl"
              checked={siteSettings.security.enableSsl || false}
              onChange={() => handleCheckboxChange('security', 'enableSsl')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableSsl" className="ml-2 block text-sm text-gray-900">
              Force SSL (HTTPS)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableCookieConsent"
              checked={siteSettings.security.enableCookieConsent || false}
              onChange={() => handleCheckboxChange('security', 'enableCookieConsent')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableCookieConsent" className="ml-2 block text-sm text-gray-900">
              Enable Cookie Consent Banner
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
)}</div>
{/* Notifications Settings */}
{activeSection === 'notifications' && (
  <div>
    <h2 className="text-xl font-bold mb-6 pb-2 border-b">Notifications Settings</h2>
    
    <div className="space-y-6">
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyOnNewEnquiry"
              checked={siteSettings.notifications.notifyOnNewEnquiry || false}
              onChange={() => handleCheckboxChange('notifications', 'notifyOnNewEnquiry')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifyOnNewEnquiry" className="ml-2 block text-sm text-gray-900">
              Notify admin on new contact form submissions
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyOnNewBooking"
              checked={siteSettings.notifications.notifyOnNewBooking || false}
              onChange={() => handleCheckboxChange('notifications', 'notifyOnNewBooking')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifyOnNewBooking" className="ml-2 block text-sm text-gray-900">
              Notify admin on new facility bookings
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyOnNewComment"
              checked={siteSettings.notifications.notifyOnNewComment || false}
              onChange={() => handleCheckboxChange('notifications', 'notifyOnNewComment')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifyOnNewComment" className="ml-2 block text-sm text-gray-900">
              Notify admin on new announcement comments
            </label>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">User Notifications</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendBookingConfirmation"
              checked={siteSettings.notifications.sendBookingConfirmation || false}
              onChange={() => handleCheckboxChange('notifications', 'sendBookingConfirmation')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sendBookingConfirmation" className="ml-2 block text-sm text-gray-900">
              Send booking confirmation emails to users
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendEventReminders"
              checked={siteSettings.notifications.sendEventReminders || false}
              onChange={() => handleCheckboxChange('notifications', 'sendEventReminders')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sendEventReminders" className="ml-2 block text-sm text-gray-900">
              Send event reminder emails to registered users
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendNewsletter"
              checked={siteSettings.notifications.sendNewsletter || false}
              onChange={() => handleCheckboxChange('notifications', 'sendNewsletter')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sendNewsletter" className="ml-2 block text-sm text-gray-900">
              Send newsletter for new announcements
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsAdmin;