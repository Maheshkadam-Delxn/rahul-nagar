"use client"
import { useState } from "react";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image,
  Clock
} from "lucide-react";

export default function EventsManagement() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Community Gathering",
      description: "Join us for our annual community celebration with food, games, and activities for all ages.",
      date: "2025-04-15",
      time: "10:00 AM - 4:00 PM",
      location: "Community Center",
      image: "/public/events/shape1.svg"
    },
    {
      id: 2,
      title: "Cultural Festival",
      description: "Experience the diverse cultures within our community through dance, music, and traditional food.",
      date: "2025-05-20",
      time: "11:00 AM - 7:00 PM",
      location: "Main Square",
      image: "/public/events/shape2.svg"
    },
    {
      id: 3,
      title: "Wellness Workshop",
      description: "Learn about holistic health approaches and participate in yoga and meditation sessions.",
      date: "2025-06-10",
      time: "9:00 AM - 12:00 PM",
      location: "Community Hall",
      image: "/public/events/shape2.png"
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    // In a real app, you would handle file upload to storage
    setNewEvent(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your API
    const eventWithId = {
      ...newEvent,
      id: events.length + 1,
      image: newEvent.image ? URL.createObjectURL(newEvent.image) : "/public/events/icon.png"
    };
    setEvents([...events, eventWithId]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: null
    });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    // In a real app, you would call your API to delete the event
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="flex items-center text-gray-500 mb-2">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center text-gray-500 mb-4">
                <Clock size={16} className="mr-2" />
                <span>{event.time}</span>
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                  <Edit size={18} />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  onClick={() => handleDelete(event.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Event</h2>
              <button 
                onClick={() => setShowModal(false)}
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
                  <input
                    id="time"
                    name="time"
                    type="text"
                    value={newEvent.time}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. 10:00 AM - 2:00 PM"
                    required
                  />
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
                  Event Image
                </label>
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
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}