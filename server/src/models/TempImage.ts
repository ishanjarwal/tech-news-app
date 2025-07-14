import mongoose, { Document, Types } from "mongoose";
import imageSchema, { ImageValues } from "./Image";

export interface TempImageValues extends Document {
  author_id: Types.ObjectId;
  image: ImageValues;
  created_at: Date;
  updated_at: Date;
}

const tempImageValues = new mongoose.Schema<TempImageValues>(
  {
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: imageSchema, required: true },
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

const TempImage = mongoose.model<TempImageValues>(
  "temp_images",
  tempImageValues
);
export default TempImage;
