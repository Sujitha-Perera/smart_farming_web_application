import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // ✅ Admin login payload
      const payload = { email, password };

      // ✅ POST request to admin login route in backend
      const response = await axios.post('http://localhost:3001/api/admin', payload);

      console.log('Admin login successful:', response.data);
      alert(response.data.message);

      // ✅ Save token and admin info
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));

      // ✅ Redirect to Admin Dashboard
      navigate('/user');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="h-130 flex items-center justify-center bg-green-200 px-4 rounded-2xl">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mt-5">ADMIN LOGIN</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage Smart Farming System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/45 p-8 rounded-lg shadow-md space-y-6">
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter password"
              />
            </div>

            <div className="flex justify-end text-sm">
              <p className="text-gray-600 italic">Admin access only</p>
            </div>

            <div className="flex-col items-center justify-between">
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
