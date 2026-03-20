import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB
    } = process.env;

    const mongoURI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
