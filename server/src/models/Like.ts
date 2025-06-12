import { Document, model, Schema, Types } from "mongoose";

interface LikeValues extends Document {
  author_id: Types.ObjectId;
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
  created_at: Date;
}

const likeSchema = new Schema<LikeValues>({
  author_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  post_id: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const Like = model<LikeValues>("Like", likeSchema);
export default Like;
