"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, X, Calendar, Clock, MoveRight } from "lucide-react";
import ConstructionIcon from "../../../public/home/events/icon.png";
// import { FileText, X, User, Calendar, MoveRight } from "lucide-react";

const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const updatesPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatesRes = await fetch("/api/redevelopment/update/fetchAll");
        if (!updatesRes.ok) throw new Error("Failed to fetch updates");
        const updatesData = await updatesRes.json();
        console.log("Fetched updates data:", updatesData);
        // Check if the data is in the expected format
        if (updatesData.success && updatesData.updates) {
          setUpdates(updatesData.updates);
        } else {
          setUpdates(updatesData);
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
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
    setModalImages(image || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImages([]);
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(updates.length / updatesPerPage);
  const indexOfLast = currentPage * updatesPerPage;
  const indexOfFirst = indexOfLast - updatesPerPage;
  const currentUpdates = updates.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper function to get content from various possible field names
  const getContent = (update) => {
    return update.content || update.description || "";
  };

  // Format date properly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f8f8] py-12 px-4 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white rounded-lg p-6 md:p-10 shadow-md space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#B57E10] font-semibold text-lg">
            <Image src={ConstructionIcon} alt="Icon" width={1920} height={1080} className="w-16 h-16" />
            Updates
          </div>

          {currentUpdates.length === 0 ? (
            <p className="text-gray-500 text-sm">No Updates available.</p>
          ) : (
            currentUpdates.map((update) => (
              <div key={update._id} className="space-y-2 border-b pb-4 last:border-b-0">
                <Link href={`/redevlopmentUpdates/${update._id}`} className="font-bold text-md">
                  {update.title}
                </Link>
                
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <Calendar size={14} />
                  <span>
                    {update.date 
                      ? formatDate(update.date) 
                      : (update.createdAt ? formatDate(update.createdAt) : "Date not available")}
                  </span>
                  
                  {update.time && (
                    <>
                      <Clock size={14} className="ml-3" />
                      <span>{update.time}</span>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">{getContent(update)}</p>
                
                <div className="flex gap-4 mt-2">
                  {update?.image && (
                    <button
                      onClick={() => openImageModal(update.image)}
                      className="text-sm text-[#6B46C1] flex items-center gap-1 hover:underline"
                    >
                      <FileText size={14} /> View Image
                    </button>
                  )}
                  
                  {update?.document && (
                    <Link
                      href={update.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#6B46C1] flex items-center gap-1 hover:underline"
                    >
                      <FileText size={14} /> View Document
                    </Link>
                  )}
                  
                </div>
                <Link
                               href={`/redevlopmentUpdates/${update._id}`}
                                className="text-sm text-yellow-600 font-semibold flex items-center gap-1 hover:underline"
                              >
                                Read More <MoveRight size={16} />
                              </Link>
              </div>
              
            ))
          )}
        </section>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex gap-2 flex-wrap justify-center items-center">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center border ${
                currentPage === page ? "bg-[#B57E10] text-white" : "bg-white text-gray-700"
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
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 z-10"
            >
              <X size={24} />
            </button>
            <div className="mt-6 flex justify-center">
              {modalImages && (
                <Image
                  src={modalImages}
                  alt="Update image"
                  width={600}
                  height={400}
                  className="max-w-full h-auto rounded-md object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatesPage;