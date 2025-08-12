import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import Navbar from "../components/Navbar";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import AddImageSection from "../components/AddImageSecion";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, id: userId } = useAppSelector((state) => state.auth);
  const [images, setImages] = useState<ImageDTO[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageDTO | null>(null);

  useEffect(() => {
    if (isAuthenticated && window.location.pathname === "/login") {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const fetchImages = async (pageToLoad = 1) => {
    if (!userId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await getUserImages(userId, pageToLoad, 10);
      const cleanedImages = res.images.map((img) => ({
        ...img,
        id: String(img.id),
      }));

      setImages((prev) =>
        pageToLoad === 1 ? cleanedImages : [...prev, ...cleanedImages]
      );

      const { page, totalPages } = res.pagination;
      setHasMore(page < totalPages);

      setPage(pageToLoad);
    } finally {
      setLoadingMore(false);
    }
  };

  async function handleDelete(imageId: string) {
    console.log("handledelte debund");
    try {
      await deleteImage(imageId);
      setImages((prev) => prev.filter((image) => image.id !== imageId));
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

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      toast.error("Title cannot be empty or just spaces");
      return;
    }

    // Optional: minimum length check
    if (trimmedTitle.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    try {
      if (!userId) {
        toast.error("User ID not found");
        return;
      }
      await updateImage(editingImage.id, trimmedTitle, userId);
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id ? { ...img, title: trimmedTitle } : img
        )
      );
      toast.success("Image updated successfully");
      setEditingImage(null);
    } catch {
      toast.error("Title already exists");
    }
  }

  useEffect(() => {
    if (userId) fetchImages(1);
  }, [userId]);

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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Update Image
          </h2>
          <img
            src={image.s3key}
            alt={image.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new title"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(title)}
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  function SortableImage({ image }: { image: ImageDTO }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: image.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: isDragging ? "grabbing" : "grab",
      boxShadow: isDragging
        ? "0 10px 20px rgba(0,0,0,0.25)"
        : "0 4px 8px rgba(0,0,0,0.1)",
      zIndex: isDragging ? 50 : "auto",
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        // <-- Remove {...attributes} and {...listeners} here!
        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col select-none relative"
      >
        <div className="relative w-full h-48 sm:h-56 md:h-48 overflow-hidden">
          <img
            src={image.s3key}
            alt={image.title}
            className="object-cover w-full h-full"
            draggable={false}
          />
          {/* Drag handle - only this part is draggable */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 cursor-grab p-2 bg-white rounded shadow"
            aria-label="Drag handle"
            onClick={(e) => e.stopPropagation()} // Prevent drag interference
          >
            {/* A simple icon for drag handle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3
            className="text-lg font-semibold text-gray-900 truncate"
            title={image.title}
          >
            {image.title}
          </h3>
          <div className="mt-auto flex justify-between items-center pt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("clicked delete button for", image.id);
                handleDelete(image.id);
              }}
              className="text-red-600 hover:text-red-800 font-semibold transition"
              aria-label={`Delete ${image.title}`}
            >
              Delete
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpdate(image);
              }}
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-md transition"
              aria-label={`Update ${image.title}`}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        {userId && (
          <AddImageSection
            userId={userId}
            onImageUploaded={(newImages) =>
              setImages((prev) => [...newImages, ...prev])
            }
          />
        )}

        {images.length > 0 && (
          <section className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Your Image Gallery
              </h2>
              {hasChanges && (
                <button
                  onClick={handleSaveOrder}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow-lg transition"
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
                key={images.map((img) => img.id).join("-")}
                items={images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {images.map((img) => (
                    <SortableImage key={img.id} image={img} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {loadingMore && (
              <p className="text-center text-gray-500 mt-8">
                Loading more images...
              </p>
            )}
          </section>
        )}
      </main>

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
