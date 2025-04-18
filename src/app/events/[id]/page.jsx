"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin, FileText, ArrowLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const EventDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
    return <p className="text-center text-gray-500 py-10">Loading event details...</p>;
  }

  if (!event) {
    return <p className="text-center text-red-500 py-10">Event not found</p>;
  }

  return (
    <div className="w-full bg-gray-100 px-4 pt-10 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-10 mb-10" style={{ minWidth: "80%" }}>
        <Link href="/events" className="flex items-center gap-2 text-[#B57E10]">
          <ArrowLeft size={18} /> Back to Events
        </Link>
        
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold mt-5 text-[#B57E10]">{event.title}</h1>
        </div>

        {event.image && (
          <div className="mt-6 cursor-pointer flex justify-start" onClick={() => setShowModal(true)}>
            <div className="w-1/2 md:w-2/5">
              <Image
                src={event.image}
                alt={event.title}
                width={400}
                height={600}
                className="h-112 w-full object-cover rounded-lg hover:opacity-90 transition"
              />
            </div>
          </div>
        )}

        <p className="text-gray-600 mt-4">{event.description}</p>

        <div className="mt-4 flex flex-col gap-3 text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-red-500" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
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

        {event.document && (
          <div className="mt-6">
            <a
              href={event.document}
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
                  src={event.image}
                  alt={event.title}
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

export default EventDetails;