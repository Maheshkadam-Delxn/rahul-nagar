"use client"
import React, { useState } from "react";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import image1 from "../../../public/home/gallery/diwali.png";
import image2 from "../../../public/home/gallery/holi.png";
import image3 from "../../../public/home/gallery/shreeganesh.png";
import image4 from "../../../public/home/gallery/image1.png";
import image5 from "../../../public/home/gallery/image2.png";
import image6 from "../../../public/home/gallery/image3.png";
import image7 from "../../../public/home/gallery/image4.png";
import image8 from "../../../public/home/gallery/image5.png";
import image9 from "../../../public/home/gallery/image6.png";

const images = [
  { src: image1, category: "Cultural Activities", title: "Diwali Celebration" },
  { src: image2, category: "Cultural Activities", title: "Holi Celebration" },
  { src: image3, category: "Cultural Activities", title: "Shree Ganesh Festival" },
  { src: image4, category: "Redevelopment", title: "New Project Launch" },
  { src: image5, category: "Redevelopment", title: "Construction Progress" },
  { src: image6, category: "Events/Workshop", title: "Community Workshop" },
  { src: image7, category: "Events/Workshop", title: "Art & Craft Event" },
  { src: image8, category: "Events/Workshop", title: "Skill Development Session" },
  { src: image9, category: "Residential", title: "Home Construction" },
];

const Page = () => {
  // State to manage the current filter
  const [activeFilter, setActiveFilter] = useState("All");

  // Function to get filtered images
  const getFilteredImages = () => {
    if (activeFilter === "All") return images;
    return images.filter(img => img.category === activeFilter);
  };

  // Array of filter options
  const filterOptions = [
    "All",
    "Cultural Activities",
    "Redevelopment", 
    "Events/Workshop",
    "Residential"
  ];

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
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-30 blur-lg"></div>
  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-purple-400 rounded-full opacity-25 blur-3xl"></div>

        <div className="w-full max-w-6xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 md:mb-8">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  ${
                    activeFilter === filter 
                    ? "bg-[#b5831d] text-white" 
                    : "text-gray-700"
                  } 
                  px-4 py-2 rounded-md text-sm md:text-base cursor-pointer
                `}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {getFilteredImages().map((img, index) => (
              <div
                key={index}
                className="relative bg-gray-300 w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden group"
              >
                <Image 
                  src={img.src} 
                  alt={img.title} 
                  layout="fill" 
                  objectFit="cover" 
                  className="group-hover:scale-105 transition-transform duration-300" 
                />
                {/* Hover Content */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all ease-in-out duration-300">
                  <p className="text-gray-400 text-sm">{img.category}</p>
                  <h3 className="text-white font-semibold text-base md:text-lg">{img.title}</h3>
                </div>
                {/* Arrow Icon (Visible on Hover) */}
                {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-[#b5831d] p-2 rounded-full">
                    <ArrowUpRight className="text-white" size={20} />
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;