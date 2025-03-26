"use client"
import React from "react";
import { MoveLeft, MoveRight, Play } from "lucide-react";
import Link1 from "next/link";
import Image from "next/image";
import { Link } from "react-scroll";

const HeroSection = () => {
  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center text-white px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between  space-y-8 md:space-y-0">
        {/* Navigation Arrows - Hidden on small screens */}
        {/* <MoveLeft size={48} className="hidden md:block p-3 border-2 border-white rounded-full"/> */}
        
        <div className="w-full flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0">
          {/* Content Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-10 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-3">
              <h2 className="text-white underline text-lg md:text-xl">
                Building Tomorrow , Preserving Today
              </h2>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center md:text-left">
                Welcome to Rahul<br/> Nagar Society
              </h1>
              <p className="text-sm md:text-base text-center md:text-left">
                Your Gateway to a Connected, Transparent, and Thriving Community
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 justify-center md:justify-start">
              <Link1
                href={"/about"}
                className="bg-[#B57E10] p-3 text-white rounded-sm w-1/2 md:w-auto text-center cursor-pointer"
              >
                Know More
              </Link1>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-white text-[#B57E10] p-3 rounded-full">
                  <Play />
                </div>
                Play Now
              </div>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end">
            <Image
              alt="logo"
              src={"/logo2.png"}
              width={1920}
              height={1080}
              className="w-3/4 md:w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
        
        {/* Navigation Arrows - Hidden on small screens */}
        {/* <MoveRight size={48} className="hidden md:block p-3 border-2 border-white rounded-full"/> */}
      </div>
    </div>
  );
};

export default HeroSection;