"use client"
import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image,
  Calendar,
  Tag,
  User
} from "lucide-react";

export default function BlogManagement() {
  const [showModal, setShowModal] = useState(false);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Community Development Initiatives for 2025",
      excerpt: "Exploring the key initiatives our community will focus on in the coming year to enhance living standards and promote sustainability.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultricies, nisl nisl ultricies nisl, euismod nisl nisl euismod nisl.",
      author: "Raj Kumar",
      date: "2025-01-15",
      tags: ["Community", "Development", "Planning"],
      image: "/public/events/shape1.svg",
      status: "Published"
    },
    {
      id: 2,
      title: "The Importance of Cultural Preservation",
      excerpt: "Why preserving our cultural heritage matters for the future generations and how our community is taking steps to ensure it.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultricies, nisl nisl ultricies nisl, euismod nisl nisl euismod nisl.",
      author: "Priya Singh",
      date: "2025-02-10",
      tags: ["Culture", "Heritage", "Preservation"],
      image: "/public/events/shape2.svg",
      status: "Published"
    },
    {
      id: 3,
      title: "New Infrastructure Projects Beginning Next Month",
      excerpt: "Details about the new infrastructure projects that will commence in our area next month and how they will benefit residents.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultricies, nisl nisl ultricies nisl, euismod nisl nisl euismod nisl.",
      author: "Vikram Sharma",
      date: "2025-03-05",
      tags: ["Infrastructure", "Development", "Projects"],
      image: "/public/events/shape2.png",
      status: "Draft"
    }
  ]);

  const [newBlog, setNewBlog] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toISOString().split('T')[0],
    tags: "",
    image: null,
    status: "Draft"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    // In a real app, you would handle file upload to storage
    setNewBlog(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process tags from comma-separated string to array
    const tagsArray = newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    
    // In a real app, you would send this data to your API
    const blogWithId = {
      ...newBlog,
      id: blogs.length + 1,
      tags: tagsArray,
      image: newBlog.image ? URL.createObjectURL(newBlog.image) : "/public/events/icon.png"
    };
    
    setBlogs([...blogs, blogWithId]);
    setNewBlog({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      date: new Date().toISOString().split('T')[0],
      tags: "",
      image: null,
      status: "Draft"
    });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    // In a real app, you would call your API to delete the blog
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          Add Blog Post
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {blog.image ? (
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image size={48} className="text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-block px-2 py-1 text-xs rounded ${
                  blog.status === 'Published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {blog.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
              
              <div className="flex items-center text-gray-500 mb-2">
                <User size={16} className="mr-2" />
                <span>{blog.author}</span>
              </div>
              
              <div className="flex items-center text-gray-500 mb-2">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center text-gray-500 mb-4 flex-wrap">
                <Tag size={16} className="mr-2" />
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                  <Edit size={18} />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  onClick={() => handleDelete(blog.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Blog Post</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Blog Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newBlog.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter blog title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">
                  Excerpt*
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={newBlog.excerpt}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter a short summary of the blog"
                  rows="2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                  Content*
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={newBlog.content}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter blog content"
                  rows="6"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                    Author*
                  </label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    value={newBlog.author}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter author name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                    Date*
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={newBlog.date}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={newBlog.tags}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter tags separated by commas (e.g. Community, Development, Planning)"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newBlog.status}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Featured Image
                </label>
                <div className="mt-1 flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-purple-600 rounded-lg shadow-lg tracking-wide uppercase border border-purple-600 cursor-pointer hover:bg-purple-600 hover:text-white">
                    <span className="mx-auto flex items-center">
                      <Image size={24} className="mr-2" />
                      <span className="text-base leading-normal">Select a file</span>
                    </span>
                    <input 
                      type='file' 
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden" 
                      accept="image/*"
                    />
                  </label>
                  {newBlog.image && (
                    <span className="ml-3 text-sm text-gray-600">
                      {newBlog.image.name}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Blog Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}