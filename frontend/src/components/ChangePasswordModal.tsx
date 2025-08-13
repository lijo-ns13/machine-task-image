import { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../services/imgService";
import { useAppSelector } from "../hooks/useAppSelector";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useAppSelector((state) => state.auth);
  const [formError, setFormError] = useState("");

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let valid = true;

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Must be at least 8 chars, include uppercase, lowercase, and a number";
      valid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (!id) {
        toast.error("User ID not found");
        return;
      }
      await changePassword(currentPassword, newPassword, id);

      toast.success("Password updated successfully");
      onClose();
    } catch (error: any) {
      console.log("ery:", error);
      setFormError(error.message || "Something went wrong. Please try again.");
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setFormError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Change Password
        </h2>
        {formError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={show.currentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    currentPassword: !prev.currentPassword,
                  }))
                }
                className="absolute inset-y-0 right-3 text-sm text-gray-500"
              >
                {show.currentPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={show.newPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    newPassword: !prev.newPassword,
                  }))
                }
                className="absolute inset-y-0 right-3 text-sm text-gray-500"
              >
                {show.newPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={show.confirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
                className="absolute inset-y-0 right-3 text-sm text-gray-500"
              >
                {show.confirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
