"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Search, Menu, X } from "lucide-react"
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const Navbar = () => {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    phoneNumbers: [],
    emailAddresses: [],
    locations: []
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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

  return (
    <div className='w-full flex items-center justify-center z-20 relative'>
      {/* Desktop Navbar */}
      <div className='hidden md:flex w-full lg:w-4/5 bg-[#15181B] h-[15vh] rounded-bl-sm rounded-br-sm'>
        <Link href={"/"} className="w-1/4 flex items-center justify-center bg-white rounded-bl-lg rounded-br-3xl shadow-md">
          <Image
            alt="Logo"
            src="/logo.png"
            width={170}
            height={170}
            className="object-cover rounded-bl-lg rounded-br-3xl"
          />
        </Link>

        <div className='flex flex-col w-3/4 h-full justify-between'>
          <div className='w-full bg-[#B57E10] h-1/3 flex items-center justify-between py-1 px-2'>
            <div className='flex items-center gap-2 text-white p-2'>
              <MapPin size={16} />
              <h3 className='text-xs tracking-[30%]'>{getLocation()}</h3>
            </div>
            <div className='flex items-center gap-3 text-white text-xs'>
              <a href={`tel:${getPrimaryPhone().replace(/\s+/g, '')}`} className='flex items-center gap-2'>
                <Phone size={16} />
                {getPrimaryPhone()}
              </a>
              <a href={`mailto:${getPrimaryEmail()}`} className='flex items-center gap-2 p-2'>
                <Mail size={16} />
                {getPrimaryEmail()}
              </a>
            </div>
          </div>
          <div className='w-full h-2/3 flex items-center justify-between px-3 py-1'>
            <div className='flex items-center gap-10 text-white text-md'>
              <Link href={"/"}>Home</Link>
              <Link href={"/about"}>About</Link>
              <Link href={"/gallery"}>Gallery</Link>
              <Link href={"/redevelopment"}>Redevelopment</Link>
              <Link href={"/contact"}>Contact Us</Link>
            </div>
            <div className='flex items-center gap-5 text-white py-1 px-3'>
              <Link 
                href={user ? "/admin" : "/signin"} 
                className="bg-[#B57E10] p-3 w-40 text-center rounded-sm font-roboto font-semibold text-[16px] leading-[26px] tracking-[0%]"
              >
                Member Area
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className='md:hidden w-full bg-[#15181B] flex items-center justify-between p-4'>
        <div className='flex items-center gap-2'>
          <Link href={"/"}>
            <Image
              alt='Logo'
              src={"/logo.png"}
              width={100}
              height={50}
              className='bg-white h-12 w-auto object-contain rounded-sm'
            />
          </Link>
        </div>
        <button
          className='text-white p-2'
          onClick={toggleMenu}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className='md:hidden fixed inset-0 bg-[#15181B] z-50 overflow-y-auto'>
          <div className='flex flex-col h-full'>
            <div className='flex justify-between items-center p-4 border-b border-gray-700'>
              <Image
                alt='Logo'
                src={"/logo.png"}
                width={100}
                height={50}
                className='bg-white h-12 w-auto object-contain rounded-sm'
              />
              <button
                className='text-white p-2'
                onClick={toggleMenu}
              >
                <X size={24} />
              </button>
            </div>

            <div className='p-4'>
              <div className='bg-[#B57E10] rounded-sm p-4 text-white mb-6'>
                <div className='flex items-start gap-2 mb-4'>
                  <MapPin size={16} className='mt-1 flex-shrink-0' />
                  <h3 className='text-xs'>{getLocation()}</h3>
                </div>
                <div className='flex flex-col gap-3 text-white text-xs'>
                  <a href={`tel:${getPrimaryPhone().replace(/\s+/g, '')}`} className='flex items-center gap-2'>
                    <Phone size={16} />
                    {getPrimaryPhone()}
                  </a>
                  <a href={`mailto:${getPrimaryEmail()}`} className='flex items-center gap-2'>
                    <Mail size={16} />
                    {getPrimaryEmail()}
                  </a>
                </div>
              </div>

              <div className='flex flex-col gap-6'>
                <Link 
                  href={user ? "/admin" : "/signin"} 
                  className='bg-[#B57E10] p-3 text-sm w-full text-center rounded-sm text-white'
                  onClick={closeMenu}
                >
                  Member Area
                </Link>
              </div>

              <div className='flex flex-col mt-6 border-t border-gray-700 pt-6'>
                <Link href={"/"} className='text-white py-4 border-b border-gray-700' onClick={closeMenu}>Home</Link>
                <Link href={"/about"} className='text-white py-4 border-b border-gray-700' onClick={closeMenu}>About</Link>
                <Link href={"/gallery"} className='text-white py-4 border-b border-gray-700' onClick={closeMenu}>Gallery</Link>
                <Link href={"/contact"} className='text-white py-4' onClick={closeMenu}>Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar