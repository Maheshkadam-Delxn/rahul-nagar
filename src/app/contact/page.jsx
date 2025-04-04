"use client"
import React, { useState, useEffect } from 'react'
import ServiceHeroSection from "@/components/ServiceHeroSection"
import { MapPin, Mail, Phone } from "lucide-react"
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaPencilAlt, FaClock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    inquiry: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const result = await response.json();
        
        if (result.success && result.data) {
          setSettings(result.data);
        } else {
          console.error('Failed to get settings data');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Form
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 3) newErrors.name = "Name must be at least 3 characters";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number (10 digits required)";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.inquiry.trim()) newErrors.inquiry = "Inquiry field is required";

    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.length < 10) newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        inquiry: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
    }
  };

  // Get society name from settings or use default
  const societyName = settings?.general?.societyName || "Rahul Nagar";
  
  // Get locations from settings or use default
  const locations = settings?.contact?.locations || [
    { name: "Main Office", address: "Rahul Nagar, Near Karve Statue, Kothrud, Pune - 411038" }
  ];
  
  // Get email addresses from settings or use default
  const emailAddresses = settings?.contact?.emailAddresses || [
    { label: "General", address: "rahulnagarassociation1@gmail.com" }
  ];
  
  // Get phone numbers from settings or use default
  const phoneNumbers = settings?.contact?.phoneNumbers || [
    { label: "Office", number: "+91 8787574657" },
    { label: "Alternative", number: "+91 9875847584" }
  ];
  
  // Get Google Maps embed from settings or use default
  const googleMapsEmbed = settings?.contact?.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.6540781664557!2d73.8153475!3d18.499321800000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfc109bfffff%3A0xcd2b5954a8fd421e!2sRahul%20Nagar%20Housing%20Society!5e0!3m2!1sen!2sin!4v1742984876297!5m2!1sen!2sin";
  
  // Get office hours from settings or use default
  const officeHours = settings?.contact?.officeHours || [
    { label: "Weekdays", hours: "9:00 AM - 6:00 PM" },
    { label: "Saturday", hours: "10:00 AM - 2:00 PM" }
  ];

  return (
    <div className='w-full min-h-screen'>
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-30 blur-lg"></div>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-purple-400 rounded-full opacity-25 blur-3xl"></div>

      <Toaster/>
      <ServiceHeroSection
        name={`Contact ${societyName}`}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Contact Us", link: "/contact" },
        ]}
      />
      
      {/* Contact Cards Section */}
      <div className='w-full bg-white py-12 md:py-24 px-4 md:px-0 flex items-center justify-center'>
        <div className='w-full max-w-6xl flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6'>
          
          {/* Location Card */}
          <div className='w-full sm:w-[45%] md:w-1/3 lg:w-1/4 flex flex-col items-center p-4 md:p-6 rounded-lg border border-slate-200'>
            <MapPin className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4 text-yellow-600" />
            <h3 className="text-base md:text-lg font-semibold">Our Location</h3>
            <div className="text-sm md:text-base text-gray-600 text-center">
              {locations.map((location, index) => (
                <p key={index} className="mb-1">
                 
                  {location.address}
                </p>
              ))}
            </div>
          </div>

          {/* Email Card */}
          <div className='w-full sm:w-[45%] md:w-1/3 lg:w-1/4 flex flex-col items-center p-4 md:p-6 rounded-lg border border-slate-200'>
            <Mail className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4 text-yellow-600" />
            <h3 className="text-base md:text-lg font-semibold">Email Address</h3>
            <div className="flex flex-col items-center">
              {emailAddresses.map((email, index) => (
                <a key={index} href={`mailto:${email.address}`} className="text-sm md:text-base text-gray-600">
                 
                  {email.address}
                </a>
              ))}
            </div>
          </div>

          {/* Phone Number Card */}
          <div className='w-full sm:w-[45%] md:w-1/3 lg:w-1/4 flex flex-col items-center p-4 md:p-6 rounded-lg border border-slate-200'>
            <Phone className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4 text-yellow-600" />
            <h3 className="text-base md:text-lg font-semibold">Phone Number</h3>
            <div className="flex flex-col items-center">
              {phoneNumbers.map((phone, index) => (
                <a key={index} href={`tel:${phone.number.replace(/\s+/g, '')}`} className="text-sm md:text-base text-gray-600">
                 
                  {phone.number}
                </a>
              ))}
            </div>
          </div>

          {/* Office Hours Card - Added from settings */}
          {/* <div className='w-full sm:w-[45%] md:w-1/3 lg:w-1/4 flex flex-col items-center p-4 md:p-6 rounded-lg border border-slate-200'>
            <FaClock className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4 text-yellow-600" />
            <h3 className="text-base md:text-lg font-semibold">Office Hours</h3>
            <div className="flex flex-col items-center">
              {officeHours.map((hours, index) => (
                <p key={index} className="text-sm md:text-base text-gray-600">
                  <span className="font-medium">{hours.label}: </span>
                  {hours.hours}
                </p>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Map Display Section */}
      <div className='w-full h-[30vh] sm:h-[40vh] md:h-[50vh] p-3 md:p-5 bg-white'>
        <iframe 
          className="w-full h-full rounded-lg"
          src={googleMapsEmbed}
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      
      {/* Contact Us Section */}
      <div className='w-full bg-white py-12 md:py-24 flex items-center justify-center'>
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start px-4 sm:px-6 md:px-10 py-8 md:py-16">
          {/* Left Side Heading */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">Contact Us</h2>
            {settings?.general?.tagline && (
              <p className="text-lg text-gray-600 mt-4">{settings.general.tagline}</p>
            )}
          </div>

          {/* Right Side Form */}
          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Get in touch</h3>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center border border-gray-300 p-3 rounded-md">
                    <FaUser className="text-gray-500 mr-2" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full outline-none" />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center border border-gray-300 p-3 rounded-md">
                    <FaPhone className="text-gray-500 mr-2" />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full outline-none" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center border border-gray-300 p-3 rounded-md">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full outline-none" />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <select 
                    name="inquiry" 
                    value={formData.inquiry} 
                    onChange={handleChange} 
                    className="w-full outline-none bg-transparent"
                  >
                    <option value="" disabled>Select Work Inquiry</option>
                    <option value="inquiry">Inquiry</option>
                    <option value="suggestions">Suggestions</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center border border-gray-300 p-3 rounded-md">
                <FaPencilAlt className="text-gray-500 mr-2" />
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Query or Grievance Details" className="w-full outline-none" rows="3"></textarea>
              </div>

              <button className="w-full bg-yellow-700 text-white py-3 rounded-md font-bold cursor-pointer">Submit Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage