import React, { useState } from "react";
import type { ImageDTO } from "../services/imgService";
import userAxios from "../types/axios";
import { toast } from "react-toastify";

interface Props {
  file: File;
  userId: string;
  onClose: () => void;
  onUploaded: (newImage: ImageDTO) => void;
}

const SingleImageUploader: React.FC<Props> = ({
  file,
  userId,
  onClose,
  onUploaded,
}) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("media", file);
    formData.append("title", title.trim());
    formData.append("userId", userId);

    try {
      setLoading(true);
      const res = await userAxios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newImage: ImageDTO = res.data.data;
      onUploaded(newImage);
      toast.success("Image added successfully");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Upload Image
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Image Preview */}
        <div className="w-full md:w-1/2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 flex justify-center items-center">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="rounded-lg object-cover w-full h-48"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Enter image title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`flex-1 bg-green-600 text-white py-2 rounded-lg font-medium transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleImageUploader;
