"use client"
import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X, Check, MoreHorizontal, Filter, Download, Upload } from 'lucide-react';

const UserManagement = () => {
  // Sample user data
  const initialUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-03-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active', lastLogin: '2025-03-18' },
    { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', role: 'Manager', status: 'Inactive', lastLogin: '2025-02-28' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'User', status: 'Active', lastLogin: '2025-03-20' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'User', status: 'Pending', lastLogin: '-' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User', status: 'Active' });
  const [editedUser, setEditedUser] = useState({ name: '', email: '', role: '', status: '' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

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
    setIsAddUserOpen(true);
  };

  // Handle submit new user
  const handleSubmitNewUser = () => {
    const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const currentDate = new Date().toISOString().split('T')[0];
    const user = { ...newUser, id, lastLogin: '-' };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'User', status: 'Active' });
    setIsAddUserOpen(false);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setIsEditUserOpen(true);
  };

  // Handle update user
  const handleUpdateUser = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, ...editedUser } : user
    );
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    if (userToDelete) {
      const filteredUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(filteredUsers);
      setIsConfirmDeleteOpen(false);
      setUserToDelete(null);
    } else if (selectedRows.length > 0) {
      const filteredUsers = users.filter(user => !selectedRows.includes(user.id));
      setUsers(filteredUsers);
      setSelectedRows([]);
      setIsConfirmDeleteOpen(false);
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
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">User Management</h1>
        
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
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
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
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {user.role}
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
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No users found. Try adjusting your filters or add a new user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
      
      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button onClick={() => setIsAddUserOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                disabled={!newUser.name || !newUser.email}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {isEditUserOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit User</h2>
              <button onClick={() => setIsEditUserOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={editedUser.role}
                  onChange={(e) => setEditedUser({...editedUser, role: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                disabled={!editedUser.name || !editedUser.email}
              >
                Update User
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
    </div>
  );
};

export default UserManagement;