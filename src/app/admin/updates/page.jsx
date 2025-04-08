"use client"
import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, X, Calendar, Clock, PenTool, Users, Eye, Filter, Search, Tag, Upload, Image as ImageIcon, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const UpdatesManagement = () => {
  const { user, loading: authLoading } = useAuth();
  console.log("UpdatesManagement: Auth context received:", { user, authLoading });
  
  // Log session storage directly
  useEffect(() => {
    const checkSessionStorage = () => {
      try {
        const sessionData = {
          token: sessionStorage.getItem('authToken'),
          userId: sessionStorage.getItem('userId'),
          userName: sessionStorage.getItem('userName'),
          userRole: sessionStorage.getItem('userRole')
        };
        console.log("UpdatesManagement: Direct sessionStorage check:", sessionData);
      } catch (error) {
        console.error("Error checking sessionStorage:", error);
      }
    };
    
    checkSessionStorage();
  }, []);
  
  const [updates, setUpdates] = useState([]);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isEditUpdateOpen, setIsEditUpdateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteImageConfirmOpen, setIsDeleteImageConfirmOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [updateToDelete, setUpdateToDelete] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [error, setError] = useState(null);
  
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    priority: 'Medium',
    status: 'Draft',
    visibility: 'All Users',
    expiresAt: '',
    images: [],
    imagesToDelete: []
  });
  
  const categories = ['Announcement', 'Maintenance', 'Feature', 'Update', 'Security', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Draft', 'Scheduled', 'Published', 'Expired', 'Archived'];
  const visibilityOptions = ['All Users', 'Admins Only', 'Managers Only', 'Staff Only'];
  
  // Fetch all updates on component mount
  useEffect(() => {
    fetchUpdates();
  }, []);
  
  // Fetch updates from API
  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/updates/fetchAll');
      if (!response.ok) {
        throw new Error('Failed to fetch updates');
      }
      const data = await response.json();
      setUpdates(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError('Failed to load updates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter and search updates
  const filteredUpdates = updates.filter(update => {
    const matchesSearch = searchTerm === '' || 
                         update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || update.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || update.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || update.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });
  
  // Handle file input change for image upload
  const handleImageChange = (e, isNewUpdate = true) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Preview images before upload
    const newImages = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      alt: file.name
    }));
    
    if (isNewUpdate) {
      setNewUpdate({
        ...newUpdate,
        images: [...newUpdate.images, ...newImages]
      });
    } else {
      setSelectedUpdate({
        ...selectedUpdate,
        newImages: [...(selectedUpdate.newImages || []), ...newImages]
      });
    }
  };
  
  // Remove image from preview
  // const removeImage = (index, isNewUpdate = true) => {
  //   if (isNewUpdate) {
  //     const updatedImages = [...newUpdate.images];
  //     // Revoke object URL to prevent memory leaks
  //     if (updatedImages[index].preview) {
  //       URL.revokeObjectURL(updatedImages[index].preview);
  //     }
  //     updatedImages.splice(index, 1);
  //     setNewUpdate({
  //       ...newUpdate,
  //       images: updatedImages
  //     });
  //   } else {
  //     if (selectedUpdate.newImages) {
  //       // For new images that haven't been uploaded yet
  //       const updatedNewImages = [...selectedUpdate.newImages];
  //       if (index < updatedNewImages.length) {
  //         if (updatedNewImages[index].preview) {
  //           URL.revokeObjectURL(updatedNewImages[index].preview);
  //         }
  //         updatedNewImages.splice(index, 1);
  //         setSelectedUpdate({
  //           ...selectedUpdate,
  //           newImages: updatedNewImages
  //         });
  //       }
  //     } else if (selectedUpdate.images) {
  //       // For existing images
  //       const updatedImages = [...selectedUpdate.images];
  //       const imageToDelete = updatedImages[index];
  //       updatedImages.splice(index, 1);
  //       setSelectedUpdate({
  //         ...selectedUpdate,
  //         images: updatedImages,
  //         imagesToDelete: [...(selectedUpdate.imagesToDelete || []), imageToDelete]
  //       });
  //     }
  //   }
  // };

  // Show delete confirmation for an uploaded image
  const showDeleteImageConfirmation = (image, index, updateId) => {
    setImageToDelete({
      image,
      index,
      updateId
    });
    setIsDeleteImageConfirmOpen(true);
  };

  // Handle delete image directly from an update
 const handleDeleteUploadedImage = async () => {
  if (!imageToDelete) return;
  
  try {
    const { image, updateId, index } = imageToDelete;
    
    // Update local state to reflect the deleted image
    const updatedUpdates = updates.map(update => {
      if (update._id === updateId) {
        return {
          ...update,
          images: null // Set images to null instead of filtering
        };
      }
      return update;
    });
    
    setUpdates(updatedUpdates);
    setIsDeleteImageConfirmOpen(false);
    setImageToDelete(null);
    
    // If we're in edit mode for this update, update the selected update too
    if (isEditUpdateOpen && selectedUpdate && selectedUpdate._id === updateId) {
      setSelectedUpdate({
        ...selectedUpdate,
        images: null // Set images to null
      });
    }
    
  } catch (err) {
    console.error('Error handling image deletion:', err);
    setError('Failed to process image deletion. Please try again.');
  }
};

// const handleUpdateSubmit = async () => {
//   if (!selectedUpdate._id) {
//     console.error("Error: Update ID is missing.");
//     alert("Update ID is missing.");
//     return;
//   }

//   try {
//     setLoading(true);
//     console.log("Updating ID:", selectedUpdate._id);
    
//     // Upload new images
//     let uploadedImages = [];
//     if (selectedUpdate.newImages && selectedUpdate.newImages.length > 0) {
//       try {
//         uploadedImages = await uploadImages(selectedUpdate.newImages);
//       } catch (error) {
//         setError("Failed to upload images. Please try again.");
//         setLoading(false);
//         return;
//       }
//     }
    
//     // Use existing images only if they're not null
//     const existingImages = selectedUpdate.images || [];
    
//     // Combine existing images (if not null) with newly uploaded ones
//     const combinedImages = selectedUpdate.images === null ? 
//                           uploadedImages : 
//                           [...existingImages, ...uploadedImages];
    
//     const response = await fetch('/api/updates/edit-update', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         id: selectedUpdate._id, 
//         ...selectedUpdate,
//         images: selectedUpdate.images === null ? null : combinedImages
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update');
//     }

//     // Refresh the updates list after editing
//     fetchUpdates();
//     setIsEditUpdateOpen(false);
//   } catch (err) {
//     console.error('Error updating update:', err);
//     setError('Failed to update. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };

// Update the removeImage function to set images to null when removing an image
const removeImage = (index, isNewUpdate = true) => {
  if (isNewUpdate) {
    const updatedImages = [...newUpdate.images];
    // Revoke object URL to prevent memory leaks
    if (updatedImages[index].preview) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }
    updatedImages.splice(index, 1);
    setNewUpdate({
      ...newUpdate,
      images: updatedImages.length > 0 ? updatedImages : null
    });
  } else {
    if (selectedUpdate.newImages && selectedUpdate.newImages.length > 0) {
      // For new images that haven't been uploaded yet
      const updatedNewImages = [...selectedUpdate.newImages];
      if (index < updatedNewImages.length) {
        if (updatedNewImages[index].preview) {
          URL.revokeObjectURL(updatedNewImages[index].preview);
        }
        updatedNewImages.splice(index, 1);
        setSelectedUpdate({
          ...selectedUpdate,
          newImages: updatedNewImages.length > 0 ? updatedNewImages : null
        });
      }
    } else if (selectedUpdate.images) {
      // For existing images - set to null when removing
      setSelectedUpdate({
        ...selectedUpdate,
        images: null
      });
    }
  }
};
  
  // Helper function to extract Cloudinary public ID from URL
  const extractPublicIdFromUrl = (url) => {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split('.')[0]; // Remove extension
      return publicId;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  };
  
  // Upload images to Cloudinary
  const uploadImages = async (images) => {
    if (!images || images.length === 0) return [];
    
    setUploadingImages(true);
    const uploadedImages = [];
    
    try {
      for (const image of images) {
        if (!image.file) continue; // Skip if no file exists (already uploaded)
        
        const imageData = new FormData();
        imageData.append("file", image.file);
        imageData.append("upload_preset", "event-upload"); // Use your preset
        
        const imageResponse = await fetch(
          "https://api.cloudinary.com/v1_1/rahul-nagar/image/upload", // Use your cloud name
          {
            method: "POST",
            body: imageData,
          }
        );
        
        const imageResult = await imageResponse.json();
        
        if (!imageResponse.ok) {
          throw new Error(
            `Image upload failed: ${imageResult.error?.message || "Unknown error"}`
          );
        }
        
        uploadedImages.push({
          url: imageResult.secure_url,
          publicId: imageResult.public_id,
          alt: image.alt || "Update image"
        });
      }
      
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };
  
  // Handle adding a new update
  const handleAddUpdate = async () => {
    try {
      setLoading(true);
      console.log("Current user:", user);
      
      // Get user data - prefer context, fallback to session storage
      let userData;
      
      if (user) {
        userData = {
          userId: user.id,
          userName: user.name,
          userRole: user.role
        };
      } else {
        // Fallback to session storage
        userData = {
          userId: sessionStorage.getItem('userId'),
          userName: sessionStorage.getItem('userName'),
          userRole: sessionStorage.getItem('userRole')
        };
      }
      
      // Upload images first
      let uploadedImages = [];
      if (newUpdate.images && newUpdate.images.length > 0) {
        try {
          uploadedImages = await uploadImages(newUpdate.images);
        } catch (error) {
          setError("Failed to upload images. Please try again.");
          setLoading(false);
          return;
        }
      }
      
      // Log what we're sending
      console.log("Sending user data:", userData);
      
      const response = await fetch('/api/updates/add-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUpdate,
          images: uploadedImages,
          userData: userData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add update');
      }
      
      const result = await response.json();
      console.log("Update creation result:", result);
      
      // Refresh the updates list after adding
      fetchUpdates();
      
      // Reset form and close modal
      setNewUpdate({
        title: '',
        content: '',
        category: 'Announcement',
        priority: 'Medium',
        status: 'Draft', 
        visibility: 'All Users',
        expiresAt: '',
        images: [],
        imagesToDelete: []
      });
      setIsAddUpdateOpen(false);
    } catch (err) {
      console.error('Error adding update:', err);
      setError('Failed to add update. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle editing an update
  const handleEditUpdate = (update) => {
    setSelectedUpdate({
      ...update,
      newImages: [],
      imagesToDelete: []
    });
    setIsEditUpdateOpen(true);
  };
  
  // Handle update submission
  const handleUpdateSubmit = async () => {
    if (!selectedUpdate._id) {
      console.error("Error: Update ID is missing.");
      alert("Update ID is missing.");
      return;
    }

    try {
      setLoading(true);
      console.log("Updating ID:", selectedUpdate._id);
      
      // Upload new images
      let uploadedImages = [];
      if (selectedUpdate.newImages && selectedUpdate.newImages.length > 0) {
        try {
          uploadedImages = await uploadImages(selectedUpdate.newImages);
        } catch (error) {
          setError("Failed to upload images. Please try again.");
          setLoading(false);
          return;
        }
      }
      
      // Combine existing images (that weren't deleted) with newly uploaded ones
      const existingImages = selectedUpdate.images || [];
      const combinedImages = [...existingImages, ...uploadedImages];
      
      const response = await fetch('/api/updates/edit-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: selectedUpdate._id, 
          ...selectedUpdate,
          images: combinedImages,
          imagesToDelete: selectedUpdate.imagesToDelete || [] 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      // Refresh the updates list after editing
      fetchUpdates();
      setIsEditUpdateOpen(false);
    } catch (err) {
      console.error('Error updating update:', err);
      setError('Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirmation = (update) => {
    setUpdateToDelete(update);
    setIsDeleteConfirmOpen(true);
  };
  
  // Handle delete update
  const handleDeleteUpdate = async () => {
    if (updateToDelete) {
      try {
        setLoading(true);
        const response = await fetch('/api/updates/delete-update', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: updateToDelete._id }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete update');
        }
        
        // Refresh the updates list after deleting
        fetchUpdates();
        setIsDeleteConfirmOpen(false);
        setUpdateToDelete(null);
      } catch (err) {
        console.error('Error deleting update:', err);
        setError('Failed to delete update. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get priority color class
  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'Archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Maintenance':
        return <PenTool className="h-4 w-4" />;
      case 'Security':
        return <Eye className="h-4 w-4" />;
      case 'Feature':
        return <Tag className="h-4 w-4" />;
      case 'Announcement':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  return (
    user?.role === "Super-Admin" || user?.role === "Admin" ? 
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <Bell className="h-6 w-6 mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold">Updates & Notifications</h1>
        </div>
        
        <div className="flex mt-4 md:mt-0">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setIsAddUpdateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Update
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search updates..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="All">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="All">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchUpdates}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Updates List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map(update => (
              <div key={update.id || update._id} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${getPriorityColorClass(update.priority)}`}>
                      {getCategoryIcon(update.category)}
                    </div>
                    <div>
                      <h3 className="font-medium">{update.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs">
                        <span className={`px-2 py-1 rounded-full ${getStatusColorClass(update.status)}`}>
                          {update.status}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100">
                          {update.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${getPriorityColorClass(update.priority)}`}>
                          {update.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditUpdate(update)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirmation(update)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <p className="text-gray-700 mb-4">{update.content}</p>
                  
                  {/* Display images if any */}
                  {update.images && update.images.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {update.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image.url} 
                              alt={image.alt || "Update image"} 
                              className="h-24 w-full object-cover rounded"
                            />
                            {/* <button
                              type="button"
                              onClick={() => showDeleteImageConfirmation(image, index, update._id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle className="h-4 w-4" />
                            </button> */}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-between text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Created: {formatDate(update.createdAt)}</span>
                      </div>
                      {update.publishedAt && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Published: {formatDate(update.publishedAt)}</span>
                        </div>
                      )}
                      {update.expiresAt && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Expires: {formatDate(update.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Visibility: {update.visibility}</span>
                      </div>
                      <div className="flex items-center">
                        <PenTool className="h-4 w-4 mr-1" />
                        <span>Author: {update.createdBy?.userName || update.author || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>No updates found matching your filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                }}
                className="mt-2 text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Add Update Modal */}
      {isAddUpdateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Update</h2>
              <button onClick={() => setIsAddUpdateOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter update title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({...newUpdate, content: e.target.value})}
                  className="w-full p-2 border rounded-md h-32"
                  placeholder="Enter update content"
                ></textarea>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <div className="flex items-center justify-center">
                    <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload images</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                        onChange={(e) => handleImageChange(e)}
                      />
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {newUpdate.images && newUpdate.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {newUpdate.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image.preview || image.url} 
                            alt={image.alt || "Preview"} 
                            className="h-24 w-full object-cover rounded" 
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newUpdate.category}
                    onChange={(e) => setNewUpdate({...newUpdate, category: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={newUpdate.priority}
                    onChange={(e) => setNewUpdate({...newUpdate, priority: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newUpdate.status}
                    onChange={(e) => setNewUpdate({...newUpdate, status: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Visibility</label>
                  <select
                    value={newUpdate.visibility}
                    onChange={(e) => setNewUpdate({...newUpdate, visibility: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {visibilityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newUpdate.expiresAt}
                    onChange={(e) => setNewUpdate({...newUpdate, expiresAt: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  onClick={() => setIsAddUpdateOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUpdate}
                  disabled={loading || uploadingImages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
                >
                  {loading || uploadingImages ? 'Saving...' : 'Save Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Update Modal */}
      {isEditUpdateOpen && selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Update</h2>
              <button onClick={() => setIsEditUpdateOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={selectedUpdate.title}
                  onChange={(e) => setSelectedUpdate({...selectedUpdate, title: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter update title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={selectedUpdate.content}
                  onChange={(e) => setSelectedUpdate({...selectedUpdate, content: e.target.value})}
                  className="w-full p-2 border rounded-md h-32"
                  placeholder="Enter update content"
                ></textarea>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <div className="flex items-center justify-center">
                    <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload images</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                        onChange={(e) => handleImageChange(e, false)}
                      />
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {/* Show existing images */}
                    {selectedUpdate.images && selectedUpdate.images.map((image, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img 
                          src={image.url} 
                          alt={image.alt || "Update image"} 
                          className="h-24 w-full object-cover rounded" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Show new images to be uploaded */}
                    {selectedUpdate.newImages && selectedUpdate.newImages.map((image, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img 
                          src={image.preview} 
                          alt={image.alt || "Preview"} 
                          className="h-24 w-full object-cover rounded" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedNewImages = [...selectedUpdate.newImages];
                            if (updatedNewImages[index].preview) {
                              URL.revokeObjectURL(updatedNewImages[index].preview);
                            }
                            updatedNewImages.splice(index, 1);
                            setSelectedUpdate({
                              ...selectedUpdate,
                              newImages: updatedNewImages
                            });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={selectedUpdate.category}
                    onChange={(e) => setSelectedUpdate({...selectedUpdate, category: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={selectedUpdate.priority}
                    onChange={(e) => setSelectedUpdate({...selectedUpdate, priority: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={selectedUpdate.status}
                    onChange={(e) => setSelectedUpdate({...selectedUpdate, status: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Visibility</label>
                  <select
                    value={selectedUpdate.visibility}
                    onChange={(e) => setSelectedUpdate({...selectedUpdate, visibility: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {visibilityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    value={selectedUpdate.expiresAt ? new Date(selectedUpdate.expiresAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setSelectedUpdate({...selectedUpdate, expiresAt: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  onClick={() => setIsEditUpdateOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={loading || uploadingImages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
                >
                  {loading || uploadingImages ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Deletion</h2>
              <button onClick={() => setIsDeleteConfirmOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6">Are you sure you want to delete this update? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUpdate}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Image Confirmation Modal */}
      {isDeleteImageConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Image Deletion</h2>
              <button onClick={() => setIsDeleteImageConfirmOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-4">Are you sure you want to delete this image? This action cannot be undone.</p>
            
            {imageToDelete && imageToDelete.image && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={imageToDelete.image.url} 
                  alt="To be deleted" 
                  className="h-32 object-contain rounded" 
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteImageConfirmOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUploadedImage}
                disabled={deletingImage}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:bg-red-400"
              >
                {deletingImage ? 'Deleting...' : 'Delete Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    :
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-xl font-semibold mb-4">Access Denied</p>
      <p className="text-gray-600">You don't have permission to view this page.</p>
    </div>
  );
};

export default UpdatesManagement;