import { Schema } from "mongoose";
import { IMAGE_FORMATS } from "../constants/constants";
import { string } from "zod";

export interface ImageValues {
  public_id: string;
  url: string;
  format: (typeof IMAGE_FORMATS)[number];
  created_at: Date;
  updated_at: Date;
}

const imageSchema = new Schema<ImageValues>(
  {
    public_id: { type: String, unique: true, index: true },
    url: { type: String, required: true },
    format: { type: String, enum: IMAGE_FORMATS, reqired: true },
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
    _id: false,
  }
);

export default imageSchema;
