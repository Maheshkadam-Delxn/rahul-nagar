"use client";
import React, { useEffect, useState } from "react";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import { Toaster } from "react-hot-toast";
import { Play, FileText, Lock, Calendar, X } from "lucide-react";

const RedevelopmentInfoPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [image, setImage] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "rahulnagarmember" && password === "rn0925") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const openModal = (doc) => {
    setSelectedDoc(doc);
  };

  const closeModal = () => {
    setSelectedDoc(null);
  };

  const getDriveFileId = (url) => {
    const match = url?.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  useEffect(() => {
    if (selectedDoc?.url) {
      const fileId = getDriveFileId(selectedDoc.url);
      const fileUrl = fileId
        ? `https://drive.google.com/file/d/${fileId}/preview`
        : null;
      setImage(fileUrl);
    } else {
      setImage(null);
    }
  }, [selectedDoc]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBuilders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/builder/fetchAll");
        if (!response.ok) throw new Error("Failed to fetch builders");
        const data = await response.json();
        setBuilders(data?.builders || []);
      } catch (error) {
        console.error("Error fetching builders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilders();
  }, [isAuthenticated]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Restricted Access</h1>
        <p className="text-gray-600 mb-6">Please enter your credentials to access this page.</p>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B57E10]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B57E10]"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#B57E10] hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B57E10]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-30 blur-lg"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-purple-400 rounded-full opacity-25 blur-3xl"></div>
        <Toaster />

        <ServiceHeroSection
          name="Redevelopment Information"
          breadcrumbs={[
            { label: "Home", link: "/" },
            { label: "Redevelopment Info", link: "/redevelopment-info" },
          ]}
        />
        <div className="w-full bg-white">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-0.5 bg-[#B57E10]"></div>
                <span className="text-[#B57E10] font-semibold uppercase tracking-wide">Status</span>
                <div className="w-12 h-0.5 bg-[#B57E10]"></div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Redevelopment</h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">Developers Presentations</h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-12 border-l-4 border-[#B57E10]">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-[#B57E10] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Confidentiality Note</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This is a confidential document prepared strictly for internal use. The details mentioned herein are highly sensitive and are not to be shared with anyone outside Ruival Nager. Sharing, copying, or distributing this document in any form is strictly prohibited. This resolution is for our safety and security purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <a
                href="https://drive.google.com/file/d/1xskhd00xMzNGVNHEnA85KEVkt8jnapfh/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#B57E10] rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Legal Compliance Report</h4>
                    <p className="text-gray-600 text-sm">Download the legal compliance report</p>
                  </div>
                </div>
              </a>
              <a
                href="https://drive.google.com/file/d/1DZqg0ajMflfWtJi68iSDmr8ITqdrQtFT/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#B57E10] rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Rahul Nagar Evaluation Report</h4>
                    <p className="text-gray-600 text-sm">Download the evaluation report</p>
                  </div>
                </div>
              </a>
            </div>

            <div className="text-center mb-16">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Stay updated with the confidential information
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Developers Presentations</h2>
            </div>

            <div className="space-y-8">
              {builders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No developer presentations available yet.</p>
                </div>
              ) : (
                builders.map((builder, index) => (
                  <div key={builder._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-[#B57E10] to-amber-600 p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white">{builder.developer}</h3>
                          <p className="text-amber-100">Presentation #{index + 1}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-amber-100">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(builder.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Play className="w-5 h-5 text-[#B57E10]" />
                          Presentation Video
                        </h4>
                        {builder.video?.url && (
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${extractYouTubeId(builder.video.url)}`}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={`${builder.developer} Presentation`}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#B57E10]" />
                          Additional Documents
                        </h4>
                        <div className="space-y-2">
                          {builder.additionalDocuments?.map((doc, docIndex) => (
                            <div key={doc._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#B57E10] rounded-full flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-700">{doc.name}</span>
                              </div>
                              <button
                                onClick={() => openModal(doc)}
                                className="text-[#B57E10] hover:underline"
                              >
                                View Document
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-5 h-5 bg-[#B57E10] rounded-full flex items-center justify-center text-white text-sm">%</span>
                          Updated Offer
                        </h4>
                        {builder.offer && (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-600">{builder.offer.title}</p>
                              <p className="text-2xl font-bold text-[#B57E10]">{builder.offer.percentage}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800">{selectedDoc.name}</h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative bg-gray-100">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b to-transparent z-10"></div>
              <div className="w-full h-full overflow-auto">
                {image ? (
                  <iframe
                    src={image}
                    className="w-full h-full min-h-[70vh] border-0 rounded-b-xl"
                    allow="autoplay"
                    title="Document Preview"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    <p>Preview not available for non-PDF documents.</p>
                    <a
                      href={selectedDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#B57E10] hover:underline"
                    >
                      Open Document
                    </a>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p className="text-gray-600">Scroll to navigate document</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RedevelopmentInfoPage;