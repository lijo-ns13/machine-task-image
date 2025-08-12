import React, { useRef, useState } from "react";

import BulkImageUploader from "./BulkImageUploader";
import type { ImageDTO } from "../services/imgService";

interface AddImageSectionProps {
  userId: string;
  onImageUploaded: (newImage: ImageDTO[]) => void;
}

const AddImageSection: React.FC<AddImageSectionProps> = ({
  userId,
  onImageUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    setSelectedFiles(files);
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleAddImageClick}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Image
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="mt-6">
        {/* {selectedFiles.length === 1 && userId && (
          <SingleImageUploader
            file={selectedFiles[0]}
            userId={userId}
            onClose={clearSelection}
            onUploaded={onImageUploaded}
          />
        )} */}

        {selectedFiles.length > 0 && userId && (
          <BulkImageUploader
            files={selectedFiles}
            userId={userId}
            onClose={clearSelection}
            onUploaded={onImageUploaded}
          />
        )}
      </div>
    </div>
  );
};

export default AddImageSection;
