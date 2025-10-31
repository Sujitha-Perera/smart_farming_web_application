import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
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
      // ✅ Payload unchanged
      const payload = { email, password };
      
      // ✅ POST request to backend login route
      const response = await axios.post('http://localhost:3001/api/login', payload);

      console.log('Login successful:', response.data);
      alert(response.data.message);

      // ✅ Save JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // ✅ Save user info in localStorage
      localStorage.setItem('farmerName', JSON.stringify(response.data.user));

      navigate('/dashboard'); 
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-3/4 flex items-center justify-center bg-green-200 px-4 rounded-2xl">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mt-5">LOGIN</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/45 p-8 rounded-lg shadow-md space-y-6">
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
              />
            </div>

            {/* 👇 ADDED Forgot Password link */}
            <div className="flex justify-end text-sm">
              <Link to="/forgot-password" className="font-medium text-green-900 hover:text-green-700/80 hover:underline">
                Forgot your password?
              </Link>
            </div>
            {/* 👆 END ADDED Forgot Password link */}

            <div className="flex-col items-center justify-between">
              
              {/* ❌ REMOVED "Remember me" checkbox section entirely */}

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md"
              >
                Login
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mb-5">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button type="button" className="text-green-900 hover:text-green-700/80 hover:underline font-medium">
              <Link to="/signup"> Sign up here </Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;