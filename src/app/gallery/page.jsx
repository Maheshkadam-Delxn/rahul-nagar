"use client";
import React, { useState, useEffect } from "react";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import Image from "next/image";

// Updated categories as per your request
const categories = ["general", "event", "fascilities", "celebration", "meeting"];

const Page = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery/fetchAll');
        const data = await response.json();
        
        if (data.success && data.images) {
          setImages(data.images);
        } else {
          console.error("Failed to fetch images:", data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const getFilteredImages = () =>
    activeFilter === "All" ? images : images.filter((img) => img.category === activeFilter);

  const filterOptions = ["All", ...categories];

  return (
    <div className="w-full min-h-screen">
      <ServiceHeroSection
        name="Gallery"
        breadcrumbs={[{ label: "Home", link: "/" }, { label: "Gallery", link: "/gallery" }]}
      />
      
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-30 blur-lg"></div>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-purple-400 rounded-full opacity-25 blur-3xl"></div>
      
      <div className="w-full py-12 md:py-16 lg:py-24 bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        <div className="w-full max-w-6xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 md:mb-8">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm md:text-base cursor-pointer ${
                  activeFilter === filter ? "bg-[#b5831d] text-white" : "text-gray-700"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b5831d]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {getFilteredImages().map((img) => (
                <div
                  key={img._id}
                  className="relative bg-gray-300 w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden group"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.title || `Gallery image - ${img.category}`}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover Content */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all ease-in-out duration-300">
                    <p className="text-gray-400 text-sm">{img.category}</p>
                    <h3 className="text-white font-semibold text-base md:text-lg">{img.title}</h3>
                    {img.description && <p className="text-gray-300 text-xs mt-1">{img.description}</p>}
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(img.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && getFilteredImages().length === 0 && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No images found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;