"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader, Image as ImageIcon } from "lucide-react";

export default function AdvertisementManagement() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch("/api/redevelopment/advertisement/fetchAll");
      const data = await res.json();
      console.log("Fetched advertisements:", data);  // Debugging log to inspect the fetched data
  
      if (data.success && Array.isArray(data.advertisements)) {
        setAds(data.advertisements);  // Fix: Ensure we set the state correctly
      } else {
        setAds([]);
        setError("No advertisements found.");
      }
    } catch (err) {
      setError("Failed to fetch advertisements");
    } finally {
      setFetchLoading(false);
    }
  };
  

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return alert("Please select an image to upload");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "event-upload");

    try {
      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/rahul-nagar/image/upload", {
        method: "POST",
        body: formData,
      });

      const result = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        throw new Error(result.error?.message || "Image upload failed");
      }

      const adData = {
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
        title: "Advertisement Image",
        description: "Uploaded via Admin Panel",
        createdBy: "admin",
      };

      const response = await fetch("/api/redevelopment/advertisement/add-advertisement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });

      if (!response.ok) throw new Error("Failed to add advertisement");

      fetchAdvertisements();
      setShowModal(false);
      setImageFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
  
    try {
      const res = await fetch("/api/redevelopment/advertisement/delete-advertisement", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adId: id }),  // Change here to 'adId'
      });
  
      if (!res.ok) throw new Error("Delete failed");
  
      fetchAdvertisements();
    } catch (err) {
      alert("Failed to delete advertisement");
    }
  };
  
  

  console.log("Advertisements state:", ads);  // Debugging log to check the `ads` state

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Advertisement Gallery</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Plus size={18} /> Upload Image
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {fetchLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : ads.length === 0 ? (
        <div className="text-center text-gray-500">
          <ImageIcon className="mx-auto mb-2" size={48} />
          No advertisements yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ads.map(ad => (
            <div key={ad._id} className="bg-white rounded-lg shadow p-2">
              <img
                src={ad.imageUrl}
                alt={ad.title || "Advertisement"}
                className="w-full h-48 object-cover rounded"
              />
              <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-sm text-gray-700 truncate">{ad.title}</p>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(ad._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Upload Advertisement Image</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
