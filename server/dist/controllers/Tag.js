"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPopularTags = exports.searchTag = exports.deleteTag = exports.updateTag = exports.fetchTag = exports.fetchTags = exports.createTag = void 0;
const slugify_1 = __importDefault(require("../utils/slugify"));
const Tag_1 = __importDefault(require("../models/Tag"));
const Post_1 = __importDefault(require("../models/Post"));
const constants_1 = require("../constants/constants");
// create a tag
const createTag = async (req, res) => {
    try {
        const { name, summary } = req.body;
        const slug = (0, slugify_1.default)(name);
        const newTag = new Tag_1.default({
            name,
            slug,
            summary,
        });
        await newTag.save();
        res.success(200, "success", "Tag created", { tagId: newTag._id });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.createTag = createTag;
// Fetch all tags (with optional filtering, sorting, and pagination)
const fetchTags = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = constants_1.TAG_LIMIT;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const pipeline = [
            {
                $match: {
                    name: { $regex: search, $options: "i" },
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "tags",
                    as: "associatedPosts",
                },
            },
            {
                $addFields: {
                    totalPosts: { $size: "$associatedPosts" },
                },
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    summary: 1,
                    totalPosts: 1,
                },
            },
            {
                $sort: { totalPosts: -1 },
            },
            { $skip: skip },
            { $limit: limit },
        ];
        const tags = await Tag_1.default.aggregate(pipeline);
        const total = await Tag_1.default.countDocuments({
            name: { $regex: search, $options: "i" },
        });
        res.success(200, "success", "Tags fetched", {
            tags,
            total,
            count: tags.length,
            page,
            limit,
        });
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchTags = fetchTags;
// Fetch a tag by slug
const fetchTag = async (req, res) => {
    try {
        const { slug } = req.params;
        const tag = await Tag_1.default.findOne({ slug }).select("-_id -__v");
        if (!tag) {
            res.error(400, "error", "Tag not found", null);
            return;
        }
        res.success(200, "success", "Tag fetched", tag);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.fetchTag = fetchTag;
// Update a tag
const updateTag = async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await Tag_1.default.findById(id);
        if (!tag) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const updateFields = {
            ...(req.body.name && { name: req.body.name }),
            ...(req.body.summary && { summary: req.body.summary }),
            ...(req.body.name && { slug: (0, slugify_1.default)(req.body.name) }),
        };
        if (Object.keys(updateFields).length !== 0) {
            updateFields.updated_at = new Date(Date.now());
        }
        const updated = await Tag_1.default.findByIdAndUpdate(id, { $set: updateFields }, {
            new: true,
        }).select("-_id -__v");
        if (!updated) {
            res.error(400, "error", "Tag not found", null);
            return;
        }
        res.success(200, "success", "Tag updated", updated);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.updateTag = updateTag;
// Delete a tag (only if no posts use it)
const deleteTag = async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await Tag_1.default.findById(id);
        if (!tag) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const postCount = await Post_1.default.countDocuments({ tags: id });
        if (postCount > 0) {
            res.error(400, "error", "This tag cannot be deleted because it is associated with posts", null);
            return;
        }
        const deleted = await Tag_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.error(400, "error", "Invalid tag", null);
            return;
        }
        res.success(200, "success", "Tag deleted", null);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.deleteTag = deleteTag;
// search tags
const searchTag = async (req, res) => {
    const { q } = req.params;
    if (!q || typeof q !== "string") {
        res.error(400, "error", "Invalid request", null);
        return;
    }
    const searchRegex = (prefixOnly) => {
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(prefixOnly ? `^${escaped}` : escaped, "i");
    };
    try {
        const startsWithResults = await Tag_1.default.find({
            $or: [
                { name: searchRegex(true) },
                { slug: searchRegex(true) },
                { summary: searchRegex(true) },
            ],
        });
        const startsWithIds = new Set(startsWithResults.map((tag) => tag._id.toString()));
        const containsResults = await Tag_1.default.find({
            $or: [
                { name: searchRegex(false) },
                { slug: searchRegex(false) },
                { summary: searchRegex(false) },
            ],
        });
        const filteredContains = containsResults.filter((tag) => !startsWithIds.has(tag._id.toString()));
        const combined = [...startsWithResults, ...filteredContains];
        res.success(200, "success", "Tags fetched", combined);
    }
    catch (error) {
        res.error(500, "error", "Something went wrong", null);
        return;
    }
};
exports.searchTag = searchTag;
// fetch popular tags
const fetchPopularTags = async (req, res) => {
    try {
        const now = new Date();
        const tags = await Post_1.default.aggregate([
            {
                $match: {
                    status: "published",
                    tags: { $exists: true, $ne: [] },
                },
            },
            {
                $addFields: {
                    ageInHours: {
                        $divide: [{ $subtract: [now, "$created_at"] }, 1000 * 60 * 60],
                    },
                },
            },
            {
                $addFields: {
                    popularityScore: {
                        $cond: [
                            { $lte: ["$ageInHours", 1] },
                            "$views_count",
                            { $divide: ["$views_count", "$ageInHours"] },
                        ],
                    },
                },
            },
            {
                $unwind: "$tags",
            },
            {
                $group: {
                    _id: "$tags",
                    totalScore: { $sum: "$popularityScore" },
                },
            },
            {
                $sort: { totalScore: -1 },
            },
            {
                $limit: 20, // Top 20 tags
            },
            {
                $lookup: {
                    from: "tags", // collection name in MongoDB (should match actual collection)
                    localField: "_id",
                    foreignField: "_id",
                    as: "tagInfo",
                },
            },
            {
                $unwind: "$tagInfo",
            },
            {
                $project: {
                    _id: 0,
                    name: "$tagInfo.name",
                    slug: "$tagInfo.slug",
                },
            },
        ]);
        res.success(200, "success", "fetched tags", tags);
        return;
    }
    catch (err) {
        console.error(err);
        res.error(500, "error", "Something went wrong", null);
        return;
    }
};
exports.fetchPopularTags = fetchPopularTags;
