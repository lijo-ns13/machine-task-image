import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import Navbar from "../components/Navbar";
import BulkImageUploader from "../components/BulkImageUploader";
import SingleImageUploader from "../components/SingleImageUploader";
import {
  getUserImages,
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
    </div>
  );
}

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
    </div>
  );
}

export default HomePage;
