import { model, Schema, Types } from "mongoose";

interface FollowValues {
  user_id: Types.ObjectId;
  follower_id: Types.ObjectId;
  created_at: Date;
}

const followSchema = new Schema<FollowValues>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    follower_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Follow = model("Follow", followSchema);
export default Follow;
