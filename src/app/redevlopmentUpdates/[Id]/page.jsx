"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowLeft, FileText, Link as LinkIcon } from "lucide-react";
import ConstructionIcon from "../../../../public/home/events/icon.png";

const UpdateDetailPage = () => {
  const { Id } = useParams();
  console.log(Id);
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading update...</p>;
  }
  console.log("wewewe",update);
  if (!update) {
    return <p className="text-center text-gray-500 mt-10">Update not found.</p>;
  }

  // Format date from ISO string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f8f8] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 md:p-8">
        {/* Back Button */}
        <Link href="/redevelopmentUpdates" className="flex items-center gap-2 text-[#B57E10] mb-4">
          <ArrowLeft size={18} /> Back to Updates
        </Link>

        {/* Update Details */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#B57E10]">{update.title}</h1>

          {/* Author & Dates Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} color="red" />
              {/* {update.createdBy?.userName || "Unknown User"} */}
              Admin User
            </div>
            
            {/* Created Date */}
            <div className="flex items-center gap-2">
              <Calendar size={16} color="red" />
              <span>Created: {formatDate(update.createdAt)}</span>
            </div>
            
            {/* Update Date - if it exists and is different from createdAt */}
            {update.date && update.date !== update.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar size={16} color="blue" />
                <span>Update Date: {formatDate(update.date)}</span>
              </div>
            )}
          </div>

          {/* Image Section */}
          {update.image ? (
            <div className="mt-2">
              <Image 
                src={update.image} 
                alt={update.title} 
                width={600} 
                height={400} 
                className="w-full rounded-lg object-cover max-h-96" 
              />
            </div>
          ) : update.images?.length > 0 ? (
            <div className={`mt-2 ${update.images.length === 1 ? "flex justify-center" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}`}>
              {update.images.map((img, index) => (
                <Image
                  key={img._id || index}
                  src={img.url}
                  alt={img.alt || "Update image"}
                  width={600}
                  height={400}
                  className="w-full rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <Image src={ConstructionIcon} alt="Default Icon" width={64} height={64} className="w-16 h-16" />
            </div>
          )}

          {/* Description Section */}
          {update.description && (
            <div className="mt-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">{update.description}</p>
            </div>
          )}

          {/* Full Content Section (if different from description) */}
          {update.content && update.content !== update.description && (
            <div className="mt-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">{update.content}</p>
            </div>
          )}

          {/* Document Link */}
          {update.document && (
            <div className="mt-4">
              <a 
                href={update.document} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FileText size={18} />
                <span className="underline">View Document</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateDetailPage;