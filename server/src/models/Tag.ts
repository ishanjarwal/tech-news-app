import mongoose, { Document } from "mongoose";

export interface TagValues extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  slug: string;
  summary?: string;
  created_at: Date;
  updated_at: Date;
}

const tagSchema = new mongoose.Schema<TagValues>(
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

const Tag = mongoose.model<TagValues>("Tag", tagSchema);
export default Tag;
