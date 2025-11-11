import User from './model/userModel.js';
import bcrypt from 'bcryptjs'; //  Add this import

export const registerUser = async (req, res) => {
  // 1️ Get data from request body
  const { name, email, password, rpassword } = req.body;

  // 2️ Validate fields
  if (!name || !email || !password || !rpassword) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (password !== rpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // 3️ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 4️ Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5 Create new user with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // ✅ store the hash, not plain text
    });

    // 6️ Save user to database
    await newUser.save();

    // 7️ Send success response
    res.status(201).json({
      message: "User registered successfully!",
      user: { name: newUser.name, email: newUser.email },
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
