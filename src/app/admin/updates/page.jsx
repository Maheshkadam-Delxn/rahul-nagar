"use client"
import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, X, Calendar, Clock, PenTool, Users, Eye, Filter, Search, Tag } from 'lucide-react';

const UpdatesManagement = () => {
  const [updates, setUpdates] = useState([]);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isEditUpdateOpen, setIsEditUpdateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [updateToDelete, setUpdateToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    priority: 'Medium',
    status: 'Draft',
    visibility: 'All Users',
    expiresAt: '',
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
  
  // Handle adding a new update
  const handleAddUpdate = async () => {
    try {
      const response = await fetch('/api/updates/add-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUpdate,
          status: newUpdate.status,
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to add update');
      }
      
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
      });
      setIsAddUpdateOpen(false);
    } catch (err) {
      console.error('Error adding update:', err);
      alert('Failed to add update. Please try again.');
    }
  };
  
  // Handle editing an update
  const handleEditUpdate = (update) => {
    setSelectedUpdate(update);
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
        console.log("Updating ID:", selectedUpdate._id); // Debugging log
        const response = await fetch('/api/updates/edit-update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: selectedUpdate._id, ...selectedUpdate }),
        });

        if (!response.ok) {
            throw new Error('Failed to update');
        }

        // Refresh the updates list after editing
        fetchUpdates();
        setIsEditUpdateOpen(false);
    } catch (err) {
        console.error('Error updating update:', err);
        alert('Failed to update. Please try again.');
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
        const response = await fetch('/api/updates/delete-update', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: updateToDelete}),
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
        alert('Failed to delete update. Please try again.');
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
              <div key={update.id} className="border rounded-lg overflow-hidden">
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
                        <span>Author: {update.author}</span>
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
                  <label className="block text-sm font-medium mb-1">Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={newUpdate.expiresAt}
                    onChange={(e) => setNewUpdate({...newUpdate, expiresAt: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsAddUpdateOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                disabled={!newUpdate.title || !newUpdate.content}
              >
                Publish Update
              </button>
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
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={selectedUpdate.content}
                  onChange={(e) => setSelectedUpdate({...selectedUpdate, content: e.target.value})}
                  className="w-full p-2 border rounded-md h-32"
                ></textarea>
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
                  <label className="block text-sm font-medium mb-1">Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={selectedUpdate.expiresAt ? new Date(selectedUpdate.expiresAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setSelectedUpdate({...selectedUpdate, expiresAt: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsEditUpdateOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                disabled={!selectedUpdate.title || !selectedUpdate.content}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && updateToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-2">Delete Update</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the update "{updateToDelete.title}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
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
        </div>
      )}
    </div>
  );
};

export default UpdatesManagement;