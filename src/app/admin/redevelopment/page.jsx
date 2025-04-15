"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Clock,
  MapPin,
  Loader,
  FileText,
  LayoutGrid,
  ListPlus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RedevelopmentManagement() {
  const user = useAuth();
  const [activeTab, setActiveTab] = useState("events"); // 'events' or 'updates'
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null,
    document: null,
    documentUrl: "",
    isImageDeleted: false,
    isDocumentDeleted: false,
  });

  // Fetch data when component mounts or when tab changes
  useEffect(() => {
    if (activeTab === "events") {
      fetchEvents();
    } else {
      fetchUpdates();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/redevelopment/event/fetchAll");
      if (!response.ok) {
        throw new Error("Failed to fetch redevelopment events");
      }
      const data = await response.json();
      if (data.success && data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching redevelopment events:", error);
      setError("Failed to load redevelopment events. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchUpdates = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/redevelopment/update/fetchAll");
      if (!response.ok) {
        throw new Error("Failed to fetch redevelopment updates");
      }
      const data = await response.json();
      if (data) {
        setUpdates(data);
      }
    } catch (error) {
      console.error("Error fetching redevelopment updates:", error);
      setError("Failed to load redevelopment updates. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
        isImageDeleted: false,
      }));
    }
  };

  const handleDocumentChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size - 256KB = 262144 bytes
      const maxSizeInBytes = 256 * 1024; // 256KB in bytes
      
      if (file.size > maxSizeInBytes) {
        alert(`File size exceeds the 256KB limit. Please upload a smaller file.`);
        return;
      }
      
      // Get file extension
      const fileExt = file.name.split(".").pop().toLowerCase();
  
      // List of formats that are supported
      const supportedFormats = ["pdf", "txt", "xls", "xlsx", "doc", "docx"];
  
      if (supportedFormats.includes(fileExt)) {
        // Set the file in state temporarily to show name
        setFormData((prev) => ({
          ...prev,
          document: file,
          isDocumentDeleted: false,
        }));
        
        // Begin upload immediately
        await uploadDocument(file);
      } else {
        alert(
          `The file format "${fileExt}" is not supported. Please use one of the following formats: PDF, TXT, XLS, XLSX, DOC, DOCX.`
        );
      }
    }
  };

  const uploadDocument = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const documentData = new FormData();
    documentData.append("file", file);
    documentData.append("folderId", "1TcVRn4Af47yQ2mVq3AzBHRHINSXpbPia");

    try {
      // Create XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        });
        
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error("Invalid response format"));
            }
          } else {
            reject(new Error(`HTTP error: ${xhr.status}`));
          }
        });
        
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));
        
        xhr.open("POST", "/api/upload");
        xhr.send(documentData);
      });

      const documentResult = await uploadPromise;
      
      let documentUrl = "";
      if (documentResult.viewLink) {
        documentUrl = documentResult.viewLink;
      } else if (documentResult.url) {
        documentUrl = documentResult.url;
      } else if (documentResult.data && documentResult.data.fileUrl) {
        documentUrl = documentResult.data.fileUrl;
      } else if (documentResult.data && documentResult.data.url) {
        documentUrl = documentResult.data.url;
      } else {
        console.error("Could not extract document URL from response:", documentResult);
        throw new Error("Failed to get document URL from upload response");
      }
      
      // Update state with the document URL
      setFormData((prev) => ({
        ...prev,
        documentUrl: documentUrl,
      }));
      
      return documentUrl;
    } catch (error) {
      console.error("Error uploading document:", error);
      setError("Failed to upload document. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      currentImageUrl: null,
      isImageDeleted: true,
    }));
  };

  const handleDeleteDocument = () => {
    setFormData((prev) => ({
      ...prev,
      document: null,
      documentUrl: "",
      currentDocumentUrl: null,
      isDocumentDeleted: true,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab === "events" ? "event" : "update"}?`)) {
      try {
        const userId = user?.user?.id;
       
        if (!userId) {
          alert("User not found. Please log in again.");
          return;
        }

        const endpoint = activeTab === "events" 
          ? "/api/redevelopment/event/delete-event" 
          : "/api/redevelopment/update/delete-update";

        const response = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            [activeTab === "events" ? "eventId" : "updateId"]: id, 
            userId 
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to delete ${activeTab === "events" ? "event" : "update"}`);
        }

        if (activeTab === "events") {
          setEvents(events.filter((event) => event._id !== id));
        } else {
          setUpdates(updates.filter((update) => update._id !== id));
        }
      } catch (error) {
        console.error(`Error deleting ${activeTab === "events" ? "event" : "update"}:`, error);
        alert(`Failed to delete ${activeTab === "events" ? "event" : "update"}. Please try again.`);
      }
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentItemId(item._id);

    setFormData({
      title: item.title,
      description: item.description,
      date: new Date(item.date).toISOString().split("T")[0],
      time: item.time || "",
      location: item.location || "",
      image: null,
      document: null,
      documentUrl: item.document || "",
      currentImageUrl: item.image,
      currentDocumentUrl: item.document,
      isImageDeleted: false,
      isDocumentDeleted: false,
    });

    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: null,
      document: null,
      documentUrl: "",
      isImageDeleted: false,
      isDocumentDeleted: false,
    });
    setIsEditMode(false);
    setCurrentItemId(null);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    let imageUrl = formData.currentImageUrl || "";
    let documentUrl = formData.documentUrl || formData.currentDocumentUrl || "";

    // Handle image
    if (formData.isImageDeleted) {
      imageUrl = "";
    } else if (formData.image) {
      const imageData = new FormData();
      imageData.append("file", formData.image);
      imageData.append("upload_preset", "event-upload");

      try {
        const imageResponse = await fetch(
          "https://api.cloudinary.com/v1_1/rahul-nagar/image/upload",
          {
            method: "POST",
            body: imageData,
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(
            `Image upload failed: ${
              imageResult.error?.message || "Unknown error"
            }`
          );
        }

        imageUrl = imageResult.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Handle document deletion
    if (formData.isDocumentDeleted) {
      documentUrl = "";
    }

    // Prepare update data
    const updateData = {
      [activeTab === "events" ? "eventId" : "updateId"]: currentItemId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      time: activeTab === "events" ? formData.time : undefined,
      location: activeTab === "events" ? formData.location.trim() : undefined,
      image: imageUrl,
      document: documentUrl,
    };

    try {
      const endpoint = activeTab === "events" 
        ? "/api/redevelopment/event/edit-event" 
        : "/api/redevelopment/update/edit-update";

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update ${activeTab === "events" ? "event" : "update"}`);
      }

      const result = await response.json();

      // Update items list with the updated item
      if (activeTab === "events") {
        setEvents(
          events.map((event) =>
            event._id === currentItemId ? result.event : event
          )
        );
      } else {
        setUpdates(
          updates.map((update) =>
            update._id === currentItemId ? result : update
          )
        );
      }

      // Reset form and close modal
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(`Error updating ${activeTab === "events" ? "event" : "update"}:`, error);
      setError(`Failed to update ${activeTab === "events" ? "event" : "update"}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      await handleUpdate();
      return;
    }

    setLoading(true);
    setError(null);

    let imageUrl = "";
    // Use the already uploaded document URL if available
    let documentUrl = formData.documentUrl || "";

    // Handle image upload
    if (formData.image) {
      const imageData = new FormData();
      imageData.append("file", formData.image);
      imageData.append("upload_preset", "event-upload");

      try {
        const imageResponse = await fetch(
          "https://api.cloudinary.com/v1_1/rahul-nagar/image/upload",
          {
            method: "POST",
            body: imageData,
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(
            `Image upload failed: ${
              imageResult.error?.message || "Unknown error"
            }`
          );
        }

        imageUrl = imageResult.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }
    }

    const itemData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      ...(activeTab === "events" && {
        time: formData.time,
        location: formData.location.trim(),
      }),
      image: imageUrl || "",
      document: documentUrl || "",
      createdBy: user?.user?.id,
    };

    try {
      const endpoint = activeTab === "events" 
        ? "/api/redevelopment/event/add-event" 
        : "/api/redevelopment/update/add-update";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add ${activeTab === "events" ? "event" : "update"}: ${response.statusText}`);
      }

      if (activeTab === "events") {
        fetchEvents();
      } else {
        fetchUpdates();
      }
      
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(`Error adding ${activeTab === "events" ? "event" : "update"}:`, error);
      setError(`Failed to add ${activeTab === "events" ? "event" : "update"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  console.log(updates)
  const hasRequiredRole = user?.user?.role === "Super-Admin" || 
                         user?.user?.role === "Admin" || 
                         user?.user?.role === "Associate-Member";

  if (!hasRequiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Redevelopment Management
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          Add {activeTab === "events" ? "Event" : "Update"}
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 ${
            activeTab === "events"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          } flex items-center gap-2`}
          onClick={() => setActiveTab("events")}
        >
          <Calendar size={18} />
          Events
        </button>
        <button
          className={`py-3 px-6 ${
            activeTab === "updates"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          } flex items-center gap-2`}
          onClick={() => setActiveTab("updates")}
        >
          <ListPlus size={18} />
          Updates
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {fetchLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <>
          {activeTab === "events" ? (
            // Events section
            events.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Redevelopment Events Found
                </h3>
                <p className="text-gray-500">
                  Click 'Add Event' to create your first redevelopment event
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Calendar size={48} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="flex items-center text-gray-500 mb-2">
                        <Calendar size={16} className="mr-2 flex-shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      {event.time && (
                        <div className="flex items-center text-gray-500 mb-2">
                          <Clock size={16} className="mr-2 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center text-gray-500 mb-4">
                          <MapPin size={16} className="mr-2 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.document && (
                        <div className="flex items-center text-blue-500 mb-4">
                          <FileText size={16} className="mr-2 flex-shrink-0" />
                          <a
                            href={event.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => handleDelete(event._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Updates section
            updates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ListPlus size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Redevelopment Updates Found
                </h3>
                <p className="text-gray-500">
                  Click 'Add Update' to create your first redevelopment update
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {updates?.map((update) => (
                  <div
                    key={update?._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      {update?.image ? (
                        <img
                          src={update?.image}
                          alt={update?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ListPlus size={48} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Update
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {update?.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {update?.description}
                      </p>

                      <div className="flex items-center text-gray-500 mb-4">
                        <Calendar size={16} className="mr-2 flex-shrink-0" />
                        <span>{formatDate(update?.date)}</span>
                      </div>

                      {update?.document && (
                        <div className="flex items-center text-blue-500 mb-4">
                          <FileText size={16} className="mr-2 flex-shrink-0" />
                          <a
                            href={update?.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          onClick={() => handleEdit(update)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => handleDelete(update?._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* Modal for adding/editing events or updates */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? `Edit ${activeTab === "events" ? "Event" : "Update"}` : `Add New ${activeTab === "events" ? "Event" : "Update"}`}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Enter ${activeTab === "events" ? "event" : "update"} title`}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Enter ${activeTab === "events" ? "event" : "update"} description`}
                  rows="4"
                  required
                />
              </div>

              <div className={`${activeTab === "events" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""} mb-4`}>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="date"
                  >
                    Date*
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                {activeTab === "events" && (
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="time"
                    >
                      Time*
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                    </select>
                  </div>
                )}
              </div>

              {activeTab === "events" && (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="location"
                  >
                    Location*
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter event location"
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  {(formData.image || formData.currentImageUrl) && !formData.isImageDeleted ? (
                    <div className="relative">
                      <div className="h-24 w-24 bg-gray-200 rounded overflow-hidden">
                        {formData.image ? (
                          <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={formData.currentImageUrl}
                            alt="Current"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-24 w-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <ImageIcon size={24} className="text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    <p>Recommended: 1200 x 800 pixels</p>
                    <p>Maximum size: 5MB</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Document (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {(formData.document || formData.documentUrl) && !formData.isDocumentDeleted ? (
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                      <FileText size={20} className="text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {formData.document ? formData.document.name : "Document"}
                      </span>
                      <button
                        type="button"
                        onClick={handleDeleteDocument}
                        className="text-red-500 hover:text-red-600 ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        id="document"
                        className="hidden"
                        onChange={handleDocumentChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      />
                      <label
                        htmlFor="document"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors"
                      >
                        <FileText size={18} />
                        Upload Document
                      </label>
                    </div>
                  )}
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT (max 256KB)
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      {isEditMode ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      {isEditMode ? "Update" : "Save"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View for grid and list modes */}
      <div className="flex justify-end mt-8">
        <button
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded mr-2"
          title="Grid View"
        >
          <LayoutGrid size={20} className="text-gray-600" />
        </button>
        <button
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
          title="List View"
        >
          <FileText size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}