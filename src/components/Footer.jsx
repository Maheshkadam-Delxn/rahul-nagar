import Image from "next/image";
import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link"; // Import Next.js Link

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
          Rahul Construction is famous for their well-planned societies like Rahul Nagar in Pune. If you have always wanted to be part of a vibrant and well managed society, this is the best option for you.
          </p>
        </div>

        {/* Pages Links */}<div>
  <h3 className="text-lg font-semibold">Pages</h3>
  <ul className="mt-4 space-y-2 text-gray-400">
    <li>
      <Link href="/about" className="hover:text-white transition">About Us</Link>
    </li>
    <li>
      <Link href="/about" className="hover:text-white transition">Our Team</Link>
    </li>
    <li>
      <Link href="/testimonials" className="hover:text-white transition">Testimonials</Link>
    </li>
    
    <li>
      <Link href="/project" className="hover:text-white transition">Projects</Link>
    </li>
  </ul>
</div>


        {/* Services Links */}
<div>
  <h3 className="text-lg font-semibold">Our Services</h3>
  <ul className="mt-4 space-y-2 text-gray-400">
    <li>
      <a href="/general" className="hover:text-white transition">General Construction</a>
    </li>
    <li>
      <a href="/property" className="hover:text-white transition">Property Maintenance</a>
    </li>
    <li>
      <a href="/project" className="hover:text-white transition">Project Management</a>
    </li>
    <li>
      <a href="/virtual" className="hover:text-white transition">Virtual Design & Build</a>
    </li>
    <li>
      <a href="/preconstruction" className="hover:text-white transition">Preconstruction</a>
    </li>
  </ul>
</div>


        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-gray-400">
            <li className="flex items-center space-x-2">
              <FaPhone className="text-yellow-500" />
              <a href="tel:+918787574657">+91 8787574657</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaEnvelope className="text-yellow-500" />
              <a href="mailto:rahulnagarassociation1@gmail.com">rahulnagarassociation1@gmail.com</a>
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
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm flex items-center w-full justify-center max-w-7xl">
       <span className="flex items-center gap-2">© Copyright <a href="#" className="text-white">Rahul Nagar CHSC Association Ltd.</a> 2025. All rights reserved.</span>
        
      </div>
      </div>
    </footer>
  );
};

export default Footer;
