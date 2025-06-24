import mongoose, { Document, Schema } from "mongoose";

interface RefreshTokenValues {
  user_id: Schema.Types.ObjectId;
  token: string;
  created_at: Date;
  updated_at: Date;
}

const refreshTokenSchema = new mongoose.Schema<RefreshTokenValues>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

refreshTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 } // auto delete after 7 days
);

const RefreshToken = mongoose.model<RefreshTokenValues>(
  "refresh_token",
  refreshTokenSchema
);
export default RefreshToken;
