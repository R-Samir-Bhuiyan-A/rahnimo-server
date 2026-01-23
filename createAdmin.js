import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "rahnimo@gmail.com";
    const password = "Rahnimo@123";

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const user = await User.create({
      name: "Super Admin",
      email,
      password,
      role: "admin",
      image: "https://placehold.co/400", // Required field
      isVerified: true,
    });

    if (user) {
      console.log("Admin user created successfully");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    } else {
      console.log("Failed to create admin user");
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
