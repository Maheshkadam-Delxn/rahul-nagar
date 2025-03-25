"use client"
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image,
  Clock,
  MapPin,
  Loader
} from "lucide-react";

export default function EventsManagement() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null
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
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewEvent(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const userId = sessionStorage.getItem("userId"); // Get userId from sessionStorage
        const token = sessionStorage.getItem("authToken"); // Retrieve token from sessionStorage
  
        if (!userId) {
          alert("User not found. Please log in again.");
          return;
        }
  
        if (!token) {
          alert("Authentication token missing. Please log in again.");
          return;
        }
  
        const response = await fetch("/api/events/delete-event", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Add token in Authorization header
          },
          body: JSON.stringify({ eventId: id, userId }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete event");
        }
  
        setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };
  
  const handleEdit = (event) => {
    // Set edit mode and populate form with event data
    setIsEditMode(true);
    setCurrentEventId(event._id);
    
    setNewEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0], // Format date for input
      time: event.time,
      location: event.location,
      image: null, // Can't populate file input, but we'll handle this
      currentImageUrl: event.image // Store current image URL
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
      image: null
    });
    setIsEditMode(false);
    setCurrentEventId(null);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    
    let imageUrl = newEvent.currentImageUrl || "";
    
    // Upload new image if selected
    if (newEvent.image) {
      const imageData = new FormData();
      imageData.append("file", newEvent.image);
      imageData.append("upload_preset", "event-upload"); // Cloudinary preset
  
      try {
        const imageResponse = await fetch("https://api.cloudinary.com/v1_1/rahul-nagar/image/upload", {
          method: "POST",
          body: imageData,
        });
  
        const imageResult = await imageResponse.json();
  
        if (!imageResponse.ok) {
          throw new Error(`Image upload failed: ${imageResult.error?.message || "Unknown error"}`);
        }
  
        imageUrl = imageResult.secure_url;
  
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }
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
      setEvents(events.map(event => 
        event._id === currentEventId ? result.event : event
      ));
      
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
    
    // If in edit mode, call update instead
    if (isEditMode) {
      await handleUpdate();
      return;
    }
    
    setLoading(true);
    setError(null);
  
    let imageUrl = "";
  
    // Upload Image if exists
    if (newEvent.image) {
      const imageData = new FormData();
      imageData.append("file", newEvent.image);
      imageData.append("upload_preset", "event-upload"); // Cloudinary preset
  
      try {
        const imageResponse = await fetch("https://api.cloudinary.com/v1_1/rahul-nagar/image/upload", {
          method: "POST",
          body: imageData,
        });
  
        const imageResult = await imageResponse.json();
  
        if (!imageResponse.ok) {
          throw new Error(`Image upload failed: ${imageResult.error?.message || "Unknown error"}`);
        }
  
        imageUrl = imageResult.secure_url;
  
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }
    }
  
    // Prepare Event Data
    const eventData = {
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location.trim(),
      image: imageUrl,
      createdBy: sessionStorage?.getItem('userId') || "defaultAdminId",
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
      
      // Refresh events list after adding new event
      fetchEvents();
  
      // Reset Form
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Housing Society Events</h1>
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
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {fetchLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size={40} className="animate-spin text-purple-600" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Image size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Events Found</h3>
          <p className="text-gray-500">Click 'Add Event' to create your first event</p>
        </div>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="h-48 bg-gray-200 relative">
                {event.image ? (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
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
      )}

      {/* Add/Edit Event Modal */}
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
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
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                    <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                    <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                    <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
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

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Event Image{isEditMode ? "" : "*"}
                </label>
                {isEditMode && newEvent.currentImageUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <img 
                      src={newEvent.currentImageUrl} 
                      alt="Current event image" 
                      className="h-32 object-cover rounded mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new image to replace the current one, or leave empty to keep the current image.
                    </p>
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-purple-600 rounded-lg shadow-lg tracking-wide uppercase border border-purple-600 cursor-pointer hover:bg-purple-600 hover:text-white">
                    <span className="mx-auto flex items-center">
                      <Image size={24} className="mr-2" />
                      <span className="text-base leading-normal">Select a file</span>
                    </span>
                    <input 
                      type='file' 
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden" 
                      accept="image/*"
                      required={!isEditMode}
                    />
                  </label>
                  {newEvent.image && (
                    <span className="ml-3 text-sm text-gray-600">
                      {newEvent.image.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      {isEditMode ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    isEditMode ? "Update Event" : "Save Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}