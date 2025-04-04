// models/SiteSettings.js
import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  general: {
    societyName: { type: String, required: true },
    tagline: { type: String },
    foundedYear: { type: Number },
    registrationNumber: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
    alternatePhone: { type: String },
    officeHours: { type: String },
    logo: { type: String },
    favicon: { type: String }
  },
  homepage: {
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    heroImage: { type: String },
    showAnnouncements: { type: Boolean, default: true },
    showUpcomingEvents: { type: Boolean, default: true },
    showFacilities: { type: Boolean, default: true },
    showTestimonials: { type: Boolean, default: true },
    featuredAmenities: [{ type: String }]
  },
  contact: {
    googleMapsEmbed: { type: String },
    contactFormRecipients: [{ type: String }],
    showPhysicalAddress: { type: Boolean, default: true },
    showEmailAddress: { type: Boolean, default: true },
    showPhoneNumbers: { type: Boolean, default: true },
    
    // New fields for multiple values
    locations: [{
      name: { type: String },
      address: { type: String }
    }],
    phoneNumbers: [{
      label: { type: String },
      number: { type: String }
    }],
    emailAddresses: [{
      label: { type: String },
      address: { type: String }
    }],
    officeHours: [{
      label: { type: String },
      hours: { type: String }
    }]
  },
  social: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    enableSocialSharing: { type: Boolean, default: true }
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    enableSitemap: { type: Boolean, default: true },
    enableRobotsTxt: { type: Boolean, default: true },
    googleAnalyticsId: { type: String }
  },
  security: {
    enableCaptchaOnForms: { type: Boolean, default: true },
    privacyPolicyLastUpdated: { type: Date },
    cookieConsentEnabled: { type: Boolean, default: true }
  },
  notifications: {
    enableEmailNotifications: { type: Boolean, default: true },
    enableBrowserNotifications: { type: Boolean, default: false },
    notifyOnNewAnnouncements: { type: Boolean, default: true },
    notifyOnNewEvents: { type: Boolean, default: true },
    notifyOnMaintenanceSchedules: { type: Boolean, default: true },
    notifyOnBillingUpdates: { type: Boolean, default: true }
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedBy: {
    type: String
  }
});
delete mongoose.models.SiteSettings
export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);