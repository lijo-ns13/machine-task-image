import React, { useState } from "react";

import type { ImageDTO } from "../services/imgService";
import userAxios from "../types/axios";

interface Props {
  files: File[];
  userId: string;
  onClose: () => void;
  onUploaded: (newImage: ImageDTO) => void;
}

interface ImageWithTitle {
  file: File;
  title: string;
}

const BulkImageUploader: React.FC<Props> = ({
  files,
  userId,
  onClose,
  onUploaded,
}) => {
  const [images, setImages] = useState<ImageWithTitle[]>(
    files.map((file) => ({ file, title: "" }))
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  const handleTitleChange = (index: number, title: string) => {
    const updated = [...images];
    updated[index].title = title;
    setImages(updated);
  };

  const hasDuplicateTitles = (): boolean => {
    const titles = images.map((img) => img.title.trim().toLowerCase());
    const unique = new Set(titles);
    return titles.length !== unique.size || titles.some((t) => t === "");
  };

  const handleUpload = async () => {
    setErrors([]);
    setSuccess([]);

    if (hasDuplicateTitles()) {
      setErrors(["Each image must have a unique, non-empty title."]);
      return;
    }

    for (const img of images) {
      const formData = new FormData();
      formData.append("media", img.file);
      formData.append("title", img.title.trim());
      formData.append("userId", userId);

      try {
        const res = await userAxios.post(
          `${import.meta.env.VITE_API_BASE_UR}/api/image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const newImage: ImageDTO = res.data.data;
        onUploaded(newImage);
        setSuccess((prev) => [...prev, `${img.title} uploaded successfully`]);
      } catch (err: any) {
        setErrors((prev) => [
          ...prev,
          `${img.title} upload failed: ${
            err?.response?.data?.message || "Unknown error"
          }`,
        ]);
      }
    }

    onClose();
  };

  return (
    <div className="mt-4 border p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-4">Bulk Image Upload</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={index} className="border p-2 rounded">
            <img
              src={URL.createObjectURL(img.file)}
              alt={`preview-${index}`}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <input
              type="text"
              value={img.title}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              placeholder="Enter unique title"
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 text-red-600">
          {errors.map((err, i) => (
            <div key={i}>⚠️ {err}</div>
          ))}
        </div>
      )}

      {success.length > 0 && (
        <div className="mt-4 text-green-600">
          {success.map((msg, i) => (
            <div key={i}>✅ {msg}</div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Upload All
      </button>
    </div>
  );
};

export default BulkImageUploader;
