import React, { useState } from "react";
import { SignUpUser } from "../services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (formData.password != formData.confirmPassword) {
      toast.error("passwords not matching");
      return;
    }
    try {
      SignUpUser(formData);
      toast.success("signup successfully");
      navigate("/signin");
    } catch (error) {
      console.log("error", error);
      toast.error("error occured");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />

        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Signin to existing account{" "}
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
