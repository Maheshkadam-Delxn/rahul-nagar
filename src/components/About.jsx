import React from "react";
import Image from "next/image";
import Image1 from "../../public/home/about/sample.jpg";
import Link from "next/link";

const About = () => {
  return (
    <div className="w-full bg-white flex flex-col items-center justify-center py-12 md:py-24">
      <div className="max-w-6xl w-full px-4 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">
        {/* Image Gallery - Stacks vertically on mobile, side by side on desktop */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 lg:mb-0">
          <div>
            <Image
              alt="Image1"
              width={1920}
              height={1080}
              className="w-full sm:w-56 h-72 rounded-tl-[50px] rounded-br-[50px] object-cover"
              src={Image1}
            />
          </div>
          <div className="flex flex-row sm:flex-col items-center gap-5 mt-5 sm:mt-0">
            <Image
              alt="Image1"
              width={1920}
              height={1080}
              className="w-full sm:w-56 h-64 rounded-tl-[50px] rounded-br-[50px] object-cover"
              src={Image1}
            />
            <Image
              alt="Image1"
              width={1920}
              height={1080}
              className="w-full  sm:w-56 h-64 rounded-tr-[50px] rounded-bl-[50px] object-cover"
              src={Image1}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-start gap-5 text-center lg:text-left">
          <div className="flex items-center gap-1 text-[#B57E10] mx-auto lg:mx-0">
            <hr className="w-12 border-t-2 border-[#B57E10] rounded-full" />
            <h1>About Rahul Nagar</h1>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Discover the Kothrud&apos;s
            <br className="hidden md:block" /> Renowned Society
            <br className="hidden md:block" /> Rahul Nagar
          </h1>
          
          <p className="text-sm opacity-60 max-w-md">
            Established in 1993, Rahul Nagar Society has been a cornerstone of
            community living in Pune. With a focus on transparency, inclusivity, and
            progress, we are now embarking on an exciting redevelopment journey to
            create a modern, sustainable, and vibrant living space for all our
            members
          </p>
          
          <Link 
            href={"#"} 
            className="p-3 bg-[#B57E10] rounded-sm text-white mx-auto lg:mx-0 hover:bg-[#9e6c0d] transition-colors"
          >
            More About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;