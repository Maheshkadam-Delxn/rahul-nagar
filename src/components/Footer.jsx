import Image from "next/image";
import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#15181B] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo and About Section */}
        <div>
          <div className="flex items-center space-x-3">
           
            <Image
              src={"/logo2.png"}
              width={1920}
              height={1080}
              alt="logo"
              className="w-full h-28 object-contain"
            />
          </div>
          <p className="mt-4 text-gray-400">
            Officia deserunt mollitia animi, id est laborum fuga. Et harum quidem rerum facilis est et expedita distinctio.
          </p>
        </div>

        {/* Pages Links */}
        <div>
          <h3 className="text-lg font-semibold">Pages</h3>
          <ul className="mt-4 space-y-2 text-gray-400">
            {["About Us", "Our Team", "Testimonials", "Blog Grid", "Projects"].map((page, index) => (
              <li key={index}>
                <a href="#" className="hover:text-white transition">{page}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h3 className="text-lg font-semibold">Our Services</h3>
          <ul className="mt-4 space-y-2 text-gray-400">
            {["General Construction", "Property Maintenance", "Project Management", "Virtual Design & Build", "Preconstruction"].map((service, index) => (
              <li key={index}>
                <a href="#" className="hover:text-white transition">{service}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-gray-400">
            <li className="flex items-center space-x-2">
              <FaPhone className="text-yellow-500" />
              <span>+888 (123) 869523</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaEnvelope className="text-yellow-500" />
              <span>example@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-yellow-500" />
              <span>Rahul Nagar, Kothrud, Pune - 411038</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Section */}
      <div className="w-full flex items-center justify-center">
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm flex items-center w-full justify-between max-w-7xl">
       <span className="flex items-center gap-2">© Copyright <a href="#" className="text-white">Rahul Nagar CHSC Association Ltd.</a> 2025. All rights reserved.</span>
        <span className="block mt-2">Created by <a href="#" className="text-yellow-500">Skillnuts</a></span>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
