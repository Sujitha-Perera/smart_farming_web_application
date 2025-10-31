import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rpassword, setrPassword] = useState('');

  // 1. Add a new state to hold all error messages
  const [errors, setErrors] = useState({});

  const navigate=useNavigate();

  // 2. This function checks for instant (frontend) errors
  const validateForm = () => {
    const newErrors = {};

    // Check for empty fields
    if (!name) newErrors.name = "Please enter your full name";
    if (!email) newErrors.email = "Please enter your email";
    if (!password) newErrors.password = "Please enter a password";
    
    // Check if passwords match (only if both are typed)
    if (password && rpassword && password !== rpassword) {
      newErrors.rpassword = "Passwords do not match";
    }

    setErrors(newErrors);
    
    // Return true if there are NO errors, false if there are errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 3. Run frontend validation first
    // If it's not valid, stop the submission
    if (!validateForm()) {
      return; 
    }

    // Clear old backend errors before submitting
    setErrors({}); 

    const payload = {
      name,
      email,
      password,
      rpassword
    };

    axios.post('http://localhost:3001/api/register', payload)
      .then(response => {
        // This is your "User registered successfully!" message
        console.log("Registration successful:", response.data);
        alert(response.data.message); 
        navigate('/login')
        
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setrPassword('');
      })
      .catch(error => {
        console.log("Axios Error:", error);

        // This is where "User already exists" or other backend errors appear
        if (error.response && error.response.data) {
          const backendErrorMessage = error.response.data.message;
          alert(backendErrorMessage); // Show in an alert

          // 4. Set the backend error in your state
          // We'll guess which field caused the error
          if (backendErrorMessage.includes("email")) {
            setErrors({ email: backendErrorMessage });
          } else {
            setErrors({ general: backendErrorMessage });
          }
        } else {
          alert("Registration failed. An unknown error occurred.");
        }
      });
  };

  return (
    <div className="min-h-3/4 flex items-center justify-center bg-green-200 px-4 rounded-2xl">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mt-5">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your new account
          </p>
        </div>
        
        {/* We moved onSubmit to the <form> tag */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/45 p-8 rounded-4xl shadow-md mb-5 space-y-6">
            
            {/* Display general errors here */}
            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                // Call validateForm onBlur (when user clicks away)  
                onBlur={validateForm} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your full name"
              />
              {/* 5. Show the error message right below the input */}
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onBlur={validateForm}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onBlur={validateForm}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Re-Enter Password Field */}
            <div>
              <label htmlFor="rpassword" className="block text-sm font-medium text-gray-700 mb-2">
                Re-Enter Password
              </label>
              <input
                id="rpassword"
                type="password"
                value={rpassword}
                // We validate as the user types AND on blur for instant feedback
                onBlur={validateForm}
                onChange={(e) => {
                  setrPassword(e.target.value);
                  // You can call validateForm() here too for real-time check
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Re-Enter your password"
              />
              {errors.rpassword && <p className="text-red-500 text-xs mt-1">{errors.rpassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit" 
              className="w-full bg-primary text-white py-2 px-4 rounded-md"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;