"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passwordResetTokenSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
passwordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 10 } // auto delete after 10 minutes
);
const PasswordResetToken = (0, mongoose_1.model)("password_reset_tokens", passwordResetTokenSchema);
exports.default = PasswordResetToken;
