// config/mongodb.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/grocery`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB database connected successfully");
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

export default connectDB;


