import { Schema, model } from "mongoose";

interface PasswordResetTokenValues {
  user_id: Schema.Types.ObjectId;
  token: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

const passwordResetTokenSchema = new Schema<PasswordResetTokenValues>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      default: Date.now,
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
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

passwordResetTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 10 } // auto delete after 10 minutes
);
const PasswordResetToken = model<PasswordResetTokenValues>(
  "password_reset_tokens",
  passwordResetTokenSchema
);
export default PasswordResetToken;
