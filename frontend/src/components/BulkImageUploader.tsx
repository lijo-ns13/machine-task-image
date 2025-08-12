import React, { useState, useEffect } from "react";
import type { ImageDTO } from "../services/imgService";
import userAxios from "../types/axios";

interface Props {
  files: File[];
  userId: string;
  onClose: () => void;
  onUploaded: (newImages: ImageDTO[]) => void;
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.file as any));
    };
  }, [images]);

  const handleTitleChange = (index: number, title: string) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index].title = title;
      return updated;
    });
  };

  const validate = (): boolean => {
    const titles = images.map((img) => img.title.trim());
    if (titles.some((t) => !t)) {
      setError("Each image must have a title.");
      return false;
    }
    const unique = new Set(titles.map((t) => t.toLowerCase()));
    if (unique.size !== titles.length) {
      setError("Each image must have a unique title.");
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    setError(null);
    if (!validate()) return;

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append(
      "titles",
      JSON.stringify(images.map((img) => img.title.trim()))
    );
    images.forEach((img) => formData.append("media", img.file));

    try {
      setLoading(true);
      const res = await userAxios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data?.success) {
        onUploaded(res.data.data);
        onClose();
      } else {
        setError(res.data?.message || "Failed to upload images.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Bulk Image Upload
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, index) => {
          const objectUrl = URL.createObjectURL(img.file);
          return (
            <article
              key={index}
              className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <img
                src={objectUrl}
                alt={`Preview ${index + 1}`}
                loading="lazy"
                className="w-full h-40 object-cover rounded-md mb-3 select-none"
                onLoad={() => URL.revokeObjectURL(objectUrl)} // revoke after load
              />
              <label
                htmlFor={`title-${index}`}
                className="mb-1 font-medium text-gray-700"
              >
                Image Title
              </label>
              <input
                id={`title-${index}`}
                type="text"
                value={img.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                placeholder="Enter unique title"
                className="rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition px-3 py-2 text-gray-900"
                autoComplete="off"
              />
            </article>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 text-red-600 bg-red-50 border border-red-300 rounded px-4 py-2"
        >
          ⚠️ {error}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3 mt-8">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="inline-flex items-center justify-center rounded bg-green-600 px-6 py-3 text-white font-semibold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          aria-disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Upload All"
          )}
        </button>
        <button
          onClick={onClose}
          disabled={loading}
          className="rounded border border-gray-300 bg-white px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          aria-disabled={loading}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

export default BulkImageUploader;
