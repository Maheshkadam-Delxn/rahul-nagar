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
  Megaphone,
  AlertCircle,
  FileText,
  Download,
  FilePlus,
  File
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function BuildingsManagement() {
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [currentBuildingDocuments, setCurrentBuildingDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
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
  const [editingDocumentIndex, setEditingDocumentIndex] = useState(null);
  const [currentOwner, setCurrentOwner] = useState({ name: '', flatNumber: '' });
  const [currentEvent, setCurrentEvent] = useState({ title: '', date: '', description: '' });
  const [currentUpdate, setCurrentUpdate] = useState({ title: '', date: '', description: '' });
  const [currentDocument, setCurrentDocument] = useState([{ title: '', file: null }]);
  const [documentUploading, setDocumentUploading] = useState(false);
  const [presidentImage, setPresidentImage] = useState(null);
  const [secretaryImage, setSecretaryImage] = useState(null);
  const [treasurerImage, setTreasurerImage] = useState(null);
  // Form validation states
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

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

  const handleShowDocuments = async (building) => {
    setDocumentsLoading(true);
    setShowDocumentsPopup(true);
    
    try {
      // First check if we already have documents in the building data
      if (building.documents && building.documents.length > 0) {
        setCurrentBuildingDocuments(building.documents);
      } else {
        // If not, fetch from API using the folder ID
        const folderId = buildingFolderMap[building.name];
        if (!folderId) {
          throw new Error("No folder configured for this building");
        }
        
        const response = await fetch(`/api/files/${folderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        
        const documents = await response.json();
        setCurrentBuildingDocuments(documents.files);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents. Please try again.");
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Building folder mappings
  const buildingFolderMap = {
    "Building No.1": "1pk3BXv-NzVgPhSrAlwHerHwSbD-nnexQ",
    "Building No.2": "1YA7636FvwlbUdEfBLmuow-flRVQwNWnv",
    "Building No.3": "1oFDa8Bgp1Zy0_M1hCKG73QY2bnAkW_HM",
    "Building No.4": "127rVb-_zrLkP1a66C46xYjnhd4eh9Gh7",
    "Building No.5": "1bpC4CoJUQlFhFc0l4NPjdxNrB-cMf-Dj",
    "Building No.6A": "17LdunpVZbawYsc6Zpxcacjyefw0DeizU",
    "Building No.6B": "1lPt8QVrUdgYOQSEGF5G0qk5WrYdvg2Wi",
    "Building No.7": "1_BceKyQKAWqUhqgiLQna_ow14J2Ctoy0",
    "Building No.A": "1uiwD9JQ4zuPLQEX7GtzRtJq9uup6Giun",
    "Building No.B": "17_rZYJjQteH1gmcdqwu3CUWGRMLCwxEI",
    "Building No.C": "1cAxtYD35TQsyYsnxpPrJooMFV8SnvY_Q"
  };

  const [newBuilding, setNewBuilding] = useState({
    name: "",
    description: "",
    president: "",
    secretary: "",
    treasurer: "",
    image: null,
    presidentImage: null,
    secretaryImage: null,
    treasurerImage: null,
    owners: [],
    events: [],
    updates: [],
    documents: []
  });

  // Helper function to upload images to Cloudinary
  const uploadImage = async (imageFile) => {
    const imageData = new FormData();
    imageData.append("file", imageFile);
    imageData.append("upload_preset", "building-upload");

    const imageResponse = await fetch("https://api.cloudinary.com/v1_1/rahul-nagar/image/upload", {
      method: "POST",
      body: imageData,
    });

    const imageResult = await imageResponse.json();

    if (!imageResponse.ok) {
      throw new Error(`Image upload failed: ${imageResult.error?.message || "Unknown error"}`);
    }

    return imageResult.secure_url;
  };

  // Form validation function
  const validateField = (name, value) => {
    let error = "";
    
    switch(name) {
      case "name":
        if (!value.trim()) {
          error = "Building name is required";
        }
        break;
      case "image":
        if (!isEditMode && !value) {
          error = "Building image is required";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

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
      
      const data = await response.json();
      console.log("Fetched Buildings:", data);
      
      if (data && Array.isArray(data)) {
        if (user?.role === "Super-Admin" || user?.role === "Admin") {
          setBuildings(data);
        } else {
          const userBuildingNumber = user?.role ? user.role.replace(/\D/g, "") : "N/A";
          console.log("Bui - ", userBuildingNumber);
          
          const filteredBuildings = data.filter(building => 
            building.president === user?.name || 
            building.secretary === user?.name || 
            building.treasurer === user?.name || 
            building.name === user?.role
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
    
    // Update the field value
    setNewBuilding(prev => ({ ...prev, [name]: value }));
    
    // Mark the field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Validate the field and update errors
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Update the field value
    setNewBuilding(prev => ({ ...prev, image: file }));
    
    // Mark the field as touched
    setTouchedFields(prev => ({ ...prev, image: true }));
    
    // Validate the field and update errors
    const error = validateField("image", file);
    setFormErrors(prev => ({ ...prev, image: error }));
  };

  const handlePresidentImageChange = (e) => {
    setPresidentImage(e.target.files[0]);
  };

  const handleSecretaryImageChange = (e) => {
    setSecretaryImage(e.target.files[0]);
  };

  const handleTreasurerImageChange = (e) => {
    setTreasurerImage(e.target.files[0]);
  };

  const handleOwnerImageChange = (e) => {
    setCurrentOwner(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleDocumentInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentDocument(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const getFolderIdForBuilding = (buildingName) => {
    return buildingFolderMap[buildingName] || null;
  };

  const uploadDocument = async () => {
    if (!currentDocument.title || !currentDocument.file) {
      alert("Please provide both a title and a file");
      return;
    }

    setDocumentUploading(true);
    try {
      const folderId = getFolderIdForBuilding(newBuilding.name);
      
      if (!folderId) {
        throw new Error("No folder configured for this building");
      }

      const formData = new FormData();
      formData.append("file", currentDocument.file);
      formData.append("folderId", folderId);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      const result = await response.json();

      // If editing an existing document
      if (editingDocumentIndex !== null) {
        const updatedDocuments = [...newBuilding.documents];
        updatedDocuments[editingDocumentIndex] = {
          title: currentDocument.title,
          fileId: result.fileId || result.id,
          fileName: currentDocument.file.name,
          uploadDate: new Date().toISOString(),
          fileUrl: result.fileUrl || ""
        };
        
        setNewBuilding(prev => ({
          ...prev,
          documents: updatedDocuments
        }));
        
        setEditingDocumentIndex(null);
      } else {
        // Adding a new document
        setNewBuilding(prev => ({
          ...prev,
          documents: [...(prev.documents || []), {
            title: currentDocument.title,
            fileId: result.fileId || result.id,
            fileName: currentDocument.file.name,
            uploadDate: new Date().toISOString(),
            fileUrl: result.fileUrl || ""
          }]
        }));
      }

      // Reset document form
      setCurrentDocument({
        title: "",
        file: null
      });

    } catch (error) {
      console.error("Error uploading document:", error);
      alert(error.message || "Failed to upload document");
    } finally {
      setDocumentUploading(false);
    }
  };

  const editDocument = (index) => {
    const documentToEdit = newBuilding.documents[index];
    setCurrentDocument({
      title: documentToEdit.title,
      file: null
    });
    setEditingDocumentIndex(index);
  };

  const removeDocument = (index) => {
    setNewBuilding(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

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
  const formatDateTime = (dateString) => {
    if (!dateString) return "No date available";

    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });

    const ordinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${day}${ordinalSuffix(day)} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm} `;
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

  const removeUpdate = (index) => {
    setNewBuilding(prev => ({
      ...prev,
      updates: prev.updates.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        const userId = user?.user?.id;
       
  
        if (!userId) {
          alert("Authentication required. Please log in again.");
          return;
        }
  
        const response = await fetch(`/api/building/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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
      description: update.content,
      date: update.date
    })) || [];
  
    setNewBuilding({
      name: building.name,
      description: building.description,
      president: building.president,
      secretary: building.secretary,
      treasurer: building.treasurer,
      image: null,
      currentImageUrl: building.image,
      presidentImageUrl: building.presidentImage,
      secretaryImageUrl: building.secretaryImage,
      treasurerImageUrl: building.treasurerImage,
      owners: building.owners || [],
      events: building.events || [],
      updates: mappedUpdates,
      documents: building.documents || []
    });
    
    // Reset form errors when editing
    setFormErrors({});
    setTouchedFields({});
    
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
      presidentImage: null,
      secretaryImage: null,
      treasurerImage: null,
      owners: [],
      events: [],
      updates: [],
      documents: []
    });
    
    // Reset validation states
    setFormErrors({});
    setTouchedFields({});
    
    setIsEditMode(false);
    setCurrentBuildingId(null);
    setPresidentImage(null);
    setSecretaryImage(null);
    setTreasurerImage(null);
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!newBuilding.name.trim()) {
      errors.name = "Building name is required";
    }
    
    if (!isEditMode && !newBuilding.image && !newBuilding.currentImageUrl) {
      errors.image = "Building image is required";
    }
    
    setFormErrors(errors);
    
    // Mark all fields as touched
    const touched = {};
    Object.keys(newBuilding).forEach(key => {
      touched[key] = true;
    });
    setTouchedFields(touched);
    
    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
  
    // Use current image URLs if no new images are uploaded in edit mode
    let imageUrl = isEditMode ? newBuilding.currentImageUrl : "";
    let presidentImageUrl = isEditMode ? newBuilding.presidentImageUrl : "";
    let secretaryImageUrl = isEditMode ? newBuilding.secretaryImageUrl : "";
    let treasurerImageUrl = isEditMode ? newBuilding.treasurerImageUrl : "";
  
    // Upload new building image if provided
    if (newBuilding.image) {
      try {
        imageUrl = await uploadImage(newBuilding.image);
      } catch (error) {
        console.error("Error uploading building image:", error);
        setError("Failed to upload building image. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Upload president image if provided
    if (presidentImage) {
      try {
        presidentImageUrl = await uploadImage(presidentImage);
      } catch (error) {
        console.error("Error uploading president image:", error);
        setError("Failed to upload president image. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Upload secretary image if provided
    if (secretaryImage) {
      try {
        secretaryImageUrl = await uploadImage(secretaryImage);
      } catch (error) {
        console.error("Error uploading secretary image:", error);
        setError("Failed to upload secretary image. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Upload treasurer image if provided
    if (treasurerImage) {
      try {
        treasurerImageUrl = await uploadImage(treasurerImage);
      } catch (error) {
        console.error("Error uploading treasurer image:", error);
        setError("Failed to upload treasurer image. Please try again.");
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
      presidentImage: presidentImageUrl,
      secretaryImage: secretaryImageUrl,
      treasurerImage: treasurerImageUrl,
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
        content: update.description?.trim() || "",
        date: update.date || new Date().toISOString(),
        link: update.link || ""
      })),
      documents: newBuilding.documents.map(doc => ({
        title: doc.title?.trim() || "",
        fileId: doc.fileId || "",
        fileName: doc.fileName || "",
        uploadDate: doc.uploadDate || new Date().toISOString(),
        fileUrl: doc.fileUrl || ""
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
  
  // Helper function to show field error
  const getFieldError = (fieldName) => {
    return touchedFields[fieldName] && formErrors[fieldName] ? (
      <p className="text-red-500 text-xs italic mt-1">
        <AlertCircle size={12} className="inline mr-1" />
        {formErrors[fieldName]}
      </p>
    ) : null;
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

                <div className="flex justify-between mt-4">
                  <button 
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    onClick={(e) => handleShowDocuments(building, e)}
                  >
                    <FileText size={16} className="mr-1" />
                    View Documents
                  </button>
                  <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Building Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
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
            className={`shadow appearance-none border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} 
              rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            placeholder="For Example : Building No.1,2,A,B,etc"
            required
          />
          {getFieldError('name')}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={newBuilding.description}
            onChange={handleInputChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            placeholder="Building description"
          />
        </div>

        {/* President Section */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="president">
            President (Optional)
          </label>
          <input
            id="president"
            name="president"
            type="text"
            value={newBuilding.president}
            onChange={handleInputChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Building president"
          />
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="presidentImage">
              President Image (Optional)
            </label>
            <div className="flex items-center">
              <input
                id="presidentImage"
                name="presidentImage"
                type="file"
                accept="image/*"
                onChange={handlePresidentImageChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {isEditMode && newBuilding.presidentImageUrl && (
                <img 
                  src={newBuilding.presidentImageUrl} 
                  alt="Current President" 
                  className="h-10 w-10 object-cover ml-2 rounded"
                />
              )}
            </div>
          </div>
        </div>

        {/* Secretary Section */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secretary">
            Secretary (Optional)
          </label>
          <input
            id="secretary"
            name="secretary"
            type="text"
            value={newBuilding.secretary}
            onChange={handleInputChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Building secretary"
          />
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secretaryImage">
              Secretary Image (Optional)
            </label>
            <div className="flex items-center">
              <input
                id="secretaryImage"
                name="secretaryImage"
                type="file"
                accept="image/*"
                onChange={handleSecretaryImageChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {isEditMode && newBuilding.secretaryImageUrl && (
                <img 
                  src={newBuilding.secretaryImageUrl} 
                  alt="Current Secretary" 
                  className="h-10 w-10 object-cover ml-2 rounded"
                />
              )}
            </div>
          </div>
        </div>

        {/* Treasurer Section */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="treasurer">
            Treasurer (Optional)
          </label>
          <input
            id="treasurer"
            name="treasurer"
            type="text"
            value={newBuilding.treasurer}
            onChange={handleInputChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Building treasurer"
          />
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="treasurerImage">
              Treasurer Image (Optional)
            </label>
            <div className="flex items-center">
              <input
                id="treasurerImage"
                name="treasurerImage"
                type="file"
                accept="image/*"
                onChange={handleTreasurerImageChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {isEditMode && newBuilding.treasurerImageUrl && (
                <img 
                  src={newBuilding.treasurerImageUrl} 
                  alt="Current Treasurer" 
                  className="h-10 w-10 object-cover ml-2 rounded"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Building Image {isEditMode ? "(Optional)" : "*"}
          </label>
          <div className="flex items-center">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`shadow appearance-none border ${formErrors.image ? 'border-red-500' : 'border-gray-300'} 
                rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {isEditMode && newBuilding.currentImageUrl && (
              <img 
                src={newBuilding.currentImageUrl} 
                alt="Current" 
                className="h-10 w-10 object-cover ml-2 rounded"
              />
            )}
          </div>
          {getFieldError('image')}
        </div>

        {/* Owners Section */}
        <div className="mb-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <User size={18} className="mr-2" />
            Owners
          </h3>
          
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Owner's name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="flatNumber">
                  Flat/Unit Number
                </label>
                <input
                  id="flatNumber"
                  name="flatNumber"
                  type="text"
                  value={currentOwner.flatNumber}
                  onChange={handleOwnerInputChange}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Flat number"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownerImage">
                Owner Image (Optional)
              </label>
              <input
                id="ownerImage"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleOwnerImageChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={addOwner}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center"
              >
                {editingOwnerIndex !== null ? (
                  <>
                    <Edit size={16} className="mr-1" />
                    Update Owner
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-1" />
                    Add Owner
                  </>
                )}
              </button>
            </div>
          </div>
          
          {newBuilding.owners && newBuilding.owners.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Added Owners</h4>
              <div className="space-y-2">
                {newBuilding.owners.map((owner, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      {owner.image ? (
                        <img src={owner.image} alt={owner.name} className="h-8 w-8 rounded-full mr-2 object-cover" />
                      ) : (
                        <User size={18} className="mr-2 text-gray-400" />
                      )}
                      <span className="font-medium">{owner.name}</span>
                      <span className="ml-2 text-gray-500 text-sm">({owner.flatNumber})</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        type="button"
                        onClick={() => editOwner(index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeOwner(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="mb-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Calendar size={18} className="mr-2" />
            Events
          </h3>
          
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDate">
                  Event Date & Time
                </label>
                <input
                  id="eventDate"
                  name="date"
                  type="datetime-local"
                  value={currentEvent.date}
                  onChange={handleEventInputChange}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDescription">
                Event Description (Optional)
              </label>
              <textarea
                id="eventDescription"
                name="description"
                value={currentEvent.description}
                onChange={handleEventInputChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                placeholder="Event description"
              />
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={addEvent}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center"
              >
                {editingEventIndex !== null ? (
                  <>
                    <Edit size={16} className="mr-1" />
                    Update Event
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-1" />
                    Add Event
                  </>
                )}
              </button>
            </div>
          </div>
          
          {newBuilding.events && newBuilding.events.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Added Events</h4>
              <div className="space-y-2">
                {newBuilding.events.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-gray-500 text-sm">{formatDateTime(event.date)}</div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        type="button"
                        onClick={() => editEvent(index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeEvent(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Updates Section */}
        {/* <div className="mb-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Megaphone size={18} className="mr-2" />
            Updates
          </h3>
          
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="updateTitle">
                  Update Title
                </label>
                <input
                  id="updateTitle"
                  name="title"
                  type="text"
                  value={currentUpdate.title}
                  onChange={handleUpdateInputChange}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Update title"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="updateDate">
                  Date & Time
                </label>
                <input
                  id="updateDate"
                  name="date"
                  type="datetime-local"
                  value={currentUpdate.date}
                  onChange={handleUpdateInputChange}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="updateDescription">
                Update Content
              </label>
              <textarea
                id="updateDescription"
                name="description"
                value={currentUpdate.description}
                onChange={handleUpdateInputChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                placeholder="Update content"
              />
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={addUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center"
              >
                {editingUpdateIndex !== null ? (
                  <>
                    <Edit size={16} className="mr-1" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-1" />
                    Add Update
                  </>
                )}
              </button>
            </div>
          </div>
          
          {newBuilding.updates && newBuilding.updates.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Added Updates</h4>
              <div className="space-y-2">
                {newBuilding.updates.map((update, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{update.title}</div>
                      <div className="text-gray-500 text-sm">
                        {update.date ? new Date(update.date).toLocaleString() : 'No date'}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        type="button"
                        onClick={() => editUpdate(index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeUpdate(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}

        {/* Documents Section */}
        <div className="mb-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText size={18} className="mr-2" />
            Documents
          </h3>
          
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentTitle">
                Document Title
              </label>
              <input
                id="documentTitle"
                name="title"
                type="text"
                value={currentDocument.title}
                onChange={handleDocumentInputChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Document title"
              />
            </div>
            
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentFile">
                Document File
              </label>
              <input
                id="documentFile"
                name="file"
                type="file"
                onChange={handleDocumentFileChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={uploadDocument}
                disabled={documentUploading}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center"
              >
                {documentUploading ? (
                  <>
                    <Loader size={16} className="mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : editingDocumentIndex !== null ? (
                  <>
                    <Edit size={16} className="mr-1" />
                    Update Document
                  </>
                ) : (
                  <>
                    <FilePlus size={16} className="mr-1" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
          
          {newBuilding.documents && newBuilding.documents.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Added Documents</h4>
              <div className="space-y-2">
                {newBuilding.documents.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <File size={16} className="mr-2 text-gray-400" />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-gray-500 text-xs">{doc.fileName}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              isEditMode ? "Save Changes" : "Add Building"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {showDocumentsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Building Documents
              </h2>
              <button 
                onClick={() => {
                  setShowDocumentsPopup(false);
                  setCurrentBuildingDocuments([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            {documentsLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader size={40} className="animate-spin text-purple-600" />
              </div>
            ) : currentBuildingDocuments?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Documents Found</h3>
                <p className="text-gray-500">This building doesn't have any documents yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentBuildingDocuments?.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <File size={18} className="mr-3 text-gray-400" />
                      <div>
                        <Link href={doc.viewLink} className="font-medium underline text-blue-500" >{doc.title || doc.name}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    :
    <div className="flex flex-col items-center justify-center h-screen">
      <Building2 size={48} className="text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-700 mb-2">Access Denied</h3>
      <p className="text-gray-500">You do not have permission to view this page.</p>
    </div>
  );
}