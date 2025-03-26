"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { MapPin, Phone, Mail, Search, Menu, X } from "lucide-react"
import Link from 'next/link'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className='w-full flex items-center justify-center z-20 relative'>
      {/* Desktop Navbar */}
      <div className='hidden md:flex w-full lg:w-4/5 bg-[#15181B] h-[15vh] rounded-bl-sm rounded-br-sm'>
      <Link href={"/"} className="w-1/4 flex items-center justify-center   bg-white rounded-bl-lg rounded-br-3xl shadow-md">
  <Image
    alt="Logo"
    src="/logo.png"
    width={1920}
    height={1080}
    className="w-full h-full object-cover rounded-bl-lg rounded-br-3xl"
  />
</Link>


        <div className='flex flex-col w-3/4 h-full justify-between'>
          <div className='w-full bg-[#B57E10] h-1/3 flex items-center justify-between py-1 px-3'>
            <div className='flex items-center gap-2 text-white'>
              <MapPin size={16} />
              <h3 className='text-xs'>Rahul Nagar, Near Karve Statue, Kothrud, Pune-411038</h3>
            </div>
            <div className='flex items-center gap-3 text-white text-xs'>
              <div className='flex items-center gap-2'>
                <Phone size={16} />
                +91 8787574657
              </div>
              <div className='flex items-center gap-2'>
                <Mail size={16} />
                support@rahulnagar.com
              </div>
            </div>
          </div>
          <div className='w-full h-2/3 flex items-center justify-between px-3 py-1'>
            <div className='flex items-center gap-6 text-white text-sm'>
              <Link href={"/"}>Home</Link>
              {/* <Link href={"#"}>Updates</Link> */}
              <Link href={"/about"}>About</Link>
              {/* <Link href={"#"}>Redevelopment</Link> */}
              <Link href={"/gallery"}>Gallery</Link>
              <Link href={"/contact"}>Contact Us</Link>
            </div>
            <div className='flex items-center gap-5 text-white py-1 px-3'>
              {/* <Search size={20} /> */}
              <Link href={"/admin"} className='bg-[#B57E10] p-3 text-sm w-32 text-center rounded-sm'>Member Area</Link>
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
          /></Link>
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
                  <h3 className='text-xs'>Rahul Nagar, Near Karve Statue, Kothrud, Pune-411038</h3>
                </div>
                <div className='flex flex-col gap-3 text-white text-xs'>
                  <div className='flex items-center gap-2'>
                    <Phone size={16} />
                    0123456789
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail size={16} />
                    rnchsacal@gmail.com
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-6'>
                <div className='relative w-full'>
                  <input
                    type="text"
                    placeholder="Search..."
                    className='w-full p-3 bg-gray-800 text-white rounded-sm pl-10'
                  />
                  <Search size={20} className='absolute text-gray-400 left-3 top-3' />
                </div>

                <Link 
                  href={"/admin"} 
                  className='bg-[#B57E10] p-3 text-sm w-full text-center rounded-sm text-white'
                  onClick={closeMenu}
                >
                  Member Area
                </Link>
              </div>

              <div className='flex flex-col mt-6 border-t border-gray-700 pt-6'>
                <Link href={"/"} className='text-white py-4 border-b border-gray-700' onClick={closeMenu}>Home</Link>
                <Link href={"#"} className='text-white py-4 border-b border-gray-700' onClick={closeMenu}>Updates</Link>
                <Link href={"/about"} className='text-white py-4 border-b border-gray-700' onClick={closeMenu}>About</Link>
                <Link href={"#"} className='text-white py-4 border-b border-gray-700' onClick={closeMenu}>Redevelopment</Link>
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