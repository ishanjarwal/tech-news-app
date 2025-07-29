"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const followSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    follower_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
}, { timestamps: { createdAt: "created_at" } });
const Follow = (0, mongoose_1.model)("Follow", followSchema);
exports.default = Follow;
