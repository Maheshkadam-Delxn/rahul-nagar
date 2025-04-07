"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MoveRight } from "lucide-react";
import ConstructionIcon from "../../public/home/events/icon.png";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatesRes = await fetch("/api/updates/fetchAll?limit=3");
        if (!updatesRes.ok) throw new Error("Failed to fetch updates");
        const updatesData = await updatesRes.json();
        setUpdates(updatesData);

        const eventsRes = await fetch("/api/events/fetchAll?limit=3");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const trimText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    
    const date = new Date(dateString);
    
    // Get local date components
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    // Get local time components
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Add ordinal suffix to day
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${ordinalSuffix(day)} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="w-full bg-[#f8f8f8] min-h-[50vh] flex items-center justify-center py-12 md:py-24 px-4">
      <div className="w-full max-w-6xl flex flex-col items-center gap-8 md:gap-10">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full">
          <div className="flex items-center gap-2 text-[#B57E10]">
            <hr className="w-8 md:w-12 border-t border-2 rounded-full" />
            <h1 className="text-sm md:text-base">What We Do</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center w-full justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left w-full">
              Latest Updates & Upcoming Events
            </h1>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch justify-center gap-5">
          <div className="bg-white shadow-2xl rounded-lg p-5 md:p-6 flex flex-col gap-4 md:gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-5">
                <Image src={ConstructionIcon} alt="Construction Icon" width={64} height={64} className="w-12 h-12 md:w-16 md:h-16" />
                <h1 className="text-base md:text-lg text-[#B57E10] font-medium">
                  Latest Updates of Redevelopment
                </h1>
              </div>
              <Link href="/updates" className="text-xs md:text-sm text-[#B57E10] font-medium">
                Check All →
              </Link>
            </div>
            <div className="flex flex-col gap-4 md:gap-10 w-full">
              {updates.length > 0 ? (
                updates.map((update) => (
                  <div key={update._id} className="flex flex-col gap-2 md:gap-3">
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center gap-1 md:gap-2">
                        <User size={14} color="red" />
                        {update.createdBy.userName}
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <Calendar size={14} color="red" />
                        {formatDate(update.createdAt)}
                      </div>
                    </div>
                    <h1 className="text-lg md:text-xl font-bold">{update.title}</h1>
                    <p className="text-xs md:text-sm opacity-45 font-medium">{trimText(update.content, 100)}</p>
                    <Link href={`/updates/${update._id}`} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#B57E10]">
                      Read More <MoveRight size={16} />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">No latest updates.</p>
              )}
            </div>
          </div>

          <div className="bg-white shadow-2xl rounded-lg p-5 md:p-6 flex flex-col gap-4 md:gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-5">
                <Image src={ConstructionIcon} alt="Construction Icon" width={64} height={64} className="w-12 h-12 md:w-16 md:h-16" />
                <h1 className="text-base md:text-lg text-[#B57E10] font-medium">
                  Upcoming Events / Meetings
                </h1>
              </div>
              <Link href="/events" className="text-xs md:text-sm text-[#B57E10] font-medium">
                Check All →
              </Link>
            </div>
            <div className="flex flex-col gap-4 md:gap-5 w-full">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event._id} className="flex flex-col gap-2 md:gap-3">
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center gap-1 md:gap-2">
                        <User size={14} color="red" />
                        By Admin
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <Calendar size={14} color="red" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                      {/* <Image src={event.image} alt={event.title} width={200} height={100} className="w-full md:w-32 rounded-lg h-auto md:h-28 object-cover" /> */}
                      <div className="flex flex-col gap-1 md:gap-2">
                        <h1 className="text-lg md:text-xl font-bold">{event.title}</h1>
                        <p className="text-xs md:text-sm opacity-45 font-medium">{trimText(event.description, 100)}</p>
                        <Link href={`/events/${event._id}`} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#B57E10]">
                          Read More <MoveRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">No upcoming events.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
