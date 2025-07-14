// src/lib/mongodb.ts
import mongoose from "mongoose";

// Blog Schema (you can customize this as needed)
const BlogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  text: { type: String, required: true },
});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

// Connection function
export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env.local");

  await mongoose.connect(uri, {
    dbName: "nextjs-blog", // or your DB name
  });
}
