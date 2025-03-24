"use client"
import { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image,
  Calendar,
  Tag,
  User,
  Loader
} from "lucide-react";

export default function BlogManagement() {
  const [showModal, setShowModal] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [error,setError] =useState(false)

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

  // Fetch all blogs when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog/fetchAll");
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(blogs)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewBlog(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const resetForm = () => {
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
    setEditMode(false);
    setCurrentBlogId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    setError(null);
  
    console.log("New Blog Data:", newBlog); // Debugging
  
    let imageUrl = "";
  
    // Upload Image if exists
    if (newBlog.image && typeof newBlog.image !== "string") {
      const imageData = new FormData();
      imageData.append("file", newBlog.image);
      imageData.append("upload_preset", "blog-upload"); // Cloudinary preset
  
      try {
        const imageResponse = await fetch(
          "https://api.cloudinary.com/v1_1/rahul-nagar/image/upload",
          {
            method: "POST",
            body: imageData,
          }
        );
  
        const imageResult = await imageResponse.json();
  
        if (!imageResponse.ok) {
          throw new Error(`Image upload failed: ${imageResult.error?.message || "Unknown error"}`);
        }
  
        imageUrl = imageResult.secure_url || "";
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }
    }
  
    // Convert tags string to array
    const tagsArray = newBlog.tags
      ? newBlog.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
      : [];
  
    // Prepare Blog Data with Default Values
    const blogData = {
      title: newBlog.title?.trim() || "Untitled Blog",
      description: newBlog.description?.trim() || "No description provided",
      category: newBlog.category || "General",
      tags: tagsArray,
      image: imageUrl,
      authorName: newBlog.authorName?.trim() || "Anonymous",
      createdBy: sessionStorage?.getItem("userId") || "defaultAdminId",
    };
  
    console.log("Final Blog Data:", blogData); // Debugging before sending request
  
    try {
      const response = await fetch("/api/blog/add-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add blog: ${response.statusText}`);
      }
  
      const addedBlog = await response.json();
      console.log("Blog added successfully:", addedBlog); // Debugging
  
      // Refresh blogs list after adding new blog
      fetchBlogs();
  
      // Reset Form
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding blog:", error);
      setError("Failed to add blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/blog/delete-blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh the blog list
      await fetchBlogs();
      
    } catch (error) {
      console.error("Failed to delete blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    // Set up the form for editing
    setNewBlog({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      date: blog.date.split('T')[0], // Format date if in ISO format
      tags: blog.tags.join(', '), // Convert tags array to string
      status: blog.status,
      image: null // Can't pre-fill the file input, but existing image data will be preserved on the server if not changed
    });
    
    setEditMode(true);
    setCurrentBlogId(blog.id);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          disabled={loading}
        >
          <Plus size={18} />
          Add Blog Post
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-purple-600 mr-2" />
          <span>Loading...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Blog Posts Yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first blog post</p>
          <button 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create Blog Post
          </button>
        </div>
      )}

      {/* Blogs Grid */}
      {!loading && blogs.length > 0 && (
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
                  <button 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    onClick={() => handleEdit(blog)}
                    disabled={loading}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    onClick={() => handleDelete(blog._id)}
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editMode ? "Edit Blog Post" : "Add New Blog Post"}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Featured Image {editMode && "(Leave empty to keep existing image)"}
                </label>
                <div className="mt-1 flex items-center">
                  <label className={`flex flex-col items-center px-4 py-6 bg-white text-purple-600 rounded-lg shadow-lg tracking-wide uppercase border border-purple-600 cursor-pointer ${!loading ? 'hover:bg-purple-600 hover:text-white' : 'opacity-50'}`}>
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
                      disabled={loading}
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
                      <Loader size={18} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    `${editMode ? 'Update' : 'Save'} Blog Post`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}