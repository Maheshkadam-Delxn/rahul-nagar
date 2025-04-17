"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowLeft } from "lucide-react";
import ConstructionIcon from "../../../../public/home/events/icon.png"; // Reusing the same icon

const UpdateDetailPage = () => {
  const { updateId } = useParams();
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const res = await fetch(`/api/updates/${updateId}`);
        if (!res.ok) throw new Error("Failed to fetch update");

        const data = await res.json();
        setUpdate(data.update);
      } catch (error) {
        console.error("Error fetching update details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (updateId) fetchUpdate();
  }, [updateId]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading update details...</p>;
  }

  if (!update) {
    return <p className="text-center text-red-500 py-10">Update not found</p>;
  }

  return (
    <div className="w-full bg-gray-100 px-4 pt-10 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-10 mb-10" style={{ minWidth: "80%" }}>
        <Link href="/updates" className="flex items-center gap-2 text-[#B57E10]">
          <ArrowLeft size={18} /> Back to Updates
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-bold mt-5 text-[#B57E10]">{update.title}</h1>
        
        {/* Author & Date */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <User size={18} className="text-red-500" />
            <span>{update.createdBy?.userName || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" />
            <span>
              {new Date(update.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Images Section - Only show if images exist */}
        {update.images?.length > 0 && (
          <div className={`mt-6 ${update.images.length === 1 ? "flex justify-center" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}`}>
            {update.images.map((img) => (
              <Image
                key={img._id}
                src={img.url}
                alt={img.alt || "Update image"}
                width={600}
                height={300}
                className="w-full h-64 object-contain rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Content */}
        <p className="text-gray-600 mt-4 leading-relaxed">{update.content}</p>
      </div>
    </div>
  );
};

export default UpdateDetailPage;