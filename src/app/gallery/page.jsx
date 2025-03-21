import React from "react";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import { ArrowUpRight } from "lucide-react";

const Page = () => {
  return (
    <div className="w-full min-h-screen">
      <ServiceHeroSection
        name="Gallery"
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Gallery", link: "/gallery" },
        ]}
      />
      <div className="w-full py-12 md:py-16 lg:py-24 bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 md:mb-8">
            <button className="bg-[#b5831d] text-white px-4 py-2 rounded-md text-sm md:text-base">
              All
            </button>
            <button className="text-gray-700 text-sm md:text-base">Cultural Activities</button>
            <button className="text-gray-700 text-sm md:text-base">Redevelopment</button>
            <button className="text-gray-700 text-sm md:text-base">Events/Workshop</button>
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="relative bg-gray-300 w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden group"
              >
                {/* Hover Content */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all ease-in-out duration-300">
                  <p className="text-gray-400 text-sm">Residential</p>
                  <h3 className="text-white font-semibold text-base md:text-lg">
                    Home Construction
                  </h3>
                </div>
                
                {/* Arrow Icon (Visible on Hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-[#b5831d] p-2 rounded-full">
                    <ArrowUpRight className="text-white" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;