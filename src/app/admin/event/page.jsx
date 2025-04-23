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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EventsManagement() {
  const user = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [newEvent, setNewEvent] = useState({
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

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/events/fetchAll");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      if (data.success && data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewEvent((prev) => ({
        ...prev,
        image: e.target.files[0],
        isImageDeleted: false,
      }));
    }
  };

  // Updated document change handler with immediate upload
 // Updated document change handler with file size validation and immediate upload
 const handleDocumentChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check file size - 4MB = 4 * 1024 * 1024 bytes
    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB in bytes
    
    if (file.size > maxSizeInBytes) {
      alert(`File size exceeds the 4MB limit. Please upload a smaller file.`);
      return;
    }
    
    // Get file extension
    const fileExt = file.name.split(".").pop().toLowerCase();

    // List of formats that are supported
    const supportedFormats = ["pdf", "txt", "xls", "xlsx", "doc", "docx"];

    if (supportedFormats.includes(fileExt)) {
      // Set the file in state temporarily to show name
      setNewEvent((prev) => ({
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

// Add this function before the return statement in your component
const trimText = (text, wordLimit = 10) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};
  // New function for document upload with progress bar
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
      console.log("Document upload response:", documentResult);
      
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
      setNewEvent((prev) => ({
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
    setNewEvent((prev) => ({
      ...prev,
      image: null,
      currentImageUrl: null,
      isImageDeleted: true,
    }));
  };

  const handleDeleteDocument = () => {
    setNewEvent((prev) => ({
      ...prev,
      document: null,
      documentUrl: "",
      currentDocumentUrl: null,
      isDocumentDeleted: true,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const userId = user?.user?.id;
        const role = user?.user?.role

        if (!userId) {
          alert("User not found. Please log in again.");
          return;
        }


        const response = await fetch("/api/events/delete-event", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId: id, userId,role }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete event");
        }

        setEvents(events.filter((event) => event._id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleEdit = (event) => {
    setIsEditMode(true);
    setCurrentEventId(event._id);

    setNewEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      image: null,
      document: null,
      documentUrl: event.document || "",
      currentImageUrl: event.image,
      currentDocumentUrl: event.document,
      isImageDeleted: false,
      isDocumentDeleted: false,
    });

    setShowModal(true);
  };

  const resetForm = () => {
    setNewEvent({
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
    setCurrentEventId(null);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    let imageUrl = newEvent.currentImageUrl || "";
    let documentUrl = newEvent.documentUrl || newEvent.currentDocumentUrl || "";

    // Handle image
    if (newEvent.isImageDeleted) {
      imageUrl = "";
    } else if (newEvent.image) {
      const imageData = new FormData();
      imageData.append("file", newEvent.image);
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
    if (newEvent.isDocumentDeleted) {
      documentUrl = "";
    }

    // Prepare update data
    const updateData = {
      eventId: currentEventId,
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location.trim(),
      image: imageUrl,
      document: documentUrl,
    };

    try {
      const response = await fetch("/api/events/update-event", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      const result = await response.json();

      // Update events list with the updated event
      setEvents(
        events.map((event) =>
          event._id === currentEventId ? result.event : event
        )
      );

      // Reset form and close modal
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating event:", error);
      setError(`Failed to update event: ${error.message}`);
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
    let documentUrl = newEvent.documentUrl || "";

    // Handle image upload
    if (newEvent.image) {
      const imageData = new FormData();
      imageData.append("file", newEvent.image);
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

    const eventData = {
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location.trim(),
      image: imageUrl || "",
      document: documentUrl || "",
      createdBy: user?.user?.id,
    };

    try {
      const response = await fetch("/api/events/add-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add event: ${response.statusText}`);
      }

      const addedEvent = await response.json();
      fetchEvents();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  console.log(user)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return user?.user?.role === "Super-Admin" ||
    user?.user?.role === "Admin" ||
    user?.user?.role === "Associate-Member" ? (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Housing Society Events
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          Add Event
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
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Events Found
          </h3>
          <p className="text-gray-500">
            Click 'Add Event' to create your first event
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
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-1">
  {trimText(event.description)}
</p>

                <div className="flex items-center text-gray-500 mb-2">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  <span>{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-2">
                  <Clock size={16} className="mr-2 flex-shrink-0" />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>

               

                <div className="flex justify-between gap-2 mt-2 items-center">
                {event.document && (
                  <div className="flex items-center text-blue-500 ">
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
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Event" : "Add New Event"}
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
                  Event Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter event title"
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
                  value={newEvent.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter event description"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    value={newEvent.date}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

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
                    value={newEvent.time}
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
              </div>

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
                  value={newEvent.location}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter event location"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="image"
                >
                  Event Image
                </label>

                {isEditMode &&
                  newEvent.currentImageUrl &&
                  !newEvent.isImageDeleted && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Current Image:</p>
                      <img
                        src={newEvent.currentImageUrl}
                        alt="Current event image"
                        className="h-32 object-cover rounded mt-1"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          Upload a new image to replace, or delete the current
                          one.
                        </p>
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete Image
                        </button>
                      </div>
                    </div>
                  )}

                {newEvent.isImageDeleted && isEditMode && (
                  <div className="text-sm text-red-500 mb-2">
                    Image will be deleted upon saving.
                  </div>
                )}

                <div className="mt-1 flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-purple-600 rounded-lg shadow-lg tracking-wide uppercase border border-purple-600 cursor-pointer hover:bg-purple-600 hover:text-white">
                    <span className="mx-auto flex items-center">
                      <ImageIcon size={24} className="mr-2" />
                      <span className="text-base leading-normal">
                        Select a file
                      </span>
                    </span>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>

                  {newEvent.image && (
                    <span className="ml-3 text-sm text-gray-600">
                      {newEvent.image.name}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Optional: Upload an image for this event
                </p>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="document"
                >
                  Event Document
                </label>

                {isEditMode &&
                  newEvent.currentDocumentUrl &&
                  !newEvent.isDocumentDeleted && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Current Document:</p>
                      <div className="flex items-center mt-1">
                        <FileText size={18} className="text-blue-600 mr-2" />
                        <a
                          href={newEvent.currentDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Current Document
                        </a>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          Upload a new document to replace, or delete the
                          current one.
                        </p>
                        <button
                          type="button"
                          onClick={handleDeleteDocument}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete Document
                        </button>
                      </div>
                    </div>
                  )}

                {newEvent.isDocumentDeleted && isEditMode && (
                  <div className="text-sm text-red-500 mb-2">
                    Document will be deleted upon saving.
                  </div>
                )}

                <div className="mt-1 flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-purple-600 rounded-lg shadow-lg tracking-wide uppercase border border-purple-600 cursor-pointer hover:bg-purple-600 hover:text-white">
                    <span className="mx-auto flex items-center">
                      <FileText size={24} className="mr-2" />
                      <span className="text-base leading-normal">
                        Select document
                      </span>
                    </span>
                    <input
                      type="file"
                      id="document"
                      name="document"
                      onChange={handleDocumentChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    />
                  </label>

                  {newEvent.document && (
                    <span className="ml-3 text-sm text-gray-600">
                      {newEvent.document.name}
                    </span>
                  )}
                </div>

                {/* Progress bar for document upload */}
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}
                
                {/* Show upload success message */}
                {newEvent.documentUrl && !isUploading && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Document uploaded successfully
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Optional: Upload a document for this event (.pdf, .doc, .docx,
                  .xls, .xlsx, .txt)
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading || isUploading}
                >Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  disabled={loading || isUploading}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Update Event" : "Create Event"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  ) : (
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