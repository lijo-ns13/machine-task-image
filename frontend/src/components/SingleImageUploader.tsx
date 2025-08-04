import React, { useState } from "react";
import axios from "axios";

interface Props {
  file: File;
  userId: string;
  onClose: () => void;
}

const SingleImageUploader: React.FC<Props> = ({ file, userId, onClose }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

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
      await axios.post(`http://localhost:5000/api/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="mt-4 border p-4 rounded shadow">
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
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Upload
      </button>
    </div>
  );
};

export default SingleImageUploader;
