import React, { useState } from "react";
import { SignUpUser } from "../services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    // Name at least 4 chars
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    } else if (data.name.trim().length < 4) {
      newErrors.name = "Name must be at least 4 characters";
    }

    // Phone number validation: 10 digits (you can adjust as needed)
    const phoneRegex = /^[0-9]{10}$/;
    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(data.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    // Password validation: at least 6 chars (adjust if you want)
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password
    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined })); // clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await SignUpUser(formData);

      // Assume backend returns { success: boolean, errors?: Record<string, string> }
      if (response.success === false && response.errors) {
        setErrors(response.errors);
        toast.error("Please fix the errors in the form");
        return;
      }

      toast.success("Signup successful");
      navigate("/signin");
    } catch (error: any) {
      console.error("Signup error:", error);

      // If your backend errors come inside error.response.data or similar, adapt here:
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error("Please fix the errors in the form");
      } else {
        toast.error("Error occurred during signup");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-4"
        noValidate
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400 focus:border-blue-400"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              errors.phoneNumber
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400 focus:border-blue-400"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400 focus:border-blue-400"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400 focus:border-blue-400"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400 focus:border-blue-400"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Sign in to existing account{" "}
          </span>
          <Link
            to="/signin"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
