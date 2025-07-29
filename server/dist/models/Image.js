"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const imageSchema = new mongoose_1.Schema({
    public_id: { type: String, unique: true, sparse: true },
    url: { type: String, required: true },
    format: { type: String, enum: constants_1.IMAGE_FORMATS, reqired: true },
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
    _id: false,
});
exports.default = imageSchema;
