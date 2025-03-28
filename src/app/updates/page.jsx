"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MoveRight } from "lucide-react";
import ConstructionIcon from "../../../public/home/events/icon.png"
import { useRouter } from 'next/navigation';
const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatesRes = await fetch("/api/updates/fetchAll");
        if (!updatesRes.ok) throw new Error("Failed to fetch updates");
        const updatesData = await updatesRes.json();
        setUpdates(updatesData);
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchData();
  }, []);

  const trimText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="w-full bg-[#f8f8f8] min-h-screen flex items-center justify-center py-12 md:py-24 px-4">
      <div className="w-full max-w-6xl flex flex-col items-center gap-8 md:gap-10">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full">
          <div className="flex items-center gap-2 text-[#B57E10]">
            <hr className="w-8 md:w-12 border-t border-2 rounded-full" />
            <h1 className="text-sm md:text-base">Latest Updates</h1>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left w-full">
            All Updates on Redevelopment
          </h1>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch justify-center gap-5">
          {updates.length > 0 ? (
            updates.map((update) => (
              <div key={update._id} className="bg-white shadow-2xl rounded-lg p-5 md:p-6 flex flex-col gap-4 md:gap-5">
                <div className="flex items-center gap-3 md:gap-5">
                  <Image src={ConstructionIcon} alt="Construction Icon" width={64} height={64} className="w-12 h-12 md:w-16 md:h-16" />
                  <h1 className="text-base md:text-lg text-[#B57E10] font-medium">
                    {update.title}
                  </h1>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center gap-1 md:gap-2">
                    <User size={14} color="red" />
                    {update.createdBy.userName}
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Calendar size={14} color="red" />
                    {new Date(update.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <p className="text-xs md:text-sm opacity-45 font-medium">{trimText(update.content, 100)}</p>
                <Link href={`/updates/${update._id}`} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#B57E10]">
                  Read More <MoveRight size={16} />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">No updates available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatesPage;
