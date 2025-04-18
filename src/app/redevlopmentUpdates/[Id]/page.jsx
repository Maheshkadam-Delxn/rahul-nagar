"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowLeft, FileText, X } from "lucide-react";

const UpdateDetailPage = () => {
  const { Id } = useParams();
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const res = await fetch(`/api/redevelopment/update/${Id}`);
        if (!res.ok) throw new Error("Failed to fetch update");

        const data = await res.json();
        setUpdate(data.update);
      } catch (error) {
        console.error("Error fetching update details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (Id) fetchUpdate();
  }, [Id]);

  useEffect(() => {
    // Disable body scrolling when modal is open
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading update details...</p>;
  }

  if (!update) {
    return <p className="text-center text-red-500 py-10">Update not found</p>;
  }

  // Format date from ISO string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setShowModal(true);
  };

  return (
    <div className="w-full bg-gray-100 px-4 pt-10 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-10 mb-10" style={{ minWidth: "80%" }}>
        <Link href="/redevlopmentUpdates" className="flex items-center gap-2 text-[#B57E10]">
          <ArrowLeft size={18} /> Back to Updates
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mt-5 text-[#B57E10]">{update.title}</h1>

        {/* Author & Dates Info */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <User size={18} className="text-red-500" />
            <span>Admin User</span>
          </div>
          
          {/* Created Date */}
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-red-500" />
            <span>Created: {formatDate(update.createdAt)}</span>
          </div>
          
          {/* Update Date - if it exists and is different from createdAt */}
          {update.date && update.date !== update.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              <span>Update Date: {formatDate(update.date)}</span>
            </div>
          )}
        </div>

        {/* Image Section */}
        {update.image ? (
          <div className="mt-6 flex justify-start">
            <div className="w-1/2 md:w-2/5 cursor-pointer" onClick={() => openImageModal(update.image)}>
              <Image 
                src={update.image} 
                alt={update.title} 
                width={400} 
                height={600} 
                className="h-112 w-full object-cover rounded-lg hover:opacity-90 transition" 
              />
            </div>
          </div>
        ) : update.images?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {update.images.map((img, index) => (
              <div 
                key={img._id || index} 
                className="w-1/2 md:w-2/5 cursor-pointer"
                onClick={() => openImageModal(img.url)}
              >
                <Image
                  src={img.url}
                  alt={img.alt || "Update image"}
                  width={400}
                  height={600}
                  className="h-112 w-full object-cover rounded-lg hover:opacity-90 transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* Description Section */}
        {update.description && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600">{update.description}</p>
          </div>
        )}

        {/* Full Content Section (if different from description) */}
        {update.content && update.content !== update.description && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
            <p className="text-gray-600">{update.content}</p>
          </div>
        )}

        {/* Document Link - Styled to match the previous component */}
        {update.document && (
          <div className="mt-6">
            <a 
              href={update.document} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm md:text-base text-yellow-600 hover:text-yellow-800 transition font-medium border border-yellow-600 px-4 py-2 rounded-md"
            >
              <FileText size={18} /> View Document
            </a>
          </div>
        )}
      </div>
      
      {/* Image Modal with Scrollbar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 focus:outline-none"
            >
              <X size={24} />
            </button>
            <div className="bg-white p-2 rounded-lg">
              <div className="max-h-[80vh] overflow-y-auto overflow-x-auto">
                <Image
                  src={modalImage}
                  alt="Update image"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateDetailPage;