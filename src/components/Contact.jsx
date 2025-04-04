"use client";
import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUser, FaPencilAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    inquiry: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [contactSettings, setContactSettings] = useState({
    phoneNumbers: [],
    emailAddresses: [],
    locations: [],
    officeHours: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch contact settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const result = await response.json();
        
        if (result.success && result.data.contact) {
          setContactSettings(result.data.contact);
        } else {
          console.error("Failed to load contact settings");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", phone: "", email: "", inquiry: "", message: "" });
        setErrors({});
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Get primary phone number to display
  const getPrimaryPhone = () => {
    if (contactSettings.phoneNumbers && contactSettings.phoneNumbers.length > 0) {
      return contactSettings.phoneNumbers[0].number;
    }
    return "+91 8787574657"; // Fallback
  };

  // Get primary email to display
  const getPrimaryEmail = () => {
    if (contactSettings.emailAddresses && contactSettings.emailAddresses.length > 0) {
      return contactSettings.emailAddresses[0].address;
    }
    return "rahulnagarassociation1@gmail.com"; // Fallback
  };

  // Get primary location to display
  const getLocation = () => {
    if (contactSettings.locations && contactSettings.locations.length > 0) {
      return contactSettings.locations[0].address;
    }
    return "Rahul Nagar, Near Karve Statue, Kothrud, Pune-411038"; // Fallback
  };

  // Get office hours to display
  const getOfficeHours = () => {
    if (contactSettings.officeHours && contactSettings.officeHours.length > 0) {
      return contactSettings.officeHours.map(oh => `${oh.label}: ${oh.hours}`).join(", ");
    }
    return "Mon - Sat: 09am - 07pm"; // Fallback
  };

  return (
    <div className="relative w-full min-h-screen bg-white">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 h-3/4 bg-cover bg-center object-contain w-full" style={{ backgroundImage: "url('/home/contact.svg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center py-12">
        {/* Contact Info Cards */}
        <div className="max-w-8xl w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          {/* Phone Number Card */}
          <div className="bg-white shadow-lg p-6 flex items-center rounded-lg gap-2">
            <Image src="/home/contact/right.png" width={1920} height={1080} className="w-12 h-12 text-yellow-500 text-3xl object-contain" alt="Phone" />
            <div className="ml-2 flex flex-col items-start">
              <h3 className="font-bold text-lg">Phone Number</h3>
              <a 
                href={`tel:${getPrimaryPhone().replace(/\s+/g, '')}`} 
                className="text-gray-500 break-words text-sm text-center underline hover:text-yellow-600"
              >
                {getPrimaryPhone()}
              </a>
            </div>
          </div>

          {/* Email Address Card */}
          <div className="bg-white shadow-lg p-6 flex items-center rounded-lg gap-2">
            <Image src="/home/contact/email.png" width={1920} height={1080} className="w-12 h-12 text-yellow-500 text-3xl object-contain" alt="Email" />
            <div className="ml-2 flex flex-col items-start">
              <h3 className="font-bold text-lg">Email Address</h3>
              <a 
                href={`mailto:${getPrimaryEmail()}`} 
                className="text-gray-500 break-words text-sm text-center underline hover:text-yellow-600"
              >
                {getPrimaryEmail()}
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white shadow-lg p-6 flex items-center rounded-lg gap-2">
            <Image src="/home/contact/map.png" width={1920} height={1080} className="w-12 h-12 text-yellow-500 text-3xl object-contain" alt="Location" />
            <div className="ml-2 flex flex-col items-start">
              <h3 className="font-bold text-lg">Our Location</h3>
              <p className="text-gray-500 break-words text-sm text-start">{getLocation()}</p>
            </div>
          </div>

          {/* Office Hours Card */}
          <div className="bg-white shadow-lg p-6 flex items-center rounded-lg gap-2">
            <Image src="/home/contact/time.png" width={1920} height={1080} className="w-12 h-12 text-yellow-500 text-3xl object-contain" alt="Office Hours" />
            <div className="ml-2 flex flex-col items-start">
              <h3 className="font-bold text-lg">Office Hours</h3>
              <p className="text-gray-500 break-words text-sm text-start">{getOfficeHours()}</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg mt-12 flex flex-col md:flex-row">
          {/* Left Side - Info */}
          <div 
            className="w-full md:w-1/2 bg-[#FDBF22] text-white p-16 rounded-l-lg flex flex-col items-center justify-start gap-5 relative"
            style={{ backgroundImage: "url('/home/contact/vector.svg')", backgroundSize: "cover", backgroundPosition: "center", objectFit: "contain" }}
          >
            <div className="flex items-center gap-2 text-[#B57E10] justify-center lg:justify-start w-full">
              <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
              <h2 className="text-sm md:text-base">Let's talk</h2>
            </div>
            <h2 className="text-3xl font-bold mt-2 text-black">Have any query in Mind? Contact With Us</h2>
            <p className="mt-4 text-[#6A6A6A]">
              Got questions or suggestions? Reach out to us! Fill the form below or call/email directly. We&apos;re here to help.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-10">
            <h3 className="text-2xl font-bold text-gray-800 text-center">Request A Query or Grievance</h3>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center border border-gray-300 p-3 rounded-md">
                    <FaUser className="text-gray-500 mr-2" />
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Name" 
                      className="w-full outline-none" 
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center border border-gray-300 p-3 rounded-md">
                    <FaPhone className="text-gray-500 mr-2" />
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="Phone Number" 
                      className="w-full outline-none" 
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center border border-gray-300 p-3 rounded-md">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="Email Address" 
                      className="w-full outline-none" 
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Dropdown for Work Inquiry */}
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
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Query or Grievance Details" 
                  className="w-full outline-none" 
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-yellow-700 text-white py-3 rounded-md font-bold">
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;