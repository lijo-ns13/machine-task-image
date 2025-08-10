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
        `${import.meta.env.VITE_API_BASE_UR}/api/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newImage: ImageDTO = res.data.data;
      console.log("newImagedto", newImage);
      onUploaded(newImage);
      toast.success("Image addedd successfully");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border p-4 rounded shadow bg-white">
      <h3 className="text-lg font-bold mb-2">Single Image Upload</h3>
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="w-48 h-48 object-cover rounded mb-2"
      />
      <input
        type="text"
        placeholder="Enter image title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />
      {error && <div className="text-red-600 mt-1">{error}</div>}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default SingleImageUploader;
