"use client"
import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image as LucideImage,
  Loader,
  Building2,
  User,
  Users,
  Calendar,
  Megaphone
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BuildingsManagement() {
    const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBuildingId, setCurrentBuildingId] = useState(null);
  const [editingOwnerIndex, setEditingOwnerIndex] = useState(null);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [editingUpdateIndex, setEditingUpdateIndex] = useState(null);
  const [currentOwner, setCurrentOwner] = useState({ name: '', flatNumber: '' });
  const [currentEvent, setCurrentEvent] = useState({ title: '', date: '', description: '' });
  const [currentUpdate, setCurrentUpdate] = useState({ title: '', date: '', description: '' });

  const [userRole,setUserRole]=useState(null)
     useEffect(() => {
        const checkSessionStorage = () => {
          try {
            const sessionData = {
              token: sessionStorage.getItem('authToken'),
              userId: sessionStorage.getItem('userId'),
              userName: sessionStorage.getItem('userName'),
              userRole: sessionStorage.getItem('userRole')
            };
            setUserRole(sessionData.userRole)
          } catch (error) {
            console.error("Error checking sessionStorage:", error);
          }
        };
        
        checkSessionStorage();
      }, []);

  const [newBuilding, setNewBuilding] = useState({
    name: "",
    description: "",
    president: "",
    secretary: "",
    treasurer: "",
    image: null,
    owners: [],
    events: [],
    updates: []
  });

  // Owners Management
 

  // Fetch buildings when component mounts
  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/building/fetchAll");
      if (!response.ok) {
        throw new Error("Failed to fetch buildings");
      }
      
      const data = await response.json(); // Only call response.json() once
      console.log("Fetched Buildings:", data); // Correct way to log data
      
      if (data && Array.isArray(data)) { // Ensure data is an array
        if (user?.role === "Super-Admin" || user?.role === "Admin") {
          setBuildings(data);
        } else {
          const userBuildingNumber = user?.role ? user.role.replace(/\D/g, "") : "N/A";
console.log("Bui - ", userBuildingNumber);
// Extract numeric part from role
           
          const filteredBuildings = data.filter(building => 
            building.president === user?.name || 
            building.secretary === user?.name || 
            building.treasurer === user?.name || 
            building.name === user?.role // Compare with extracted number
          );
      
          setBuildings(filteredBuildings);
        }
      }
      
      
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setError("Failed to load buildings. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBuilding(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewBuilding(prev => ({ ...prev, image: e.target.files[0] }));
  };


  const handleOwnerImageChange = (e) => {
    setCurrentOwner(prev => ({ ...prev, image: e.target.files[0] }));
  };

  // const addOwner = () => {
  //   if (currentOwner.name && currentOwner.flatNumber) {
  //     setNewBuilding(prev => ({
  //       ...prev,
  //       owners: [...(prev.owners || []), { 
  //         name: currentOwner.name, 
  //         flatNumber: currentOwner.flatNumber, 
  //         image: currentOwner.image 
  //       }]
  //     }));
  //     // Reset owner form
  //     setCurrentOwner({
  //       name: "",
  //       flatNumber: "",
  //       image: null
  //     });
  //   }
  // };

  const removeOwner = (index) => {
    setNewBuilding(prev => ({
      ...prev,
      owners: prev.owners.filter((_, i) => i !== index)
    }));
  };

 
  const handleOwnerInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOwner(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUpdate(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const addEvent = () => {
    if (currentEvent.title && currentEvent.date) {
      // If we're in editing mode, update the existing event
      if (editingEventIndex !== null) {
        const updatedEvents = [...newBuilding.events];
        updatedEvents[editingEventIndex] = { 
          title: currentEvent.title,
          date: currentEvent.date,
          description: currentEvent.description || ""
        };
        
        setNewBuilding(prev => ({
          ...prev,
          events: updatedEvents
        }));
        
        // Reset editing state
        setEditingEventIndex(null);
      } else {
        // If not in editing mode, add a new event
        setNewBuilding(prev => ({
          ...prev,
          events: [...(prev.events || []), { 
            title: currentEvent.title,
            date: currentEvent.date,
            description: currentEvent.description || ""
          }]
        }));
      }
      
      // Reset event form
      setCurrentEvent({
        title: "",
        date: "",
        description: ""
      });
    }
  };
  
  const editEvent = (index) => {
    const eventToEdit = newBuilding.events[index];
    setCurrentEvent({ 
      title: eventToEdit.title,
      date: eventToEdit.date,
      description: eventToEdit.description || ""
    });
    setEditingEventIndex(index);
  };

  const removeEvent = (index) => {
    setNewBuilding(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };


  // const addUpdate = () => {
  //   if (currentUpdate.title) {
  //     setNewBuilding(prev => ({
  //       ...prev,
  //       updates: [...(prev.updates || []), { 
  //         title: currentUpdate.title,
  //         date: currentUpdate.date || new Date().toISOString().split('T')[0],
  //         description: currentUpdate.description
  //       }]
  //     }));
  //     // Reset update form
  //     setCurrentUpdate({
  //       title: "",
  //       date: "",
  //       description: ""
  //     });
  //   }
  // };
  console.log(user)
  const removeUpdate = (index) => {
    setNewBuilding(prev => ({
      ...prev,
      updates: prev.updates.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("authToken");
  
        if (!userId || !token) {
          alert("Authentication required. Please log in again.");
          return;
        }
  
        const response = await fetch(`/api/building/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ buildingId: id, userId }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete building");
        }
  
        setBuildings(buildings.filter(building => building._id !== id));
      } catch (error) {
        console.error("Error deleting building:", error);
        alert("Failed to delete building. Please try again.");
      }
    }
  };
  
  const handleEdit = (building) => {
    setIsEditMode(true);
    setCurrentBuildingId(building._id);
    
    // Map updates correctly (description → content)
    const mappedUpdates = building.updates?.map(update => ({
      title: update.title,
      description: update.content, // Map content back to description for the form
      date: update.date
    })) || [];
  
    setNewBuilding({
      name: building.name,
      description: building.description,
      president: building.president,
      secretary: building.secretary,
      treasurer: building.treasurer,
      image: null, // Reset image file input
      currentImageUrl: building.image, // Store current image URL separately
      owners: building.owners || [],
      events: building.events || [],
      updates: mappedUpdates // Use the mapped updates
    });
    
    setShowModal(true);
  };

  const resetForm = () => {
    setNewBuilding({
      name: "",
      description: "",
      president: "",
      secretary: "",
      treasurer: "",
      image: null,
      owners: [],
      events: [],
      updates: []
    });
    setIsEditMode(false);
    setCurrentBuildingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
  
    // Use current image URL if no new image is uploaded in edit mode
    let imageUrl = isEditMode ? newBuilding.currentImageUrl : "";
  
    // Upload new image if provided
    if (newBuilding.image) {
      const imageData = new FormData();
      imageData.append("file", newBuilding.image);
      imageData.append("upload_preset", "building-upload");
  
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
  
    // Prepare building data
    const buildingData = {
      name: newBuilding.name.trim(),
      description: newBuilding.description.trim(),
      president: newBuilding.president.trim(),
      secretary: newBuilding.secretary.trim(),
      treasurer: newBuilding.treasurer.trim(),
      image: imageUrl,
      owners: newBuilding.owners.map(owner => ({
        name: owner.name?.trim() || "",
        flatNumber: owner.flatNumber?.trim() || "",
        image: owner.image || ""
      })),
      events: newBuilding.events.map(event => ({
        title: event.title?.trim() || "",
        description: event.description?.trim() || "",
        date: event.date,
        time: event.time || "",
        location: event.location || ""
      })),
      updates: newBuilding.updates.map(update => ({
        role: userRole,
        title: update.title?.trim() || "",
        content: update.description?.trim() || "", // Map description to content
        date: update.date || new Date().toISOString(),
        link: update.link || ""
      })),
      createdBy: sessionStorage?.getItem('userId') || "defaultAdminId",
    };
  
    try {
      const url = isEditMode 
        ? "/api/building/update" 
        : "/api/building/add-building";
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          // Add authorization if needed
          // "Authorization": `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...buildingData,
          ...(isEditMode && { buildingId: currentBuildingId })
        }),
      });
  
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
  
      // Refresh buildings list
      fetchBuildings();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} building:`, error);
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'add'} building. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  const addOwner = () => {
    if (currentOwner.name && currentOwner.flatNumber) {
      // If we're in editing mode, update the existing owner
      if (editingOwnerIndex !== null) {
        const updatedOwners = [...newBuilding.owners];
        updatedOwners[editingOwnerIndex] = { 
          name: currentOwner.name, 
          flatNumber: currentOwner.flatNumber, 
          image: currentOwner.image || ""
        };
        
        setNewBuilding(prev => ({
          ...prev,
          owners: updatedOwners
        }));
        
        // Reset editing state
        setEditingOwnerIndex(null);
      } else {
        // If not in editing mode, add a new owner
        setNewBuilding(prev => ({
          ...prev,
          owners: [...(prev.owners || []), { 
            name: currentOwner.name, 
            flatNumber: currentOwner.flatNumber, 
            image: currentOwner.image || ""
          }]
        }));
      }
      
      // Reset owner form
      setCurrentOwner({
        name: "",
        flatNumber: "",
        image: null
      });
    }
  };
  
  const editOwner = (index) => {
    const ownerToEdit = newBuilding.owners[index];
    setCurrentOwner({ 
      name: ownerToEdit.name,
      flatNumber: ownerToEdit.flatNumber,
      image: ownerToEdit.image || null
    });
    setEditingOwnerIndex(index);
  };
  
  const addUpdate = () => {
    if (currentUpdate.title) {
      // If we're in editing mode, update the existing update
      if (editingUpdateIndex !== null) {
        const updatedUpdates = [...newBuilding.updates];
        updatedUpdates[editingUpdateIndex] = { 
          title: currentUpdate.title,
          date: currentUpdate.date || new Date().toISOString().split('T')[0],
          description: currentUpdate.description || ""
        };
        
        setNewBuilding(prev => ({
          ...prev,
          updates: updatedUpdates
        }));
        
        // Reset editing state
        setEditingUpdateIndex(null);
      } else {
        // If not in editing mode, add a new update
        setNewBuilding(prev => ({
          ...prev,
          updates: [...(prev.updates || []), { 
            title: currentUpdate.title,
            date: currentUpdate.date || new Date().toISOString().split('T')[0],
            description: currentUpdate.description || ""
          }]
        }));
      }
      
      // Reset update form
      setCurrentUpdate({
        title: "",
        date: "",
        description: ""
      });
    }
  };
  
  const editUpdate = (index) => {
    const updateToEdit = newBuilding.updates[index];
    setCurrentUpdate({ 
      title: updateToEdit.title,
      date: updateToEdit.date,
      description: updateToEdit.description || ""
    });
    setEditingUpdateIndex(index);
  };
  return (
    user?.role === "Super-Admin" || user?.role === "Admin" || user?.role?.startsWith("Building")? 

    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Housing Society Buildings</h1>
      {
        user?.role === "Super-Admin" || user?.role === "Admin" ?   <button 
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        <Plus size={18} />
        Add Building
      </button> : null
      }
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
      ) : buildings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Buildings Found</h3>
          <p className="text-gray-500">Click 'Add Building' to create your first building</p>
        </div>
      ) : (
        /* Buildings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map(building => (
            <div key={building._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="h-48 bg-gray-200 relative">
                {building.image ? (
                  <img 
                    src={building.image} 
                    alt={building.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{building.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{building.description}</p>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <User size={16} className="mr-2 flex-shrink-0" />
                  <span>President: {building.president}</span>
                </div>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <Users size={16} className="mr-2 flex-shrink-0" />
                  <span>Owners: {building.owners?.length || 0}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-2">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  <span>Events: {building.events?.length || 0}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-2">
                  <Megaphone size={16} className="mr-2 flex-shrink-0" />
                  <span>Updates: {building.updates?.length || 0}</span>
                </div>
                
                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={() => handleEdit(building)}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => handleDelete(building._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Building Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            {/* ... (previous modal header code) ... */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Building" : "Add New Building"}
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
              {/* ... (previous form fields) ... */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Building Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={newBuilding.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="For Example : Building No.1,2,A,B,etc"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newBuilding.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter building description"
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="president">
                    Chairman
                  </label>
                  <input
                    id="president"
                    name="president"
                    type="text"
                    value={newBuilding.president}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="President Name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secretary">
                    Secretary
                  </label>
                  <input
                    id="secretary"
                    name="secretary"
                    type="text"
                    value={newBuilding.secretary}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Secretary Name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="treasurer">
                    Treasurer
                  </label>
                  <input
                    id="treasurer"
                    name="treasurer"
                    type="text"
                    value={newBuilding.treasurer}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Treasurer Name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Building Image{isEditMode ? "" : "*"}
                </label>
                {isEditMode && newBuilding.currentImageUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <img 
                      src={newBuilding.currentImageUrl} 
                      alt="Current building image" 
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
                      <LucideImage size={24} className="mr-2" />
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
                  {newBuilding.image && (
                    <span className="ml-3 text-sm text-gray-600">
                      {newBuilding.image.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Owners Management Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Flat/Shop Owners</h3>
                
                {/* Owner Input Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownerName">
                      Owner Name
                    </label>
                    <input
                      id="ownerName"
                      name="name"
                      type="text"
                      value={currentOwner.name}
                      onChange={handleOwnerInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Owner Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="flatNumber">
                      Flat/Shop Number
                    </label>
                    <input
                      id="flatNumber"
                      name="flatNumber"
                      type="text"
                      value={currentOwner.flatNumber}
                      onChange={handleOwnerInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Flat/Shop Number"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addOwner}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      disabled={!currentOwner.name || !currentOwner.flatNumber}
                    >
                      {editingOwnerIndex !== null ? 'Update Owner' : 'Add Owner'}
                    </button>
                  </div>
                </div>

                {/* Owners List */}
                {newBuilding.owners && newBuilding.owners.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {newBuilding.owners.map((owner, index) => (
                      <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 relative">
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold">{owner.name}</h3>
                          <p className="text-gray-600 text-sm">{owner.flatNumber}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => editOwner(index)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeOwner(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Events Management Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="mr-2" /> Events
                </h3>
                
                {/* Event Input Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventTitle">
                      Event Title
                    </label>
                    <input
                      id="eventTitle"
                      name="title"
                      type="text"
                      value={currentEvent.title}
                      onChange={handleEventInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Event Title"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDate">
                      Event Date
                    </label>
                    <input
                      id="eventDate"
                      name="date"
                      type="date"
                      value={currentEvent.date}
                      onChange={handleEventInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addEvent}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      disabled={!currentEvent.title || !currentEvent.date}
                    >
                      {editingEventIndex !== null ? 'Update Event' : 'Add Event'}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDescription">
                    Event Description
                  </label>
                  <textarea
                    id="eventDescription"
                    name="description"
                    value={currentEvent.description}
                    onChange={handleEventInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Event Description"
                    rows="3"
                  />
                </div>

                {/* Events List */}
                {newBuilding.events && newBuilding.events.length > 0 && (
                  <div className="space-y-4">
                    {newBuilding.events.map((event, index) => (
                      <div key={index} className="bg-white shadow-md rounded-lg p-4 relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold">{event.title}</h3>
                            <p className="text-gray-600 text-sm">{event.date}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editEvent(index)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeEvent(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        {event.description && (
                          <p className="mt-2 text-gray-700">{event.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Updates Management Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Megaphone className="mr-2" /> Updates
                </h3>
                
                {/* Update Input Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="updateTitle">
                      Update Title
                    </label>
                    <input
                      id="updateTitle"
                      name="title"
                      type="text"
                      value={currentUpdate.title}
                      onChange={handleUpdateInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Update Title"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="updateDate">
                      Update Date
                    </label>
                    <input
                      id="updateDate"
                      name="date"
                      type="date"
                      value={currentUpdate.date}
                      onChange={handleUpdateInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="updateDescription">
                    Update Description
                  </label>
                  <textarea
                    id="updateDescription"
                    name="description"
                    value={currentUpdate.description}
                    onChange={handleUpdateInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Update Description"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={addUpdate}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={!currentUpdate.title}
                  >
                    {editingUpdateIndex !== null ? 'Update Update' : 'Add Update'}
                  </button>
                </div>

                {/* Updates List */}
                {newBuilding.updates && newBuilding.updates.length > 0 && (
                  <div className="space-y-4">
                    {newBuilding.updates.map((update, index) => (
                      <div key={index} className="bg-white shadow-md rounded-lg p-4 relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold">{update.title}</h3>
                            {update.date && (
                              <p className="text-gray-600 text-sm">{update.date}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editUpdate(index)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeUpdate(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        {update.description && (
                          <p className="mt-2 text-gray-700">{update.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ... (rest of the form remains the same) ... */}
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
                    isEditMode ? "Update Building" : "Save Building"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    
    </div>
    : <p>not allowed</p>
  );
}