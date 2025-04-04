"use client"
import { useState, useEffect } from "react";
import { 
  Grid, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image as ImageIcon,
  Loader,
  Download,
  Maximize
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';

export default function GalleryManagement() {
  const user = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    imageFile: null,
    category: "general"
  });

  // Fetch images when component mounts
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/gallery/fetchAll");
      if (!response.ok) {
        throw new Error("Failed to fetch gallery images");
      }
      const data = await response.json();
      if (data.success && data.images) {
        setGallery(data.images);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setError("Failed to load gallery images. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewImage(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(prev => ({ 
        ...prev, 
        imageFile: e.target.files[0]
      }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("authToken");

        if (!userId) {
          alert("User not found. Please log in again.");
          return;
        }

        if (!token) {
          alert("Authentication token missing. Please log in again.");
          return;
        }

        const response = await fetch("/api/gallery/delete-image", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ imageId: id, userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete image");
        }

        setGallery(gallery.filter(image => image._id !== id));
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  };

  const handleEdit = (image) => {
    setIsEditMode(true);
    setCurrentImageId(image._id);
    
    setNewImage({
      title: image.title,
      description: image.description,
      category: image.category || "general",
      imageUrl: image.imageUrl,
      imageFile: null
    });
    
    setShowModal(true);
  };

  const resetForm = () => {
    setNewImage({
      title: "",
      description: "",
      imageFile: null,
      category: "general"
    });
    setIsEditMode(false);
    setCurrentImageId(null);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    
    let imageUrl = newImage.imageUrl || "";
    
    // If there's a new image file, upload it
    if (newImage.imageFile) {
      const imageData = new FormData();
      imageData.append("file", newImage.imageFile);
      imageData.append("upload_preset", "event-upload");

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
      imageId: currentImageId,
      title: newImage.title.trim(),
      description: newImage.description.trim(),
      category: newImage.category,
      imageUrl: imageUrl,
    };
    
    try {
      const response = await fetch("/api/gallery/update-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update image");
      }
      
      const result = await response.json();
      
      // Update gallery list with the updated image
      setGallery(gallery.map(image => 
        image._id === currentImageId ? result.image : image
      ));
      
      // Reset form and close modal
      resetForm();
      setShowModal(false);
      
    } catch (error) {
      console.error("Error updating image:", error);
      setError(`Failed to update image: ${error.message}`);
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
  
    if (!newImage.imageFile) {
      setError("Please select an image to upload");
      setLoading(false);
      return;
    }

    let imageUrl = "";
  
    const formData = new FormData();
    formData.append("file", newImage.imageFile);
    formData.append("upload_preset", "event-upload");

    try {
      const imageResponse = await fetch("https://api.cloudinary.com/v1_1/rahul-nagar/image/upload", {
        method: "POST",
        body: formData,
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
  
    const galleryData = {
      title: newImage.title.trim(),
      description: newImage.description.trim(),
      category: newImage.category,
      imageUrl: imageUrl,
      uploadedBy: sessionStorage?.getItem('userId') || "defaultAdminId",
      uploadDate: new Date().toISOString()
    };
  
    try {
      const response = await fetch("/api/gallery/add-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add image: ${response.statusText}`);
      }

      fetchGalleryImages();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding image:", error);
      setError("Failed to add image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    user?.user?.role === "Super-Admin" || user?.user?.role === "Admin" || user?.user?.role === "Associate-Member" ? 
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Housing Society Gallery</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {fetchLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size={40} className="animate-spin text-purple-600" />
        </div>
      ) : gallery.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Images Found</h3>
          <p className="text-gray-500">Click 'Add Image' to upload your first image</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map(image => (
            <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div 
                className="h-48 bg-gray-200 relative cursor-pointer"
                onClick={() => openImageModal(image)}
              >
                <img 
                  src={image.imageUrl} 
                  alt={image.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <Maximize size={24} className="text-white opacity-0 hover:opacity-100" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{image.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{image.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {image.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {image.uploadDate ? formatDate(image.uploadDate) : 'Unknown date'}
                  </span>
                </div>
                
                <div className="flex justify-end gap-2 mt-3">
                  <button 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={() => handleEdit(image)}
                  >
                    <Edit size={16} />
                  </button>
                  <a 
                    href={image.imageUrl} 
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  >
                    <Download size={16} />
                  </a>
                  <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => handleDelete(image._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Image" : "Add New Image"}
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
                  Image Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newImage.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter image title"
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
                  value={newImage.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter image description"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={newImage.category}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="general">General</option>
                  <option value="events">Events</option>
                  <option value="facilities">Facilities</option>
                  <option value="celebrations">Celebrations</option>
                  <option value="meetings">Meetings</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
                  Image*
                </label>
                
                {isEditMode && newImage.imageUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <img 
                      src={newImage.imageUrl} 
                      alt="Current gallery image" 
                      className="h-32 object-cover rounded mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new image to replace the current one.
                    </p>
                  </div>
                )}
                
                <div className="mt-2 flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-purple-600 rounded-lg shadow-lg tracking-wide uppercase border border-purple-600 cursor-pointer hover:bg-purple-600 hover:text-white">
                    <span className="mx-auto flex items-center">
                      <ImageIcon size={24} className="mr-2" />
                      <span className="text-base leading-normal">{isEditMode ? "Replace image" : "Select image"}</span>
                    </span>
                    <input 
                      type='file' 
                      id="imageFile"
                      name="imageFile"
                      onChange={handleImageFileChange}
                      className="hidden" 
                      accept="image/*"
                      required={!isEditMode}
                    />
                  </label>
                  
                  {newImage.imageFile && (
                    <span className="ml-3 text-sm text-gray-600">
                      {newImage.imageFile.name}
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
                      {isEditMode ? "Updating..." : "Uploading..."}
                    </>
                  ) : (
                    isEditMode ? "Update Image" : "Upload Image"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-4 z-10">
        <button
          onClick={() => setShowImageModal(false)}
          className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 text-gray-800"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Image Section - Always on top */}
      <div className="w-full bg-black flex items-center justify-center" style={{ height: "60vh" }}>
        <img
          src={selectedImage.imageUrl}
          alt={selectedImage.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      
      {/* Info Section - Always below */}
      <div className="w-full p-6 overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedImage.title}</h3>
        <p className="text-gray-600 mb-4">{selectedImage.description}</p>
        
        <div className="mb-4">
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {selectedImage.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Uploaded on {selectedImage.uploadDate ? formatDate(selectedImage.uploadDate) : 'Unknown date'}
        </p>
        
        <div className="flex gap-2">
          <a
            href={selectedImage.imageUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center"
          >
            <Download size={16} className="mr-2" />
            Download
          </a>
          <button
            onClick={() => {
              setShowImageModal(false);
              handleEdit(selectedImage);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div> : <p>You are not authorized to access this page</p>
  );
}