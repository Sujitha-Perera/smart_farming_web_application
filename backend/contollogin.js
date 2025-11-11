// loginController.js
import User from './model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req, res) => {
  const { email, password } = req.body;



  // 1️ Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // 2️ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // 3️ Compare password securely using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4️ Create JWT payload
    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };

    // 5️ Sign JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 6️ Send response
    res.status(200).json({
      message: "Login successful!",
      token, 
      user: { id: user._id ,name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
