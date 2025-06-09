import mongoose, { Document } from "mongoose";

interface CategoryValues extends Document {
  name: string;
  slug: string;
  summary?: string;
  thumbnail?: string;
  created_at: Date;
  updated_at: Date;
}

const categorySchema = new mongoose.Schema<CategoryValues>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Category = mongoose.model<CategoryValues>("category", categorySchema);
export default Category;
