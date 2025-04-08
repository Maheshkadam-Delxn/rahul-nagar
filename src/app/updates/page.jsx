
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, X } from "lucide-react";
import ConstructionIcon from "../../../public/home/events/icon.png";

const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const updatesPerPage = 5;

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

  const openImageModal = (images) => {
    setModalImages(images || []);
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

  return (
    <div className="w-full min-h-screen bg-[#f8f8f8] py-12 px-4 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white rounded-lg p-6 md:p-10 shadow-md space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#B57E10] font-semibold text-lg">
            <Image src={ConstructionIcon} alt="Icon" width={32} height={32} className="w-6 h-6" />
            Past Updates
          </div>

          {currentUpdates.length === 0 ? (
            <p className="text-gray-500 text-sm">No Updates available.</p>
          ) : (
            currentUpdates.map((update) => (
              <div key={update._id} className="space-y-2 border-b pb-4 last:border-b-0">
                <h2 className="font-bold text-md">
                  {update.title} held on{" "}
                  {new Date(update.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <p className="text-sm text-gray-600">{update.content}</p>
                {update.images?.length > 0 && (
                  <button
                    onClick={() => openImageModal(update.images)}
                    className="text-sm text-[#6B46C1] flex items-center gap-1 hover:underline"
                  >
                    <FileText size={14} /> Images
                  </button>
                )}
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
        className="sticky top-2 right-2 ml-auto block text-gray-600 hover:text-red-500 z-10"
      >
        <X size={24} />
      </button>
      <div
        className={`mt-6 ${
          modalImages.length === 1
            ? "flex justify-center"
            : "grid grid-cols-1 sm:grid-cols-2 gap-4"
        }`}
      >
        {modalImages.map((img) => (
          <Image
            key={img._id}
            src={img.url}
            alt={img.alt || "Event image"}
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


export default UpdatesPage;

