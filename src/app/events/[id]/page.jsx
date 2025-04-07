"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data.event);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading event details...</p>;
  }

  if (!event) {
    return <p className="text-center text-red-500 py-10">Event not found</p>;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 md:p-10">
       {
        event.image !== "" &&  <Image 
        src={event.image} 
        alt={event.title} 
        width={600} 
        height={300} 
        className="w-full h-64 object-contain rounded-lg" 
      />
       }
        <h1 className="text-2xl md:text-3xl font-bold mt-5 text-[#B57E10]">{event.title}</h1>
        <p className="text-gray-600 mt-2">{event.description}</p>
        
        <div className="mt-4 flex flex-col gap-3 text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-red-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-green-500" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

