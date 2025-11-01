import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3001/api/resetPassword/${token}`, { newPassword });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
          <div className="flex items-center justify-center h-110 bg-green-200 px-4 rounded-3xl">
            <div className="max-w-md w-full bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-sm text-gray-600">
                  Enter your new password to reset your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
                >
                  Reset Password
                </button>
              </form>

              {message && (
                <p className="text-center text-sm text-green-800 font-medium mt-4">
                  {message}
                </p>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Back to{" "}
                  <Link
                    to="/login"
                    className="text-green-900 hover:underline font-medium"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>

  );
};

export default ResetPassword;
