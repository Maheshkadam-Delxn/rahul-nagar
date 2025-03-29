import React from "react";
import Image from "next/image";
import Image1 from "../../public/rahul-nagar.png";
import Image2 from "../../public/home/ganesh.png";
import Image3 from "../../public/home/building.png";
import Link from "next/link";

const About = () => {
  return (
    <div name="about" className="w-full bg-white flex flex-col items-center justify-center py-12 md:py-24 px-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        {/* Image Gallery - Enhanced Responsive Layout */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 mb-8 lg:mb-0">
          {/* Large Main Image - Spans 2 columns on small screens */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2 h-72 md:h-96 lg:h-[500px]">
            <Image
              alt="Society Image"
              width={1920}
              height={1080}
              className="w-full h-full object-cover rounded-tl-[50px] rounded-br-[50px]"
              src={Image1}
            />
          </div>

          {/* Side Images */}
          <div className="h-64 md:h-80 lg:h-[250px]">
            <Image
              alt="Society Image"
              width={1920}
              height={1080}
              className="w-full h-full object-cover rounded-tl-[50px] rounded-br-[50px]"
              src={Image2}
            />
          </div>
          <div className="h-64 md:h-80 lg:h-[250px]">
            <Image
              alt="Society Image"
              width={1920}
              height={1080}
              className="w-full h-full object-cover rounded-tr-[50px] rounded-bl-[50px]"
              src={Image3}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">
          {/* Section Heading */}
          <div className="flex items-center gap-2 text-[#B57E10] justify-center lg:justify-start w-full">
            <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
            <h2 className="text-sm md:text-base">About Rahul Nagar</h2>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Discover the Kothrud&apos;s
            <br className="hidden md:block" /> 
            Renowned Society
            <br className="hidden md:block" /> 
            Rahul Nagar
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base opacity-60 max-w-md text-center lg:text-left">
            Established in 1993, Rahul Nagar Society has been a cornerstone of 
            community living in Pune. With a focus on transparency, inclusivity, 
            and progress, we are now embarking on an exciting redevelopment 
            journey to create a modern, sustainable, and vibrant living space 
            for all our members
          </p>

          {/* Call to Action Button */}
          <Link
            href={"/about"}
            className="p-2 md:p-3 bg-[#B57E10] rounded-sm text-white 
                       hover:bg-[#9e6c0d] transition-colors 
                       text-sm md:text-base 
                       w-full sm:w-auto text-center"
          >
            More About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;