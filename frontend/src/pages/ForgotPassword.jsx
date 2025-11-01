import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/forgotPassword", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending email");
    }
  };

  return (
  <div className="h-120 flex items-center justify-center bg-green-200 px-4 rounded-2xl">
  <div className="max-w-md w-full bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 ">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
      <p className="text-sm text-gray-600">
        Enter your registered email to receive a reset link
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
      >
        Send Reset Link
      </button>
    </form>

    {message && (
      <p className="text-center text-sm text-green-800 font-medium mt-4">
        {message}
      </p>
    )}

    <div className="text-center">
      <p className="text-sm text-gray-600">
        Remembered your password?{" "}
        <Link
          to="/login"
          className="text-green-900 hover:underline font-medium"
        >
          Back to Login
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default ForgotPassword;
