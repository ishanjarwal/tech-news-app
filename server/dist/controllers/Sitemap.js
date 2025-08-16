"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPostSlugs = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const fetchPostSlugs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 250;
        const skip = (page - 1) * limit;
        const sortField = "created_at";
        const sortOrder = -1;
        const slugs = await Post_1.default.find({ status: "published" })
            .select("slug -_id")
            .sort({ sortField: sortOrder })
            .limit(limit)
            .skip(skip);
        res.success(200, "success", "slugs fetched for sitemap", slugs);
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchPostSlugs = fetchPostSlugs;
