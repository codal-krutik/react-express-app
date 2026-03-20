import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB
    } = process.env;

    if (!MONGO_HOST || !MONGO_PORT || !MONGO_DB) {
      throw new Error("Missing MongoDB environment variables");
    }

    const mongoURI: string = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection failed:", error.message);
    } else {
      console.error("❌ MongoDB connection failed:", error);
    }
    process.exit(1);
  }
};
