"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, X, User, Calendar, MoveRight } from "lucide-react";
import ConstructionIcon from "../../../public/home/events/icon.png";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
  const [pastCurrentPage, setPastCurrentPage] = useState(1);
  const eventsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await fetch("/api/redevelopment/event/fetchAll");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setModalImages([]);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openImageModal = (image) => {
    setModalImages([{ _id: "main", url: image }]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImages([]);
    setIsModalOpen(false);
  };

  const trimText = (text, maxLength) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Filter events based on current date
  const currentDate = new Date();
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = events
    .filter((event) => new Date(event.date) < currentDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingTotalPages = Math.ceil(upcomingEvents.length / eventsPerPage);
  const upcomingIndexOfLast = upcomingCurrentPage * eventsPerPage;
  const upcomingIndexOfFirst = upcomingIndexOfLast - eventsPerPage;
  const currentUpcomingEvents = upcomingEvents.slice(upcomingIndexOfFirst, upcomingIndexOfLast);

  const pastTotalPages = Math.ceil(pastEvents.length / eventsPerPage);
  const pastIndexOfLast = pastCurrentPage * eventsPerPage;
  const pastIndexOfFirst = pastIndexOfLast - eventsPerPage;
  const currentPastEvents = pastEvents.slice(pastIndexOfFirst, pastIndexOfLast);

  const paginateUpcoming = (pageNumber) => setUpcomingCurrentPage(pageNumber);
  const paginatePast = (pageNumber) => setPastCurrentPage(pageNumber);

  // Event Item Component to avoid repetition
  const EventItem = ({ event, isPast }) => (
    <div key={event._id} className="space-y-2 border-b pb-4 last:border-b-0">
      <h2 className="font-bold text-md">
        {event.title} {isPast ? "held on" : "scheduled for"}{" "}
        {new Date(event.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h2>
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          <User size={14} color="#6B46C1" />
          By Admin
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} color="#6B46C1" />
          {new Date(event.date).toLocaleDateString()}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        {event.image && (
          <div className="flex-shrink-0">
            <Image
              src={event.image}
              alt={event.title}
              width={200}
              height={100}
              className="w-full md:w-32 rounded-lg h-auto md:h-28 object-cover cursor-pointer"
              onClick={() => openImageModal(event.image)}
            />
          </div>
        )}
        <div className="flex-grow">
          <p className="text-sm text-gray-600">{trimText(event.description, 200)}</p>
          <div className="mt-2 flex items-center gap-3">
            <Link
              href={`/redevelopmentEvents/${event._id}`}
              className="text-sm text-yellow-600 font-semibold flex items-center gap-1 hover:underline"
            >
              Read More <MoveRight size={16} />
            </Link>
            {event.document && (
              <Link
                href={event.document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#6B46C1] flex items-center gap-1 hover:underline"
              >
                <FileText size={14} /> View Document
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#f8f8f8] py-12 px-4 flex flex-col items-center">
      {/* Upcoming Events Section */}
      <div className="max-w-5xl w-full bg-white rounded-lg p-6 md:p-10 shadow-md space-y-8 mb-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#B57E10] font-semibold text-lg">
            <Image src={ConstructionIcon} alt="Icon" width={1920} height={1080} className="w-16  h-16" />
            Upcoming Events
          </div>

          {currentUpcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming events available.</p>
          ) : (
            currentUpcomingEvents.map((event) => (
              <EventItem key={event._id} event={event} isPast={false} />
            ))
          )}
        </section>
      </div>

      {/* Upcoming Events Pagination */}
      {upcomingTotalPages > 1 && (
        <div className="mt-2 mb-8 flex gap-2 flex-wrap justify-center items-center">
          {Array.from({ length: upcomingTotalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginateUpcoming(page)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center border ${
                upcomingCurrentPage === page ? "bg-[#B57E10] text-white" : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Past Events Section */}
      <div className="max-w-5xl w-full bg-white rounded-lg p-6 md:p-10 shadow-md space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#B57E10] font-semibold text-lg">
          <Image src={ConstructionIcon} alt="Icon" width={1920} height={1080} className="w-16  h-16" />
          Past Events
          </div>

          {currentPastEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No past events available.</p>
          ) : (
            currentPastEvents.map((event) => (
              <EventItem key={event._id} event={event} isPast={true} />
            ))
          )}
        </section>
      </div>

      {/* Past Events Pagination */}
      {pastTotalPages > 1 && (
        <div className="mt-6 flex gap-2 flex-wrap justify-center items-center">
          {Array.from({ length: pastTotalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginatePast(page)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center border ${
                pastCurrentPage === page ? "bg-[#B57E10] text-white" : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="sticky top-2 right-2 ml-auto block text-gray-600 hover:text-red-500 z-10"
            >
              <X size={24} />
            </button>
            <div className="mt-6 flex justify-center">
              {modalImages.map((img) => (
                <Image
                  key={img._id}
                  src={img.url}
                  alt="Event image"
                  width={600}
                  height={400}
                  className="w-full max-w-md rounded-md object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;