"use client";
import React from 'react'
import ServiceHeroSection from "@/components/ServiceHeroSection";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MoveRight, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import ConstructionIcon from "../../../public/home/events/icon.png";
import ConstructionIconn from "../../../public/home/events/iconn.svg";
import toast, { Toaster } from "react-hot-toast";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Add the necessary Swiper CSS imports
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import BuildingMap1 from "../../../public/home/layout/layout1.png";
import BuildingMap2 from "../../../public/home/layout/layout2.png";
import BuildingMap3 from "../../../public/home/layout/layout3.png";
import BuildingMap4 from "../../../public/home/layout/layout4.png";

const Page = () => {
    //currently we have directly fetched the default events and the default updates but in future we will be using the API calls for this redevelopment 
    const [events, setEvents] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [openFaqItem, setOpenFaqItem] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const maps = [BuildingMap1, BuildingMap2, BuildingMap3, BuildingMap4];
    
    // State for form data
    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      email: "",
      website: "",
      message: ""
    });

    // State for form errors
    const [errors, setErrors] = useState({});
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const updatesRes = await fetch("/api/redevelopment/update/fetchAll?limit=3");
          if (!updatesRes.ok) throw new Error("Failed to fetch updates");
          const updatesData = await updatesRes.json();
          setUpdates(updatesData);
  
          const eventsRes = await fetch("/api/redevelopment/event/fetchAll?limit=3");
          if (!eventsRes.ok) throw new Error("Failed to fetch events");
          const eventsData = await eventsRes.json();
          setEvents(eventsData.events);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);
  
    const trimText = (text, maxLength) => {
      return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const faqData = [
      {
        title: "What is Project Timing in Construction?",
        content: "Bennings appetite disposed me an at subjects an. To no indulgence diminution so discovered mr apartments. Are off under folly death wrote cause her way spite. Plan upon yet way get cold spot its week. Almost do am or limits hearts. Resolve parties but why she shewing. She sang know now minute exact dear open to reaching out."
      },
      {
        title: "What Are The Charges of Renovation?",
        content: "Renovation charges vary based on the scope of work, materials used, and labor costs. Our transparent pricing structure includes demolition, materials, labor, permits, and finishing touches. We provide detailed quotes before beginning any project to ensure you understand all associated costs."
      },
      {
        title: "How to contact our Support Team?",
        content: "Our support team is available Monday through Friday from 8am to 6pm. You can reach us by phone at (555) 123-4567, by email at support@constructionco.com, or through the contact form on our website. For urgent matters outside business hours, please use our emergency hotline at (555) 987-6543."
      },
      {
        title: "How Are Construction Permits Obtained?",
        content: "Construction permits are obtained through your local building department. Our team handles the entire process, including preparing documentation, submitting applications, and following up with authorities. We ensure all necessary permits are secured before beginning work to avoid potential delays or legal issues."
      }
    ];
    
    const toggleFaqItem = (index) => {
      setOpenFaqItem(openFaqItem === index ? -1 : index);
    };

    // Handle input change
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate Form
    const validateForm = () => {
      let newErrors = {};

      if (!formData.name.trim()) newErrors.name = "Developer name is required";
      else if (formData.name.length < 3) newErrors.name = "Name must be at least 3 characters";

      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number (10 digits required)";

      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
        newErrors.email = "Invalid email address";

      if (formData.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([\/\w-]*)*\/?$/.test(formData.website))
        newErrors.website = "Invalid website URL";

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

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/redevelopmentContact', {
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
          website: "",
          message: "",
        });
        setErrors({});
      } catch (error) {
        toast.error(error.message || "Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };
  
  return (
    <>
    <div className='w-full min-h-screen'>
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-30 blur-lg"></div>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-purple-400 rounded-full opacity-25 blur-3xl"></div>
  
      <Toaster />
      
      <ServiceHeroSection
        name="Redevelopment"
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Redevelopment", link: "/Redevelopment" },
        ]}
      />
      
      {/* Updates Section and events */}
      <div className="w-full bg-[#f8f8f8] min-h-[50vh] flex items-center justify-center py-12 md:py-24 px-4">
        <div className="w-full max-w-6xl flex flex-col items-center gap-8 md:gap-10">
          <div className="flex flex-col items-start gap-4 md:gap-5 w-full">
            <div className="flex items-center gap-2 text-[#B57E10]">
              <hr className="w-8 md:w-12 border-t border-2 rounded-full" />
              <h1 className="text-sm md:text-base">Stay Updated with latest information</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center w-full justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left w-full">
                Redevelopment Latest Updates & Upcoming Events
              </h1>
            </div>
          </div>
  
          <div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch justify-center gap-5">
            <div className="bg-white shadow-2xl rounded-lg p-5 md:p-6 flex flex-col gap-4 md:gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-5">
                  <Image src={ConstructionIcon} alt="Construction Icon" width={64} height={64} className="w-12 h-12 md:w-16 md:h-16" />
                  <h1 className="text-base md:text-lg text-[#B57E10] font-medium">
                    Latest Updates of Redevelopment
                  </h1>
                </div>
                <Link href="/redevlopmentUpdates" className="text-xs md:text-sm text-[#B57E10] font-medium">
                  Check All →
                </Link>
              </div>
              <div className="flex flex-col gap-4 md:gap-10 w-full">
          {updates.length > 0 ? (
            updates.map((update) => (
              <div key={update._id} className="bg-white p-2 ">
                <div className="flex flex-col gap-2 md:gap-3">
                  {/* Author & Date Info */}
                  <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1 md:gap-2">
                      <User size={14} color="red" />
                      {update.createdBy?.userName || "Unknown User"}
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Calendar size={14} color="red" />
                      {new Date(update.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-lg md:text-xl font-bold">{update.title}</h2>
                  
                  {/* Image (if available) */}
                  {/* {update.image && (
                    <div className="my-2">
                      <Image 
                        src={update.image} 
                        alt={update.title} 
                        width={600} 
                        height={300} 
                        className="w-full rounded-lg object-cover h-40" 
                      />
                    </div>
                  )}
                   */}
                  {/* Description or Content */}
                  <p className="text-xs md:text-sm opacity-45 font-medium">
                    {trimText(update.description || update.content, 70)}
                  </p>
                  
                  {/* Read More Link */}
                  <Link 
                    href={`/redevlopmentUpdates/${update._id}`} 
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#B57E10]"
                  >
                    Read More <MoveRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">No latest updates.</p>
          )}
        </div>
            </div>
  
            <div className="bg-white shadow-2xl rounded-lg p-5 md:p-6 flex flex-col gap-4 md:gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-5">
                  <Image src={ConstructionIcon} alt="Construction Icon" width={64} height={64} className="w-12 h-12 md:w-16 md:h-16" />
                  <h1 className="text-base md:text-lg text-[#B57E10] font-medium">
                    Upcoming Events / Meetings
                  </h1>
                </div>
                <Link href="/redevelopmentEvents" className="text-xs md:text-sm text-[#B57E10] font-medium">
                  Check All →
                </Link>
              </div>
              <div className="flex flex-col gap-4 md:gap-5 w-full">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event._id} className="flex flex-col gap-2 md:gap-3 bg-white  p-2  ">
                      <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-1 md:gap-2">
                          <User size={14} color="red" />
                          By Admin
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <Calendar size={14} color="red" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <div className="flex flex-col gap-1 md:gap-2">
                          <h1 className="text-lg md:text-xl font-bold">{event.title}</h1>
                          <p className="text-xs md:text-sm opacity-45 font-medium">{trimText(event.description, 70)}</p>
                          <Link href={`/redevelopmentEvents/${event._id}`} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#B57E10]">
                            Read More <MoveRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm">No upcoming events.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End of Updates section */}
    </div>
    
    {/* Layout map section */}
    <div className="w-full bg-white py-12 md:py-24 px-4 md:px-0 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-start gap-8 md:gap-14">
        <h1 className="text-3xl md:text-4xl mx-auto font-semibold">Notice & Advertisements</h1>
        
        <div className="w-full h-[400px] md:h-[500px]"> {/* Fixed height container for the swiper */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-full rounded-lg overflow-hidden"
          >
            {maps.map((map, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    width={1920}
                    height={1080}
                    src={map}
                    alt={`Building Map ${index + 1}`}
                    className="w-full h-full object-contain"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>

    {/* Tender Information Section */}
    <div className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center gap-8 mb-10">
          <div className="flex items-center gap-3">
            <hr className="w-10 border-t-2 border-[#B57E10] rounded-full" />
            <h2 className="text-[#B57E10] font-medium">Tender Information</h2>
            <hr className="w-10 border-t-2 border-[#B57E10] rounded-full" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center">Project Tender Details</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Date of Tender */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-amber-50 p-3">
                <Image 
                  src={ConstructionIconn} 
                  alt="Construction Icon" 
                  width={1920} 
                  height={1080} 
                  className="w-16 h-16"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Total Land Area</h3>
                <p className="text-gray-600">1,60,383.60 sq.ft.</p>
              </div>
            </div>
          </div>
          
          {/* No. of Tenders */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-amber-50 p-3">
                <Image 
                  src={ConstructionIconn} 
                  alt="Construction Icon" 
                  width={1920} 
                  height={1080} 
                  className="w-16 h-16"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">No. of Buildings</h3>
                <p className="text-gray-600">11</p>
              </div>
            </div>
          </div>
          
          {/* Last date */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-amber-50 p-3">
                <Image 
                  src={ConstructionIconn} 
                  alt="Construction Icon" 
                  width={1920} 
                  height={1080} 
                  className="w-16 h-16"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Total Units</h3>
                <p className="text-gray-600">261 (256 Flats + 5 Shops)</p>
              </div>
            </div>
          </div>
          
          {/* Shortlisting */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-amber-50 p-3">
                <Image 
                  src={ConstructionIconn} 
                  alt="Construction Icon" 
                  width={1920} 
                  height={1080} 
                  className="w-16 h-16"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">EOI SUBMISSION</h3>
                <p className="text-gray-600">Started:06/04/2025</p>
                <p className="text-gray-600">Submission:22/05/2025</p>

              </div>
            </div>
          </div>
        </div>
      
      </div>
    </div>

    {/* Redevelopment Steps Section */}
    <div className="w-full bg-white py-16 md:py-24">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col items-center mb-16">
      <div className="flex items-center gap-3">
        <hr className="w-10 border-t-2 border-[#B57E10] rounded-full" />
        <h2 className="text-[#B57E10] font-medium">Standard Process of</h2>
        <hr className="w-10 border-t-2 border-[#B57E10] rounded-full" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-center">Redevelopment & Steps</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Step 1 */}
      <div className="border border-gray-200 rounded-lg p-6 relative border-b-4 border-b-[#B57E10] transition-all duration-200 hover:border-b-transparent hover:shadow-lg">
        {/* <div className="absolute -top-7 left-6 flex items-center justify-center w-14 h-14 bg-[#B57E10] rounded-full text-white text-2xl font-bold">
          1
        </div> */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-[#B57E10] mb-3">Member Approval</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>At least 70-75% of flat owners must approve redevelopment in a society meeting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>A feasibility study is done to check if rebuilding is possible.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 2 */}
      <div className="border border-gray-200 rounded-lg p-6 relative border-b-4 border-b-[#B57E10] transition-all duration-200 hover:border-b-transparent hover:shadow-lg">
        {/* <div className="absolute -top-7 left-6 flex items-center justify-center w-14 h-14 bg-[#B57E10] rounded-full text-white text-2xl font-bold">
          2
        </div> */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-[#B57E10] mb-3">Choose a Developer</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>The society invites builders to submit proposals (tenders).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>Members compare offers and select the best builder for the project.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 3 */}
      <div className="border border-gray-200 rounded-lg p-6 relative border-b-4 border-b-[#B57E10] transition-all duration-200 hover:border-b-transparent hover:shadow-lg">
        {/* <div className="absolute -top-7 left-6 flex items-center justify-center w-14 h-14 bg-[#B57E10] rounded-full text-white text-2xl font-bold">
          3
        </div> */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-[#B57E10] mb-3">Get Permissions</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>The builder applies for government approvals (like RERA, fire safety, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>This can take 6-12 months before construction can start.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 4 */}
      <div className="border border-gray-200 rounded-lg p-6 relative border-b-4 border-b-[#B57E10] transition-all duration-200 hover:border-b-transparent hover:shadow-lg">
        {/* <div className="absolute -top-7 left-6 flex items-center justify-center w-14 h-14 bg-[#B57E10] rounded-full text-white text-2xl font-bold">
          4
        </div> */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-[#B57E10] mb-3">Temporary Relocation</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>Residents move out - either to temporary housing provided by the builder or get rent money.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>The society ensures proper agreements are signed for this period.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 5 */}
      <div className="border border-gray-200 rounded-lg p-6 relative border-b-4 border-b-[#B57E10] transition-all duration-200 hover:border-b-transparent hover:shadow-lg">
        {/* <div className="absolute -top-7 left-6 flex items-center justify-center w-14 h-14 bg-[#B57E10] rounded-full text-white text-2xl font-bold">
          5
        </div> */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-[#B57E10] mb-3">Rebuilding Phase</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>The old building is demolished and new construction begins.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>This typically takes 3-5 years with regular progress updates.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 6 */}
      <div className="border border-gray-200 rounded-lg p-6 relative border-b-4 border-b-[#B57E10] transition-all duration-200 hover:border-b-transparent hover:shadow-lg">
        {/* <div className="absolute -top-7 left-6 flex items-center justify-center w-14 h-14 bg-[#B57E10] rounded-full text-white text-2xl font-bold">
          6
        </div> */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-[#B57E10] mb-3">Final Handover</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>After construction, authorities inspect and approve the new building.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B57E10] mt-1">•</span>
              <span>Members check their flats before moving in and get new ownership papers.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

    {/* Contact Form for Redevelopment */}
    <div className="w-full bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-200 rounded-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Reach out for Redevelopment</h2>
          <p className="text-gray-600 mb-8">In nec diam egestas, aliquot turpis at, vehicula rist. Cras eget mauris in nisl tempus lobortis.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name of the Developer" 
                  className="p-3 rounded border border-gray-300 w-full bg-white"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number" 
                  className="p-3 rounded border border-gray-300 w-full bg-white"
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  className="p-3 rounded border border-gray-300 w-full bg-white"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <input 
                  type="text" 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Website of Developer" 
                  className="p-3 rounded border border-gray-300 w-full bg-white"
                  disabled={isSubmitting}
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>
            </div>
            
            <div className="mb-6">
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type Your Message" 
                className="p-3 rounded border border-gray-300 w-full h-40 bg-white"
                disabled={isSubmitting}
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#B57E10] hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-md transition-colors flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
 {/* FAQ Section */}
 <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold  mb-6">Common Questions For This Project</h2>
        </div>
        
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                className={`w-full flex justify-between items-center p-4 text-left focus:outline-none ${openFaqItem === index ? 'bg-[#B57E10] text-white' : 'bg-white'}`}
                onClick={() => toggleFaqItem(index)}
                aria-expanded={openFaqItem === index}
              >
                <h3 className="text-base font-medium">{faq.title}</h3>
                <span className={`text-[#B57E10] ${openFaqItem === index ? ' text-white' : 'text-[#B57E10]'}`}>
                  {openFaqItem === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openFaqItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className="p-4 pt-0 text-gray-600 bg-white">{faq.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  </>
  )
}

export default Page;