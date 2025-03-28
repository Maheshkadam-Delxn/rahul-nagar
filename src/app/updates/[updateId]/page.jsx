"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowLeft } from "lucide-react";
import ConstructionIcon from "../../../../public/home/events/icon.png"; // Reusing the same icon

const UpdateDetailPage = () => {
  const { updateId } = useParams(); // Get updateId from URL
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const res = await fetch(`/api/updates/${updateId}`); // Call the API for a single update
        if (!res.ok) throw new Error("Failed to fetch update");

        const data = await res.json();
        setUpdate(data.update); // ✅ Extract 'update' from the API response
      } catch (error) {
        console.error("Error fetching update details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (updateId) fetchUpdate();
  }, [updateId]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading update...</p>;
  }

  if (!update) {
    return <p className="text-center text-gray-500 mt-10">Update not found.</p>;
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f8f8] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 md:p-8">
        {/* Back Button */}
        <Link href="/updates" className="flex items-center gap-2 text-[#B57E10] mb-4">
          <ArrowLeft size={18} /> Back to Updates
        </Link>

        {/* Update Details */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#B57E10]">{update.title}</h1>

          {/* Author & Date */}
          <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} color="red" />
              {update.createdBy.userName}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} color="red" />
              {new Date(update.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Image (optional) */}
          {update.image ? (
            <Image src={update.image} alt={update.title} width={600} height={300} className="rounded-lg w-full object-cover" />
          ) : (
            <Image src={ConstructionIcon} alt="Default Icon" width={64} height={64} className="w-16 h-16" />
          )}

          {/* Full Content */}
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">{update.content}</p>
        </div>
      </div>
    </div>
  );
};

export default UpdateDetailPage;
