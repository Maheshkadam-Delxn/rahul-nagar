"use client"
import React, { useState } from 'react';
import { Settings, Save, Image, Edit, Home, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Calendar, FileText, Shield, Eye, EyeOff, Clock, X, Plus, Trash2, HelpCircle, AlertTriangle, Bell } from 'lucide-react';
  import { useAuth } from '@/context/AuthContext';

const SiteSettingsAdmin = () => {
    const {user} = useAuth()
  
  // Initial state for site settings
  const [siteSettings, setSiteSettings] = useState({
    general: {
      societyName: "Harmony Heights Cooperative Housing Society",
      tagline: "Building Community, Creating Homes",
      foundedYear: 1995,
      registrationNumber: "COOP-12345-HSG",
      address: "123 Community Lane, Harmony District, City - 400001",
      email: "info@harmonyheights.org",
      phone: "+1 (555) 123-4567",
      alternatePhone: "+1 (555) 765-4321",
      officeHours: "Mon-Sat: 9:00 AM - 6:00 PM",
      logo: "/images/society-logo.png",
      favicon: "/images/favicon.ico"
    },
    homepage: {
      heroTitle: "Welcome to Harmony Heights",
      heroSubtitle: "A community-driven cooperative housing society where neighbors become family",
      heroImage: "/images/hero-image.jpg",
      showAnnouncements: true,
      showUpcomingEvents: true,
      showFacilities: true,
      showTestimonials: true,
      featuredAmenities: [
        "24/7 Security",
        "Community Garden",
        "Children's Play Area",
        "Fitness Center",
        "Community Hall"
      ]
    },
    contact: {
      googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!...",
      contactFormRecipients: ["secretary@harmonyheights.org", "admin@harmonyheights.org"],
      showPhysicalAddress: true,
      showEmailAddress: true,
      showPhoneNumbers: true
    },
    social: {
      facebook: "https://facebook.com/harmonyheights",
      instagram: "https://instagram.com/harmonyheights",
      twitter: "https://twitter.com/harmonyheights",
      enableSocialSharing: true
    },
    seo: {
      metaTitle: "Harmony Heights Cooperative Housing Society | Building Community",
      metaDescription: "Harmony Heights is a premier cooperative housing society focused on community living, security, and modern amenities for all residents.",
      enableSitemap: true,
      enableRobotsTxt: true,
      googleAnalyticsId: "UA-12345678-1"
    },
    security: {
      enableCaptchaOnForms: true,
      privacyPolicyLastUpdated: "2024-11-15",
      cookieConsentEnabled: true
    },
    notifications: {
      enableEmailNotifications: true,
      enableBrowserNotifications: false,
      notifyOnNewAnnouncements: true,
      notifyOnNewEvents: true,
      notifyOnMaintenanceSchedules: true,
      notifyOnBillingUpdates: true
    }
  });

  // State for active section
  const [activeSection, setActiveSection] = useState('general');
  
  // State for unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // State for showing success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // State for handling amenities
  const [newAmenity, setNewAmenity] = useState('');
  
  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setSiteSettings({
      ...siteSettings,
      [section]: {
        ...siteSettings[section],
        [field]: value
      }
    });
    setHasUnsavedChanges(true);
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (section, field) => {
    setSiteSettings({
      ...siteSettings,
      [section]: {
        ...siteSettings[section],
        [field]: !siteSettings[section][field]
      }
    });
    setHasUnsavedChanges(true);
  };
  
  // Handle amenity addition
  const handleAddAmenity = () => {
    if (newAmenity.trim() !== '') {
      const updatedAmenities = [
        ...siteSettings.homepage.featuredAmenities,
        newAmenity.trim()
      ];
      
      setSiteSettings({
        ...siteSettings,
        homepage: {
          ...siteSettings.homepage,
          featuredAmenities: updatedAmenities
        }
      });
      
      setNewAmenity('');
      setHasUnsavedChanges(true);
    }
  };
  
  // Handle amenity removal
  const handleRemoveAmenity = (index) => {
    const updatedAmenities = siteSettings.homepage.featuredAmenities.filter((_, i) => i !== index);
    
    setSiteSettings({
      ...siteSettings,
      homepage: {
        ...siteSettings.homepage,
        featuredAmenities: updatedAmenities
      }
    });
    
    setHasUnsavedChanges(true);
  };
  
  // Handle form submission
  const handleSaveSettings = () => {
    // In a real application, this would send data to a backend API
    console.log("Saving settings:", siteSettings);
    
    // Show success message
    setShowSuccessMessage(true);
    setHasUnsavedChanges(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  
  // Get navigation class based on active section
  const getNavClass = (section) => {
    return `flex items-center p-3 rounded-md ${activeSection === section 
      ? 'bg-blue-100 text-blue-700' 
      : 'hover:bg-gray-100'}`;
  };
  
  return (
    user?.role === "Super-Admin"  ? 

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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
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
                      value={siteSettings.general.societyName}
                      onChange={(e) => handleInputChange('general', 'societyName', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Tagline</label>
                    <input
                      type="text"
                      value={siteSettings.general.tagline}
                      onChange={(e) => handleInputChange('general', 'tagline', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Year Founded</label>
                    <input
                      type="number"
                      value={siteSettings.general.foundedYear}
                      onChange={(e) => handleInputChange('general', 'foundedYear', parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={siteSettings.general.registrationNumber}
                      onChange={(e) => handleInputChange('general', 'registrationNumber', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={siteSettings.general.address}
                      onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                      className="w-full p-2 border rounded-md h-20"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      value={siteSettings.general.email}
                      onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings.general.phone}
                      onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Alternate Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings.general.alternatePhone}
                      onChange={(e) => handleInputChange('general', 'alternatePhone', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Office Hours</label>
                    <input
                      type="text"
                      value={siteSettings.general.officeHours}
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
                          <img src="/api/placeholder/100/100" alt="Logo preview" className="max-h-full" />
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
                          <img src="/api/placeholder/32/32" alt="Favicon preview" className="max-h-full" />
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
                      value={siteSettings.homepage.heroTitle}
                      onChange={(e) => handleInputChange('homepage', 'heroTitle', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                    <textarea
                      value={siteSettings.homepage.heroSubtitle}
                      onChange={(e) => handleInputChange('homepage', 'heroSubtitle', e.target.value)}
                      className="w-full p-2 border rounded-md h-20"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Background Image</label>
                    <div className="mt-2 flex items-center">
                      <div className="h-32 w-64 border rounded-md flex items-center justify-center overflow-hidden bg-gray-100">
                        {siteSettings.homepage.heroImage ? (
                          <img src="/api/placeholder/320/160" alt="Hero preview" className="w-full" />
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
                          checked={siteSettings.homepage.showAnnouncements}
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
                          checked={siteSettings.homepage.showUpcomingEvents}
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
                          checked={siteSettings.homepage.showFacilities}
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
                          checked={siteSettings.homepage.showTestimonials}
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
                      {siteSettings.homepage.featuredAmenities.map((amenity, index) => (
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
                      value={siteSettings.contact.googleMapsEmbed}
                      onChange={(e) => handleInputChange('contact', 'googleMapsEmbed', e.target.value)}
                      className="w-full p-2 border rounded-md h-24 font-mono text-sm"
                      placeholder="<iframe src='https://www.google.com/maps/embed?...' width='600' height='450' frameborder='0'></iframe>"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Paste the embed iframe code from Google Maps</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Form Recipients (comma-separated)</label>
                    <input
                      type="text"
                      value={siteSettings.contact.contactFormRecipients.join(', ')}
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
                          checked={siteSettings.contact.showPhysicalAddress}
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
                          checked={siteSettings.contact.showEmailAddress}
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
                          checked={siteSettings.contact.showPhoneNumbers}
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
                        value={siteSettings.social.facebook}
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
                        value={siteSettings.social.instagram}
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
                        value={siteSettings.social.twitter}
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
                        checked={siteSettings.social.enableSocialSharing}
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
                      value={siteSettings.seo.metaTitle}
                      onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea
                      value={siteSettings.seo.metaDescription}
                      onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                      className="w-full p-2 border rounded-md h-20"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
                    <input
                      type="text"
                      value={siteSettings.seo.googleAnalyticsId}
                      onChange={(e) => handleInputChange('seo', 'googleAnalyticsId', e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="UA-XXXXXXXX-X or G-XXXXXXXXXX"
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">SEO Tools</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableSitemap"
                          checked={siteSettings.seo.enableSitemap}
                          onChange={() => handleCheckboxChange('seo', 'enableSitemap')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="enableSitemap" className="ml-2 block text-sm text-gray-900">
                          Generate XML Sitemap
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableRobotsTxt"
                          checked={siteSettings.seo.enableRobotsTxt}
                          onChange={() => handleCheckboxChange('seo', 'enableRobotsTxt')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="enableRobotsTxt" className="ml-2 block text-sm text-gray-900">
                          Generate robots.txt file
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Security & Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">CAPTCHA Protection</h3>
                      <p className="text-sm text-gray-500">Protect forms from spam and bot submissions</p>
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={siteSettings.security.enableCaptchaOnForms}
                          onChange={() => handleCheckboxChange('security', 'enableCaptchaOnForms')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Cookie Consent</h3>
                      <p className="text-sm text-gray-500">Show cookie consent banner to comply with privacy regulations</p>
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={siteSettings.security.cookieConsentEnabled}
                          onChange={() => handleCheckboxChange('security', 'cookieConsentEnabled')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Privacy Policy</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Updated Date</label>
                      <input
                        type="date"
                        value={siteSettings.security.privacyPolicyLastUpdated}
                        onChange={(e) => handleInputChange('security', 'privacyPolicyLastUpdated', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                      <p className="text-xs text-gray-500 mt-1">This date will be displayed on the privacy policy page</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Send email notifications to residents</p>
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={siteSettings.notifications.enableEmailNotifications}
                          onChange={() => handleCheckboxChange('notifications', 'enableEmailNotifications')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Browser Notifications</h3>
                      <p className="text-sm text-gray-500">Allow browser push notifications for logged-in users</p>
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={siteSettings.notifications.enableBrowserNotifications}
                          onChange={() => handleCheckboxChange('notifications', 'enableBrowserNotifications')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Notification Events</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifyOnNewAnnouncements"
                          checked={siteSettings.notifications.notifyOnNewAnnouncements}
                          onChange={() => handleCheckboxChange('notifications', 'notifyOnNewAnnouncements')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifyOnNewAnnouncements" className="ml-2 block text-sm text-gray-900">
                          New Announcements
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifyOnNewEvents"
                          checked={siteSettings.notifications.notifyOnNewEvents}
                          onChange={() => handleCheckboxChange('notifications', 'notifyOnNewEvents')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifyOnNewEvents" className="ml-2 block text-sm text-gray-900">
                          Upcoming Events
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifyOnMaintenanceSchedules"
                          checked={siteSettings.notifications.notifyOnMaintenanceSchedules}
                          onChange={() => handleCheckboxChange('notifications', 'notifyOnMaintenanceSchedules')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifyOnMaintenanceSchedules" className="ml-2 block text-sm text-gray-900">
                          Maintenance Schedules
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifyOnBillingUpdates"
                          checked={siteSettings.notifications.notifyOnBillingUpdates}
                          onChange={() => handleCheckboxChange('notifications', 'notifyOnBillingUpdates')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifyOnBillingUpdates" className="ml-2 block text-sm text-gray-900">
                          Billing Updates
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
    </div>:<p>You Dnnt have access to this page</p>
  );
};

export default SiteSettingsAdmin;