"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  FileText,
  Video,
  Percent,
  Loader,
  LayoutGrid,
  ListPlus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BuilderManagement() {
  const user = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [builders, setBuilders] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    developer: "",
    videoUrl: "",
    additionalDocuments: [], // Array of {name, url}
    offerTitle: "",
    offerPercentage: 100,
  });

  const trimText = (text, wordLimit = 5) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/builder/fetchAll");
      if (!response.ok) throw new Error("Failed to fetch builders");
      const data = await response.json();
      if (data.success && data.builders) {
        setBuilders(data.builders);
      }
    } catch (error) {
      console.error("Error fetching builders:", error);
      setError("Failed to load builders. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeInBytes = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSizeInBytes) {
        alert("File size exceeds 15MB. Please upload a smaller file.");
        return;
      }

      const fileExt = file.name.split(".").pop().toLowerCase();
      const supportedFormats = ["pdf", "txt", "xls", "xlsx", "doc", "docx"];

      if (supportedFormats.includes(fileExt)) {
        await uploadDocument(file);
      } else {
        alert(`Unsupported format: ${fileExt}. Allowed: PDF, TXT, XLS, XLSX, DOC, DOCX`);
      }
    }
  };

const uploadDocument = async (file) => {
  setIsUploading(true);
  setUploadProgress(0);

  try {
    // Step 1: Create FormData to send file and metadata
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("mimeType", file.type);
    formData.append("folderId", "1gsrhldLDRlcQmI-vKCgpPuJTxJpY48q8"); // Your Drive folder ID

    // Step 2: Send file to server for upload to Google Drive
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/createUploadSession", true);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    const uploadPromise = new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network error during file upload"));
      xhr.send(formData);
    });

    const response = await uploadPromise;
    if (!response.success) {
      throw new Error(response.error || "Failed to upload file to Google Drive");
    }

    const fileId = response.fileId;
    if (!fileId) {
      throw new Error("Failed to retrieve fileId from server");
    }

    // Step 3: Construct file link
    const documentUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

    setFormData((prev) => ({
      ...prev,
      additionalDocuments: [
        ...prev.additionalDocuments,
        { name: file.name, url: documentUrl },
      ],
    }));

    return documentUrl;
  } catch (error) {
    console.error("Error uploading document:", error);
    setError(`Upload failed: ${error.message}`);
    throw error;
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};
  
  const handleDeleteDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this builder?")) return;
    try {
      const userId = user?.user?.id;
      if (!userId) {
        alert("User not found. Please log in again.");
        return;
      }
      const response = await fetch("/api/builder/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ builderId: id, userId }),
      });
      if (!response.ok) throw new Error("Failed to delete builder");
      setBuilders(builders.filter((builder) => builder._id !== id));
    } catch (error) {
      console.error("Error deleting builder:", error);
      alert("Failed to delete builder. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentItemId(item._id);
    setFormData({
      developer: item.developer,
      videoUrl: item.video.url,
      additionalDocuments: item.additionalDocuments || [],
      offerTitle: item.offer.title,
      offerPercentage: item.offer.percentage,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      developer: "",
      videoUrl: "",
      additionalDocuments: [],
      offerTitle: "",
      offerPercentage: 100,
    });
    setIsEditMode(false);
    setCurrentItemId(null);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const updateData = {
      builderId: currentItemId,
      developer: formData.developer.trim(),
      video: { url: formData.videoUrl.trim() },
      additionalDocuments: formData.additionalDocuments,
      offer: {
        title: formData.offerTitle.trim(),
        percentage: parseInt(formData.offerPercentage, 10),
      },
    };

    try {
      const response = await fetch("/api/builder/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update builder");
      }

      const result = await response.json();
      setBuilders(
        builders.map((builder) =>
          builder._id === currentItemId ? result.builder : builder
        )
      );
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating builder:", error);
      setError(`Failed to update builder: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await handleUpdate();
      return;
    }

    setLoading(true);
    setError(null);

    const itemData = {
      developer: formData.developer.trim(),
      video: { url: formData.videoUrl.trim() },
      additionalDocuments: formData.additionalDocuments,
      offer: {
        title: formData.offerTitle.trim(),
        percentage: parseInt(formData.offerPercentage, 10),
      },
      createdBy: user?.user?.name,
    };

    try {
      const response = await fetch("/api/builder/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error(`Failed to add builder`);
      fetchBuilders();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding builder:", error);
      setError("Failed to add builder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasRequiredRole =
    user?.user?.role === "Super-Admin" ||
    user?.user?.role === "Admin" ||
    user?.user?.role === "Associate-Member";

  if (!hasRequiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">You don't have permission to view this page.</p>
        <button
          onClick={() => window.history.back()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Builder Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          Add Builder
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {fetchLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size={40} className="animate-spin text-purple-600" />
        </div>
      ) : builders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ListPlus size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Builders Found</h3>
          <p className="text-gray-500">Click 'Add Builder' to create your first builder entry</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map((builder) => (
            <div
              key={builder._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{builder.developer}</h3>

                <div className="flex items-center text-gray-500 mb-2">
                  <Video size={16} className="mr-2 flex-shrink-0" />
                  <a
                    href={builder.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Video
                  </a>
                </div>

                {builder.additionalDocuments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-1">Documents:</p>
                    {builder.additionalDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center text-blue-500 mb-1">
                        <FileText size={16} className="mr-2 flex-shrink-0" />
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {trimText(doc.name)}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center text-gray-500 mb-4">
                  <Percent size={16} className="mr-2 flex-shrink-0" />
                  <span>
                    {builder.offer.title}: {builder.offer.percentage}%
                  </span>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={() => handleEdit(builder)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => handleDelete(builder._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Builder" : "Add New Builder"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Developer Name*</label>
                <input
                  name="developer"
                  type="text"
                  value={formData.developer}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Video URL*</label>
                <input
                  name="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Additional Documents (Optional)
                </label>
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="document"
                      className="hidden"
                      onChange={handleDocumentChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    />
                    <label
                      htmlFor="document"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300"
                    >
                      <FileText size={18} />
                      Add Document
                    </label>
                  </div>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                  </div>
                )}
                {formData.additionalDocuments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-700 font-medium mb-1">Uploaded Documents:</p>
                    {formData.additionalDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded mb-2"
                      >
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Offer Title*</label>
                  <input
                    name="offerTitle"
                    type="text"
                    value={formData.offerTitle}
                    onChange={handleInputChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Offer Percentage*</label>
                                   <input
                    name="offerPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.offerPercentage}
                    onChange={handleInputChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{isEditMode ? "Update Builder" : "Add Builder"}</>
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

