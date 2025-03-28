"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, X, Check, MoreHorizontal, Filter, Download, Upload, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AssociateMemberManagement = () => {
  const {user} = useAuth()
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({ 
    name: '',  
    status: 'Active',
    image: null,
    post: '',
  });
  const [editedMember, setEditedMember] = useState({ 
    name: '', 
    status: 'Active',
    post: '',
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image preview states
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const editFileInputRef = useRef(null);

  // Handle sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle image change for add member
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMember({...newMember, image: file});
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image change for edit member
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedMember({...editedMember, image: file, imageFile: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle add member
  const handleAddMember = () => {
    resetAddMemberForm();
    setIsAddMemberOpen(true);
  };

  // Handle submit new member
  const handleSubmitNewMember = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let imageUrl = '';
      
      // Upload Image if exists
      if (newMember.image) {
        const imageData = new FormData();
        imageData.append("file", newMember.image);
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
          setIsLoading(false);
          return;
        }
      }
      
      // Now create the member with the image URL
      const response = await fetch('/api/associate-member-management/add-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMember.name,
          status: newMember.status,
          image: imageUrl || "",
          post: newMember.post,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add member');
      }
      
      const data = await response.json();
      
      // Add the new member to the state
      const id = members.length > 0 ? Math.max(...members.map(member => member.id)) + 1 : 1;
      const member = { 
        ...newMember, 
        id, 
        lastLogin: '-',
        _id: data.member._id,
        image: imageUrl || ""
      };
      
      setMembers([...members, member]);
      setNewMember({ 
        name: '', 
        status: 'Active', 
        image: null,
        specialization: '',
        experience: '',
        post: '',
        linkedinProfile: ''
      });
      setImagePreview(null);
      setIsAddMemberOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit member
  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditedMember({ 
      ...member,
      imageUrl: member.image || ''
    });
    setEditImagePreview(member.image || null);
    setIsEditMemberOpen(true);
  };

  // Handle update member
  const handleUpdateMember = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let imageUrl = editedMember.imageUrl;
      
      // Upload Image if a new file was selected
      if (editedMember.imageFile) {
        const imageData = new FormData();
        imageData.append("file", editedMember.imageFile);
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
          setIsLoading(false);
          return;
        }
      }
      
      // Update member with image URL
      const response = await fetch(`/api/associate-member-management/update-member/${selectedMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedMember.name,
          status: editedMember.status,
          image: imageUrl || "",
          post: editedMember.post,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update member');
      }
      
      // Update the member in the local state
      const updatedMembers = members.map(member => 
        member.id === selectedMember.id ? { 
          ...member, 
          ...editedMember,
          image: imageUrl || ""
        } : member
      );
      
      setMembers(updatedMembers);
      setIsEditMemberOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (member) => {
    setMemberToDelete(member);
    setIsConfirmDeleteOpen(true);
  };

  // Handle delete member
  const handleDeleteMember = async () => {
    try {
      setIsLoading(true);
      
      if (memberToDelete) {
        // Single member deletion
        const response = await fetch(`/api/associate-member-management/delete-member/${memberToDelete._id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete member');
        }
        
        // Remove member from local state
        const filteredMembers = members.filter(member => member.id !== memberToDelete.id);
        setMembers(filteredMembers);
        
      } else if (selectedRows.length > 0) {
        // Bulk deletion
        const selectedMemberIds = members
          .filter(member => selectedRows.includes(member.id))
          .map(member => member._id);
        
        const response = await fetch('/api/associate-member-management/bulk-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberIds: selectedMemberIds
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete members');
        }
        
        // Remove members from local state
        const filteredMembers = members.filter(member => !selectedRows.includes(member.id));
        setMembers(filteredMembers);
        setSelectedRows([]);
      }
      
      setIsConfirmDeleteOpen(false);
      setMemberToDelete(null);
      
    } catch (err) {
      setError(err.message);
      console.error('Error deleting member(s):', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch members from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/associate-member-management/members');
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        
        const data = await response.json();
        
        // Transform the data to handle missing fields
        const formattedMembers = data.members.map((member, index) => ({
          id: index + 1,
          _id: member._id,
          name: member.name || '',
          status: member.status || 'Active',
          lastLogin: member.lastLogin || '-',
          image: member.image || '',
          post: member.post || '',
        }));
        
        setMembers(formattedMembers);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load members.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  // Reset add member form
  const resetAddMemberForm = () => {
    setNewMember({ 
      name: '', 
      status: 'Active', 
      image: null,
      post: '',
    });
    setImagePreview(null);
    setError(null);
  };

  // Handle row selection
  const handleSelectRow = (memberId) => {
    if (selectedRows.includes(memberId)) {
      setSelectedRows(selectedRows.filter(id => id !== memberId));
    } else {
      setSelectedRows([...selectedRows, memberId]);
    }
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredMembers.map(member => member.id));
    }
    setSelectAll(!selectAll);
  };

  // Apply filters and search
  let filteredMembers = [...members];
  
  if (statusFilter !== 'All') {
    filteredMembers = filteredMembers.filter(member => member.status === statusFilter);
  }
  
  if (searchTerm) {
    filteredMembers = filteredMembers.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply sorting
  filteredMembers.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  return (
    user?.role === "Super-Admin" || user?.role === "Admin" ? 
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Associate Member Management</h1>
        
        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md w-full md:w-auto">
            {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <button
            onClick={handleAddMember}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 mr-2">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
          
          {(statusFilter !== 'All' || searchTerm) && (
            <button
              onClick={resetFilters}
              className="border rounded-md px-3 py-1 text-sm hover:bg-gray-100 focus:outline-none"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="ml-auto flex gap-2">
          <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-100">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-100">
            <Upload className="h-4 w-4" />
            Import
          </button>
        </div>
      </div>
      
      {/* Bulk actions */}
      {selectedRows.length > 0 && (
        <div className="bg-gray-50 border rounded-md p-2 mb-4 flex items-center">
          <span className="text-sm mr-4">{selectedRows.length} members selected</span>
          <button
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-md flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </button>
        </div>
      )}
      
      {/* Members table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading members...</span>
          </div>
        ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                <input 
                  type="checkbox" 
                  checked={selectAll} 
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th 
                className="p-4 text-left cursor-pointer"
                onClick={() => requestSort('id')}
              >
                ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left">Photo</th>
              <th 
                className="p-4 text-left cursor-pointer"
                onClick={() => requestSort('name')}
              >
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
             
              <th 
                className="p-4 text-left cursor-pointer"
                onClick={() => requestSort('specialization')}
              >
                Post {sortConfig.key === 'specialization' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                className="p-4 text-left cursor-pointer"
                onClick={() => requestSort('status')}
              >
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                className="p-4 text-left cursor-pointer"
                onClick={() => requestSort('lastLogin')}
              >
                Last Login {sortConfig.key === 'lastLogin' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <tr 
                  key={member.id} 
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(member.id)}
                      onChange={() => handleSelectRow(member.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">{member.id}</td>
                  <td className="p-4">
                    {member.image ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        <img 
                          src={member.image} 
                          alt={`${member.name || 'Member'}'s profile`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40?text=Member";
                          }}
                        />
                      </div>
                    ) : (
                     null
                    )}
                  </td>
                  <td className="p-4 font-medium">{member.name || 'Unknown'}</td>
                  <td className="p-4">{member.post || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        member.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4">{member.lastLogin}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditMember(member)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteConfirmation(member)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No members found. Try adjusting your filters or add a new member.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredMembers.length} of {members.length} members
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
          <button className="px-3 py-1 border rounded-md">Next</button>
        </div>
      </div>
      
      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Associate Member</h2>
              <button onClick={() => setIsAddMemberOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Profile Image</label>
                <div className="flex items-center space-x-4">
                  <div 
                    className="relative w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload profile image
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports JPG, PNG. Max 5MB.
                    </p>
                    {imagePreview && (
                      <button 
                        onClick={() => { 
                          setNewMember({...newMember, image: null});
                          setImagePreview(null);
                        }}
                        className="mt-1 text-xs text-red-600 hover:text-red-800"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter member name"
                />
              </div>
              
           
              
             
              
              {/* <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  value={newMember.specialization}
                  onChange={(e) => setNewMember({...newMember, specialization: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter member's specialization"
                />
              </div>
               */}
              {/* <div>
                <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                <input
                  type="text"
                  value={newMember.experience}
                  onChange={(e) => setNewMember({...newMember, experience: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter years of experience"
                />
              </div> */}
              
              <div>
                <label className="block text-sm font-medium mb-1">Post</label>
                <input
                  type="tel"
                  value={newMember.post}
                  onChange={(e) => setNewMember({...newMember, post: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Post"
                />
              </div>
              
              {/* <div>
                <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={newMember.linkedinProfile}
                  onChange={(e) => setNewMember({...newMember, linkedinProfile: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter LinkedIn profile URL"
                />
              </div> */}
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember({...newMember, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitNewMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Member Modal */}
      {isEditMemberOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Associate Member</h2>
              <button onClick={() => setIsEditMemberOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Profile Image</label>
                <div className="flex items-center space-x-4">
                  <div 
                    className="relative w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => editFileInputRef.current.click()}
                  >
                    {editImagePreview ? (
                      <img 
                        src={editImagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={handleEditImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      Click to update profile image
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports JPG, PNG. Max 5MB.
                    </p>
                    {editImagePreview && (
                      <button 
                        onClick={() => { 
                          setEditedMember({...editedMember, image: null, imageFile: null});
                          setEditImagePreview(null);
                        }}
                        className="mt-1 text-xs text-red-600 hover:text-red-800"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editedMember.name}
                  onChange={(e) => setEditedMember({...editedMember, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter member name"
                />
              </div>
              
              
              {/* <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  value={editedMember.specialization}
                  onChange={(e) => setEditedMember({...editedMember, specialization: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter member's specialization"
                />
              </div> */}
              
              {/* <div>
                <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                <input
                  type="text"
                  value={editedMember.experience}
                  onChange={(e) => setEditedMember({...editedMember, experience: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter years of experience"
                />
              </div> */}
              
              <div>
                <label className="block text-sm font-medium mb-1">Post</label>
                <input
                  type="tel"
                  value={editedMember.post}
                  onChange={(e) => setEditedMember({...editedMember, post: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Post"
                />
              </div>
              
              {/* <div>
                <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={editedMember.linkedinProfile}
                  onChange={(e) => setEditedMember({...editedMember, linkedinProfile: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter LinkedIn profile URL"
                />
              </div> */}
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editedMember.status}
                  onChange={(e) => setEditedMember({...editedMember, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={() => setIsEditMemberOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Delete Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Confirm Deletion</h2>
              <button onClick={() => setIsConfirmDeleteOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">
              {memberToDelete 
                ? `Are you sure you want to delete the member "${memberToDelete.name}"?`
                : `Are you sure you want to delete ${selectedRows.length} selected members?`
              }
            </p>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteMember}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div> : (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center text-red-600">
        Access Denied: You do not have permission to view this page.
      </div>
    ))
};

export default AssociateMemberManagement;