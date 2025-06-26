import mongoose, { Document, Schema, Types } from "mongoose";
import { POST_STATUS } from "../constants/constants";
import imageSchema, { ImageValues } from "./Image";

interface PostValues extends Document {
  author_id: Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  category: Types.ObjectId | null;
  subCategory: Types.ObjectId | null;
  content: string;
  thumbnail?: ImageValues;
  reading_time_sec: number;
  status: (typeof POST_STATUS)[number];
  tags: Types.ObjectId[];
  views_count: number;
  created_at: Date;
  updated_at: Date;
}

const postSchema = new mongoose.Schema<PostValues>(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: imageSchema,
    },
    reading_time_sec: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: POST_STATUS,
      default: "draft",
    },
    views_count: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
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

const Post = mongoose.model<PostValues>("post", postSchema);
export default Post;
