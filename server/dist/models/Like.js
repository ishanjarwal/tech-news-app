"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    author_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    post_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Post" },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
}, { timestamps: { createdAt: "created_at" } });
const Like = (0, mongoose_1.model)("Like", likeSchema);
exports.default = Like;
