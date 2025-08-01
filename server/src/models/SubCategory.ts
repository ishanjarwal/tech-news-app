import mongoose, { Document, Schema, Types } from "mongoose";

interface SubCategoryValues extends Document {
  name: string;
  category: Types.ObjectId;
  slug: string;
  summary?: string;
  created_at: Date;
  updated_at: Date;
}

const subCategorySchema = new mongoose.Schema<SubCategoryValues>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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

const SubCategory = mongoose.model<SubCategoryValues>(
  "SubCategory",
  subCategorySchema
);
export default SubCategory;
