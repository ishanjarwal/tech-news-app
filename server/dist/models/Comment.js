"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    post_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    parent_comment_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
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
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});
const Comment = (0, mongoose_1.model)("Comment", commentSchema);
exports.default = Comment;
