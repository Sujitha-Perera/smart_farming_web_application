import "./server.js";
import bcrypt from "bcryptjs";
import Admin from "./model/adminModel.js";

const createAdmin = async () => {
  const existing = await Admin.findOne({ email: "admin@smartagri.com" });
  if (existing) {
    console.log(" Admin already exists!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await Admin.create({
    name: "Admin",
    email: "admin@smartagri.com",
    password: hashedPassword,
  });

  console.log("✅ Admin created successfully!");
  process.exit(0);
};

createAdmin();
