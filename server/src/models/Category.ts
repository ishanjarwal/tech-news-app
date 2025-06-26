import mongoose, { Document } from "mongoose";
import imageSchema, { ImageValues } from "./Image";

interface CategoryValues extends Document {
  name: string;
  slug: string;
  summary?: string;
  thumbnail?: ImageValues;
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
    },
    thumbnail: {
      type: imageSchema,
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

const Category = mongoose.model<CategoryValues>("Category", categorySchema);
export default Category;
