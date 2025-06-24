import mongoose, { Schema } from "mongoose";

interface VerificationValues {
  user_id: mongoose.Schema.Types.ObjectId;
  otp: string;
  expires_at: Date;
  created_at: Date;
}

const verificationSchema = new Schema<VerificationValues>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: { type: String, required: true },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
  },
  created_at: { type: Date, default: Date.now, expires: "10m" },
});

const VerificationModel = mongoose.model<VerificationValues>(
  "Verification",
  verificationSchema
);
export default VerificationModel;
