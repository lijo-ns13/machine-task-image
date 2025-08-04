import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import Navbar from "../components/Navbar";
import BulkImageUploader from "../components/BulkImageUploader";
import SingleImageUploader from "../components/SingleImageUploader";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, id: userId } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    setSelectedFiles(files);
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <button
          onClick={handleAddImageClick}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Image
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Conditional Rendering Based on Selection */}
        <div className="mt-6">
          {selectedFiles.length === 1 && userId && (
            <SingleImageUploader
              file={selectedFiles[0]}
              userId={userId}
              onClose={clearSelection}
            />
          )}

          {selectedFiles.length > 1 && userId && (
            <BulkImageUploader
              files={selectedFiles}
              userId={userId}
              onClose={clearSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
