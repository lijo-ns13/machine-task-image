import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import Navbar from "../components/Navbar";
import BulkImageUploader from "../components/BulkImageUploader";
import SingleImageUploader from "../components/SingleImageUploader";
import {
  deleteImage,
  getUserImages,
  updateImage,
  updateImageOrder,
  type ImageDTO,
} from "../services/imgService";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, id: userId } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [images, setImages] = useState<ImageDTO[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageDTO | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  const fetchImages = async (pageToLoad = 1) => {
    if (!userId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await getUserImages(userId, pageToLoad, 10);
      const cleanedImages = res.images.map((img) => ({
        ...img,
        id: String(img.id),
      }));

      setImages((prev) => [...cleanedImages]);
      // setImages((prev) => [...prev, ...res.images]);

      // Compute hasMore based on pagination
      const { page, totalPages } = res.pagination;
      setHasMore(page < totalPages);

      setPage(pageToLoad);
    } finally {
      setLoadingMore(false);
    }
  };
  async function handleDelete(imageId: string) {
    try {
      await deleteImage(imageId);
      setImages(images.filter((image: ImageDTO) => image.id != imageId));
      toast.success("Image deleted successfully");
    } catch {
      toast.error("Failed to delete");
    }
  }
  function handleUpdate(image: ImageDTO) {
    setEditingImage(image);
  }

  async function saveUpdatedTitle(newTitle: string) {
    if (!editingImage) return;

    try {
      const updatedImage = await updateImage(editingImage.id, newTitle);
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id ? { ...img, title: newTitle } : img
        )
      );
      toast.success("Image updated successfully");
      setEditingImage(null);
    } catch {
      toast.error("Failed to update image");
    }
  }

  // Initial load
  useEffect(() => {
    if (userId) fetchImages(1);
  }, [userId]);

  // Scroll listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        hasMore &&
        !loadingMore
      ) {
        fetchImages(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loadingMore]);

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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);
    setImages(reordered);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    if (!userId) return;
    const newOrderIds = images.map((img) => img.id);
    console.log(newOrderIds, "neworderid");
    await updateImageOrder(userId, newOrderIds);
    setHasChanges(false);
  };
  function UpdateImageModal({
    image,
    onClose,
    onSave,
  }: {
    image: ImageDTO;
    onClose: () => void;
    onSave: (newTitle: string) => void;
  }) {
    const [title, setTitle] = useState(image.title);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Update Image</h2>
          <img
            src={image.s3key}
            alt={image.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-4"
            placeholder="Enter new title"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(title)}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  function SortableImage({ image }: { image: ImageDTO }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: image.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "manipulation", // Prevents scrolling during drag
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="border p-4 rounded shadow mb-4 flex items-center gap-6 bg-white cursor-grab"
      >
        <div {...listeners} className="cursor-grab">
          {/* Drag handle */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 10h16M4 14h16"
            />
          </svg>
        </div>

        <img
          src={image.s3key}
          alt={image.title}
          className="w-32 h-32 object-cover rounded-lg border"
        />
        <span className="font-medium text-lg text-gray-800">{image.title}</span>
        <button onClick={() => handleDelete(image.id)}>delete</button>
        <button
          onClick={() => handleUpdate(image)}
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Update
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
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
          {selectedFiles.length === 1 && userId && (
            <SingleImageUploader
              file={selectedFiles[0]}
              userId={userId}
              onClose={clearSelection}
              onUploaded={(newImage) =>
                setImages((prev) => [newImage, ...prev])
              }
            />
          )}

          {selectedFiles.length > 1 && userId && (
            <BulkImageUploader
              files={selectedFiles}
              userId={userId}
              onClose={clearSelection}
              onUploaded={(newImage) =>
                setImages((prev) => [newImage, ...prev])
              }
            />
          )}
        </div>

        {images.length > 0 && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Reorder Your Images</h2>
              {hasChanges && (
                <button
                  onClick={handleSaveOrder}
                  className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                >
                  ✅ Save Order
                </button>
              )}
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                key={images.map((img) => img.id).join("-")} // Force remount on reorder
                items={images.map((img) => img.id)}
                strategy={verticalListSortingStrategy}
              >
                {images.map((img) => (
                  <SortableImage key={img.id} image={img} />
                ))}
              </SortableContext>
            </DndContext>

            {loadingMore && (
              <p className="text-center text-gray-500 mt-4">
                Loading more images...
              </p>
            )}
          </div>
        )}
      </div>
      {editingImage && (
        <UpdateImageModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={saveUpdatedTitle}
        />
      )}
    </div>
  );
}

export default HomePage;
