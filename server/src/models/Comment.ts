import { model, Schema, Types } from "mongoose";

interface CommentValues {
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
  parent_comment_id: Types.ObjectId | null;
  content: string;
  created_at: Date;
  updated_at: Date;
}

const commentSchema = new Schema<CommentValues>(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parent_comment_id: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    content: { type: String, required: true },
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

const Comment = model("Comment", commentSchema);
export default Comment;
