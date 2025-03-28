"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, X, Check, MoreHorizontal, Filter, Download, Upload, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


const UserManagement = () => {
  const {user} = useAuth()
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'Super-Admin', 
    status: 'Active',
    image: null,
    post: ''
  });
  const [editedUser, setEditedUser] = useState({ name: '', email: '', role: '', status: '' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add imagePreview state for preview
  const [imagePreview, setImagePreview] = useState(null);
  
  // For file input reference
  const fileInputRef = useRef(null);

  // Add state for edit image preview
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

  // Handle add user
  const handleAddUser = () => {
    resetAddUserForm();
    setIsAddUserOpen(true);
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({...newUser, image: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submit new user with image upload
  const handleSubmitNewUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let imageUrl = '';
      
      // Upload Image if exists
      if (newUser.image) {
        const imageData = new FormData();
        imageData.append("file", newUser.image);
        imageData.append("upload_preset", "event-upload"); // Use your Cloudinary preset
    
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
      
      // Now create the user with the image URL
      const response = await fetch('/api/user-management/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          name: newUser.name,
          status: newUser.status,
          image: imageUrl,  // Use the uploaded image URL
          post: newUser.post
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
      
      const data = await response.json();
      
      // Add the new user to the state
    const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
      const user = { 
        ...newUser, 
        id, 
        lastLogin: '-',
        _id: data.user._id,
        image: imageUrl // Store the image URL not the file object
      };
      
    setUsers([...users, user]);
      setNewUser({ name: '', email: '', password: '', role: 'user', status: 'Active', image: null, post: '' });
      setImagePreview(null);
    setIsAddUserOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(users);
  // Handle edit image change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser({...editedUser, image: file, imageFile: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUser({ 
      ...user,
      // Use existing image URL if available
      imageUrl: user.image || ''
    });
    setEditImagePreview(user.image || null);
    setIsEditUserOpen(true);
  };

  // Handle update user with image
  const handleUpdateUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let imageUrl = editedUser.imageUrl; // Use existing image URL by default
      
      // Upload Image if a new file was selected
      if (editedUser.imageFile) {
        const imageData = new FormData();
        imageData.append("file", editedUser.imageFile);
        imageData.append("upload_preset", "event-upload"); // Use your Cloudinary preset
    
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
      
      // Update user with image URL
      const response = await fetch(`/api/user-management/update-user/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          role: editedUser.role,
          status: editedUser.status,
          image: imageUrl, // Use the uploaded or existing image URL
          post: editedUser.post
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      // Update the user in the local state
    const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { 
          ...user, 
          ...editedUser,
          image: imageUrl // Use the final image URL
        } : user
      );
      
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      
    if (userToDelete) {
        // Single user deletion
        const response = await fetch(`/api/user-management/delete-user/${userToDelete._id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete user');
        }
        
        // Remove user from local state
      const filteredUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(filteredUsers);
        
    } else if (selectedRows.length > 0) {
        // Bulk deletion - we need to get the MongoDB IDs for the selected users
        const selectedUserIds = users
          .filter(user => selectedRows.includes(user.id))
          .map(user => user._id);
        
        const response = await fetch('/api/user-management/bulk-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: selectedUserIds
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete users');
        }
        
        // Remove users from local state
      const filteredUsers = users.filter(user => !selectedRows.includes(user.id));
      setUsers(filteredUsers);
      setSelectedRows([]);
      }
      
      setIsConfirmDeleteOpen(false);
      setUserToDelete(null);
      
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user(s):', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setIsConfirmDeleteOpen(true);
    }
  };

  // Handle row selection
  const handleSelectRow = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter(id => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Apply filters and search
  let filteredUsers = [...users];
  
  if (statusFilter !== 'All') {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }
  
  if (roleFilter !== 'All') {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter.toLowerCase());
  }
  
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply sorting
  filteredUsers.sort((a, b) => {
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
    setRoleFilter('All');
  };

  // Calculate selected status for header checkbox
  useEffect(() => {
    if (filteredUsers.length === 0) {
      setSelectAll(false);
    } else {
      setSelectAll(selectedRows.length === filteredUsers.length);
    }
  }, [selectedRows, filteredUsers]);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user-management/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        // Transform the data to handle missing fields better
        const formattedUsers = data.users.map((user, index) => ({
          id: index + 1,
          _id: user._id,
          name: user.name || '', // Handle missing name
          email: user.email || '',
          role: user.role || 'user',
          status: user.status || 'Active',
          lastLogin: user.lastLogin || '-',
          image: user.image || '', // Handle missing image
          post: user.post || ''  // Handle missing post
        }));
        
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Using sample data instead.');
        setUsers(initialUsers); // Fallback to sample data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Add resetForm function
  const resetAddUserForm = () => {
    setNewUser({ name: '', email: '', password: '', role: 'Super-Admin', status: 'Active', image: null, post: '' });
    setImagePreview(null);
    setError(null);
  };

  return (
    user?.role === "Super-Admin" || 
      user?.role === "Admin" || 
      user?.role?.startsWith("Building")?     
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">User Management</h1>
        
        {/* Error notification if fetch fails */}
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
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
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
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Super-Admin">Super-Admin</option>
            <option value="Admin">Admin</option>
            <option value="Building No.1">Building No.1</option>
            <option value="Building No.2">Building No.2</option>
            <option value="Building No.3">Building No.3</option>
            <option value="Building No.4">Building No.4</option>
            <option value="Building No.5">Building No.5</option>
            <option value="Building No.6A">Building No.6A</option>
            <option value="Building No.6B">Building No.6B</option>
            <option value="Building No.7">Building No.7</option>
            <option value="Building No.A">Building No.A</option>
            <option value="Building No.B">Building No.B</option>
            <option value="Building No.C">Building No.C</option>
          </select>
          
          {(statusFilter !== 'All' || roleFilter !== 'All' || searchTerm) && (
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
          <span className="text-sm mr-4">{selectedRows.length} users selected</span>
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-md flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </button>
        </div>
      )}
      
      {/* Users table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading users...</span>
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
                onClick={() => requestSort('email')}
              >
                Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                className="p-4 text-left cursor-pointer"
                onClick={() => requestSort('role')}
              >
                Role {sortConfig.key === 'role' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(user.id)}
                      onChange={() => handleSelectRow(user.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">{user.id}</td>
                    <td className="p-4">
                      {user.image ? (
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={user.image} 
                            alt={`${user.name || 'User'}'s profile`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/40?text=User";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{user.name || 'Unknown'}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${user.role === 'Super-Admin' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'Admin' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">{user.lastLogin}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteConfirmation(user)}
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
                  No users found. Try adjusting your filters or add a new user.
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
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
          <button className="px-3 py-1 border rounded-md">Next</button>
        </div>
      </div>
      
      {/* Add User Modal with Image Upload */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button onClick={() => setIsAddUserOpen(false)}>
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
                          setNewUser({...newUser, image: null});
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
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Post/Position</label>
                <input
                  type="text"
                  value={newUser.post}
                  onChange={(e) => setNewUser({...newUser, post: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter user's position or post"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Super-Admin">Super-Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Building No.1">Building No.1</option>
            <option value="Building No.2">Building No.2</option>
            <option value="Building No.3">Building No.3</option>
            <option value="Building No.4">Building No.4</option>
            <option value="Building No.5">Building No.5</option>
            <option value="Building No.6A">Building No.6A</option>
            <option value="Building No.6B">Building No.6B</option>
            <option value="Building No.7">Building No.7</option>
            <option value="Building No.A">Building No.A</option>
            <option value="Building No.B">Building No.B</option>
            <option value="Building No.C">Building No.C</option>
                  </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsAddUserOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitNewUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
                disabled={!newUser.name || !newUser.email || !newUser.password || !newUser.image || !newUser.post || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal with Image Upload */}
      {isEditUserOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit User</h2>
              <button onClick={() => setIsEditUserOpen(false)}>
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
                      Click to upload new profile image
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports JPG, PNG. Max 5MB.
                    </p>
                    {editImagePreview && (
                      <button 
                        onClick={() => { 
                          setEditedUser({...editedUser, image: editedUser.imageUrl, imageFile: null});
                          setEditImagePreview(editedUser.imageUrl);
                        }}
                        className="mt-1 text-xs text-red-600 hover:text-red-800"
                      >
                        Reset to original
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Post/Position</label>
                <input
                  type="text"
                  value={editedUser.post}
                  onChange={(e) => setEditedUser({...editedUser, post: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={editedUser.role}
                  onChange={(e) => setEditedUser({...editedUser, role: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Super-Admin">Super-Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Building No.1">Building No.1</option>
            <option value="Building No.2">Building No.2</option>
            <option value="Building No.3">Building No.3</option>
            <option value="Building No.4">Building No.4</option>
            <option value="Building No.5">Building No.5</option>
            <option value="Building No.6A">Building No.6A</option>
            <option value="Building No.6B">Building No.6B</option>
            <option value="Building No.7">Building No.7</option>
            <option value="Building No.A">Building No.A</option>
            <option value="Building No.B">Building No.B</option>
            <option value="Building No.C">Building No.C</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editedUser.status}
                  onChange={(e) => setEditedUser({...editedUser, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsEditUserOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
                disabled={!editedUser.name || !editedUser.email || !editedUser.post || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Delete Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                {userToDelete 
                  ? `Are you sure you want to delete user "${userToDelete.name}"?` 
                  : `Are you sure you want to delete ${selectedRows.length} selected users?`
                }
                This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button 
                  onClick={() => {
                    setIsConfirmDeleteOpen(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div> : <p>You DOnt have access to this page</p>
  );
};

export default UserManagement;