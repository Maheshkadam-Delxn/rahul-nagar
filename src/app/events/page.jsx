"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MoveRight } from "lucide-react";
import ConstructionIcon from "../../../public/home/events/icon.png";

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await fetch("/api/events/fetchAll");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events);
      } catch (error) {
        console.error("Error fetching events:", error);
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
            <h1 className="text-sm md:text-base">Upcoming Events</h1>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left w-full">
            All Upcoming Events & Meetings
          </h1>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch justify-center gap-5">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-2xl rounded-lg p-5 md:p-6 flex flex-col gap-4 md:gap-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-5">
                    <Image
                      src={ConstructionIcon}
                      alt="Construction Icon"
                      width={64}
                      height={64}
                      className="w-12 h-12 md:w-16 md:h-16"
                    />
                    <h1 className="text-base md:text-lg text-[#B57E10] font-medium">
                      {event.title}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1 md:gap-2">
                      <User size={14} color="red" />
                      By Admin
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Calendar size={14} color="red" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    {event.image && (
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={200}
                        height={100}
                        className="w-full md:w-32 rounded-lg h-auto md:h-28 object-cover"
                      />
                    )}
                    <div className="flex flex-col gap-1 md:gap-2">
                      <p className="text-xs md:text-sm opacity-45 font-medium">
                        {trimText(event.description, 100)}
                      </p>
                      <Link
                        href={`/events/${event._id}`}
                        className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#B57E10]"
                      >
                        Read More <MoveRight size={16} />
                      </Link>
                      {event.document && (
                        <Link
                          href={event.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs md:text-sm text-yellow-600 hover:text-yellow-800 transition"
                        >
                          View Document
                        </Link>
                      )}
                    </div>
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
  );
};

export default EventsPage;
