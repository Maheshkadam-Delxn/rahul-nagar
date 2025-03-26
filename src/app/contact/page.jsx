import React from 'react'
import ServiceHeroSection from "@/components/ServiceHeroSection"
import Image from 'next/image'
import { MapPin, Mail, Phone, MessageCircle, User } from "lucide-react"

const page = () => {
  return (
    <div className='w-full min-h-screen'>
      <ServiceHeroSection
        name="Contact Rahul Nagar"
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
            <p className="text-sm md:text-base text-gray-600 text-center">
              Rahul Nagar, Near Karve Statue, Kothrud, Pune - 411038
            </p>
          </div>

          {/* Email Card */}
          <div className='w-full sm:w-[45%] md:w-1/3 lg:w-1/4 flex flex-col items-center p-4 md:p-6 rounded-lg border border-slate-200'>
            <Mail className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4 text-yellow-600" />
            <h3 className="text-base md:text-lg font-semibold">Email Address</h3>
            <p className="text-sm md:text-base text-gray-600">email@example.com</p>
          </div>

          {/* Phone Number Card */}
          <div className='w-full sm:w-[45%] md:w-1/3 lg:w-1/4 flex flex-col items-center p-4 md:p-6 rounded-lg border border-slate-200'>
            <Phone className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4 text-yellow-600" />
            <h3 className="text-base md:text-lg font-semibold">Phone Number</h3>
            <p className="text-sm md:text-base text-gray-600">02 (256) 325 3602</p>
            <p className="text-sm md:text-base text-gray-600">01 (541) 258 360</p>
          </div>

        </div>
      </div>

      {/* Map Display Section */}
      <div className='w-full h-[30vh] sm:h-[40vh] md:h-[50vh] p-3 md:p-5 bg-white'>
        {/* <iframe 
          className="w-full h-full rounded-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345097153!2d-122.419415684682!3d37.77492977975806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c3e959b7b%3A0xceb03aa3b6e2c5e4!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1637693684526!5m2!1sen!2sus" 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe> */}
        <iframe           className="w-full h-full rounded-lg"
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.6540781664557!2d73.8153475!3d18.499321800000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfc109bfffff%3A0xcd2b5954a8fd421e!2sRahul%20Nagar%20Housing%20Society!5e0!3m2!1sen!2sin!4v1742984876297!5m2!1sen!2sin"  allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
      
      {/* Contact Us Section */}
      <div className='w-full bg-white py-12 md:py-24 flex items-center justify-center'>
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start px-4 sm:px-6 md:px-10 py-8 md:py-16">
          {/* Left Side Heading */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">Contact Us</h2>
          </div>

          {/* Right Side Form */}
          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Get in touch</h3>

            <form className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Full Name*"
                  className="w-full pl-8 pr-2 py-2 border-b border-black outline-none focus:border-gray-600"
                />
              </div>

              {/* Email & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    placeholder="Email Here*"
                    className="w-full pl-8 pr-2 py-2 border-b border-black outline-none focus:border-gray-600"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject *"
                  className="w-full py-2 border-b border-black outline-none focus:border-gray-600"
                />
              </div>

              {/* Message */}
              <div className="relative">
                <MessageCircle className="absolute left-2 top-2 text-gray-500" size={20} />
                <textarea
                  placeholder="Message"
                  className="w-full pl-8 pr-2 py-2 border-b border-black outline-none focus:border-gray-600"
                  rows="3"
                ></textarea>
              </div>

              {/* Send Button */}
              <button className="bg-[#b5831d] text-white px-6 py-2 rounded-md mt-4">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page