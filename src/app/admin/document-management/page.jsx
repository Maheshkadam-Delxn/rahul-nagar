"use client"
import React, { useState,useEffect } from 'react';
import { Folder, File, Upload, Plus, MoreVertical, ChevronLeft, Search ,Trash2} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Download } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
 
const DocumentManagement = () => {
  const [currentPath, setCurrentPath] = useState(['My Drive']);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
 
 
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const currentFolder = currentPath[currentPath.length - 1];
 
  const filteredItems = items.filter(item =>
    item.parent === currentFolder &&
    (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/files');
        setItems(response.data.files || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };
 
    if (user?.role === "Super-Admin" || user?.role === "Admin" || user?.role === "Associate-Member") {
      fetchItems();
    }
  }, [user]);
 
  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    } else if (item.driveFileId) {
      // Open the file in a new tab
      window.open(`https://drive.google.com/file/d/${item.driveFileId}/view`, '_blank');
    }
  };
 
  const handleBackClick = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };
  const handleDelete = async (fileId, e) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    try {
      setLoading(true);
      const response = await axios.delete('/api/files/delete', {
        data: { fileId }
      });
     
      if (response.data.success) {
        // Refresh the file list after successful deletion
        const fetchResponse = await axios.get('/api/files');
        setItems(fetchResponse.data.files || []);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setLoading(false);
      setShowDropdown(null); // Close the dropdown
    }
  };
 
  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === id ? null : id);
  };
 
  const handleNewFolder = () => {
    if (newFolderName.trim() !== '') {
      const newId = Math.max(...items.map(item => item.id)) + 1;
      setItems([
        ...items,
        { id: newId, type: 'folder', name: newFolderName, parent: currentFolder }
      ]);
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };
 
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newItems = [...items];
      const newUploadProgress = { ...uploadProgress };
     
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newId = Math.max(...items.map(item => item.id)) + 1 + i;
       
        // Add file to local state immediately
        const newItemEntry = {
          id: newId,
          type: 'file',
          name: file.name,
          parent: currentFolder,
          size: file.size,
          uploadStatus: 'uploading'
        };
        newItems.push(newItemEntry);
       
        // Prepare FormData for upload
        const formData = new FormData();
        formData.append('file', file);
       
        try {
          // Upload to Google Drive via API route
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              newUploadProgress[newId] = percentCompleted;
              setUploadProgress(newUploadProgress);
            }
          });
         
          if (response.data.success) {
            // Update item with upload success and Google Drive file ID
            const updatedItems = newItems.map(item =>
              item.id === newId
                ? {
                    ...item,
                    uploadStatus: 'success',
                    driveFileId: response.data.fileId,
                    viewLink: response.data.viewLink
                  }
                : item
            );
            setItems(updatedItems);
          } else {
            // Handle upload failure
            const updatedItems = newItems.map(item =>
              item.id === newId
                ? { ...item, uploadStatus: 'error' }
                : item
            );
            setItems(updatedItems);
          }
        } catch (error) {
          console.error('Upload error:', error);
          // Update item with error status
          const updatedItems = newItems.map(item =>
            item.id === newId
              ? { ...item, uploadStatus: 'error' }
              : item
          );
          setItems(updatedItems);
        }
      }
     
      setUploadProgress(newUploadProgress);
    }
  };
 
  return (
    user?.role === "Super-Admin" || user?.role === "Admin" || user?.role === "Associate-Member" ?
    <div className="flex flex-col h-screen bg-gray-100">
        <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          {/* Path Breadcrumbs */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBackClick}
              disabled={currentPath.length === 1}
              className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-1 text-lg font-medium">
              {currentPath.join(' / ')}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Upload Button */}
          <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
            <Upload className="h-5 w-5 mr-2" />
            Upload
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* New Folder Button */}
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Folder
          </button>
        </div>

        {/* New Folder Input */}
        {showNewFolderInput && (
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter folder name"
              className="flex-1 px-4 py-2 border rounded-lg"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button
              onClick={handleNewFolder}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        )}
      </div>
     
      {/* Content */}
      <div className="flex-grow p-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            This folder is empty
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 cursor-pointer flex flex-col items-center relative"
              >
                <Link
                  href={item?.viewLink || "#"}
                  className="flex flex-col items-center w-full"
                >
                  <div className="relative w-full">
                    {item.type === 'folder' ? (
                      <Folder className="h-16 w-16 text-blue-500 mx-auto" />
                    ) : (
                      <File className="h-16 w-16 text-gray-400 mx-auto" />
                    )}
                  </div>
                  <div className="mt-2 text-center w-full truncate">
                    {item.name}
                  </div>
                </Link>
               
                {/* Dropdown menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => toggleDropdown(item.id, e)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                 
                  {showDropdown === item.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {item.type === 'file' && (
                          <a
                            href={`https://drive.google.com/uc?export=download&id=${item.driveFileId}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        )}
                        <button
                          onClick={(e) => handleDelete(item.driveFileId, e)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
 
                {/* Upload status indicators */}
                {item.uploadStatus === 'uploading' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-full h-1 bg-gray-300 absolute bottom-0">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${uploadProgress[item.id] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {item.uploadStatus === 'error' && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center text-white">
                    Upload Failed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    : <p>You don't have access to this page</p>
  );
 
};
 
export default DocumentManagement;
 