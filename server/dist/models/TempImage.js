"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Image_1 = __importDefault(require("./Image"));
const tempImageValues = new mongoose_1.default.Schema({
    author_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    image: { type: Image_1.default, required: true },
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
const TempImage = mongoose_1.default.model("temp_images", tempImageValues);
exports.default = TempImage;
