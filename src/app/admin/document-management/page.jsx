"use client"
import React, { useState } from 'react';
import { Folder, File, Upload, Plus, MoreVertical, ChevronLeft, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
const DocumentManagement = () => {
  const [currentPath, setCurrentPath] = useState(['My Drive']);
 const {user} = useAuth();
 console.log("user",user);
  const [items, setItems] = useState([
    { id: 1, type: 'folder', name: 'Documents', parent: 'My Drive' },
    { id: 2, type: 'folder', name: 'Images', parent: 'My Drive' },
    { id: 3, type: 'file', name: 'Project Plan.pdf', parent: 'My Drive' },
    { id: 4, type: 'file', name: 'Budget.xlsx', parent: 'Documents' },
    { id: 5, type: 'file', name: 'Meeting Notes.docx', parent: 'Documents' },
    { id: 6, type: 'file', name: 'Logo.png', parent: 'Images' },
    { id: 7, type: 'file', name: 'Banner.jpg', parent: 'Images' },
  ]);
  
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentFolder = currentPath[currentPath.length - 1];
  
  const filteredItems = items.filter(item => 
    item.parent === currentFolder && 
    (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    }
  };

  const handleBackClick = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
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
  
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newItems = [...items];
      
      Array.from(files).forEach((file, index) => {
        const newId = Math.max(...items.map(item => item.id)) + 1 + index;
        newItems.push({
          id: newId,
          type: 'file',
          name: file.name,
          parent: currentFolder,
          size: file.size,
          lastModified: file.lastModified
        });
      });
      
      setItems(newItems);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-4 py-2 flex items-center">
        <h1 className="text-xl font-semibold text-gray-800 mr-6">Document Manager</h1>
        <div className="flex items-center bg-gray-100 rounded-md px-3 py-1 flex-grow max-w-md">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search documents"
            className="bg-transparent border-none outline-none w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-white px-4 py-2 flex border-b">
        <button 
          onClick={handleBackClick} 
          disabled={currentPath.length <= 1}
          className={`mr-2 p-2 rounded-full ${currentPath.length <= 1 ? 'text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-1">
          {currentPath.map((folder, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <span className="font-medium">{folder}</span>
            </React.Fragment>
          ))}
        </div>
        
        <div className="ml-auto flex space-x-2">
          <label className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            <span>Upload</span>
            <input type="file" className="hidden" multiple onChange={handleFileUpload} />
          </label>
          
          <button 
            className="inline-flex items-center px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => setShowNewFolderInput(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>New Folder</span>
          </button>
        </div>
      </div>
      
      {/* New Folder Input */}
      {showNewFolderInput && (
        <div className="p-4 bg-white border-b">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Folder name"
              className="border border-gray-300 rounded-md px-3 py-1 mr-2"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              autoFocus
            />
            <button 
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleNewFolder}
            >
              Create
            </button>
            <button 
              className="px-3 py-1 ml-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => setShowNewFolderInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-grow p-6 overflow-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No items match your search' : 'This folder is empty'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 cursor-pointer flex flex-col items-center"
                onClick={() => handleItemClick(item)}
              >
                <div className="relative">
                  {item.type === 'folder' ? (
                    <Folder className="h-16 w-16 text-blue-500" />
                  ) : (
                    <File className="h-16 w-16 text-gray-400" />
                  )}
                  <button className="absolute top-0 right-0 p-1 rounded-full hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="mt-2 text-center w-full truncate">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManagement;