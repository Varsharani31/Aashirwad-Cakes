import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not found in .env file. Running in offline fallback mode.");
    return;
  }

  try {
    mongoose.set('bufferCommands', false); // Disable buffering to detect offline mode instantly
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error. Running in fallback mode without DB.");
  }
};
