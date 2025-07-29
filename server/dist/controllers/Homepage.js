"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHomepageData = void 0;
exports.getTrendingPosts = getTrendingPosts;
exports.getTopTags = getTopTags;
exports.getTopCategoryPosts = getTopCategoryPosts;
exports.getRecentPosts = getRecentPosts;
const Post_1 = __importDefault(require("../models/Post"));
const Category_1 = __importDefault(require("../models/Category"));
const fetchHomepageData = async (req, res) => {
    try {
        const [trendingPosts, topTags, categoryPosts, recentPosts] = await Promise.all([
            getTrendingPosts(),
            getTopTags(),
            getTopCategoryPosts(),
            getRecentPosts(),
        ]);
        res.success(200, "success", "Homepage data fetched", {
            trendingPosts,
            topTags,
            categoryPosts,
            recentPosts,
        });
        return;
    }
    catch (error) {
        res.error(500, "error", "Something went wrong", error);
        return;
    }
};
exports.fetchHomepageData = fetchHomepageData;
// utils/homepageService.ts
async function getTrendingPosts() {
    const now = new Date();
    const trendingPosts = await Post_1.default.aggregate([
        {
            $match: {
                status: "published", // Only published posts
            },
        },
        {
            $lookup: {
                localField: "author_id",
                foreignField: "_id",
                from: "users",
                as: "author",
                pipeline: [
                    { $project: { fullname: 1, username: 1, avatar: "$avatar.url" } },
                ],
            },
        },
        {
            $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                localField: "category",
                foreignField: "_id",
                from: "categories",
                as: "category",
                pipeline: [{ $project: { name: 1, slug: 1 } }],
            },
        },
        {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
        },
        {
            $addFields: {
                ageInHours: {
                    $divide: [
                        { $subtract: [now, "$created_at"] },
                        1000 * 60 * 60, // Convert ms to hours
                    ],
                },
            },
        },
        {
            $addFields: {
                trendingScore: {
                    $cond: {
                        if: { $lte: ["$ageInHours", 1] },
                        then: "$views_count",
                        else: { $divide: ["$views_count", "$ageInHours"] },
                    },
                },
            },
        },
        {
            $sort: { trendingScore: -1 },
        },
        {
            $limit: 10,
        },
        {
            $project: {
                slug: 1,
                title: 1,
                _id: 1,
                thumbnail: "$thumbnail.url",
                author: 1,
                created_at: 1,
                category: 1,
            },
        },
    ]);
    return trendingPosts;
}
async function getTopTags() {
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
    return tags;
}
async function getTopCategoryPosts() {
    const topCategories = await Post_1.default.aggregate([
        { $match: { status: "published" } },
        {
            $group: {
                _id: "$category",
                totalPosts: { $sum: 1 },
            },
        },
        { $sort: { totalPosts: -1 } },
        { $limit: 6 },
    ]);
    const categoryIds = topCategories.map((cat) => cat._id);
    const categories = await Category_1.default.find({ _id: { $in: categoryIds } }).lean();
    const result = await Promise.all(categories.map(async (category) => {
        const posts = await Post_1.default.aggregate([
            { $match: { category: category._id, status: "published" } },
            { $sort: { created_at: -1 } },
            { $limit: 6 },
            {
                $addFields: {
                    thumbnail: "$thumbnail.url",
                },
            },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    created_at: 1,
                    thumbnail: 1,
                },
            },
        ]);
        return {
            category,
            posts,
        };
    }));
    const categoryMap = Object.fromEntries(result.map((r) => [r.category._id.toString(), r]));
    return categoryIds.map((id) => categoryMap[id.toString()]);
}
async function getRecentPosts() {
    return await Post_1.default.aggregate([
        { $match: { status: "published" } },
        {
            $lookup: {
                from: "users",
                localField: "author_id",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    { $project: { username: 1, fullname: 1, avatar: "$avatar.url" } },
                ],
            },
        },
        { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                localField: "category",
                foreignField: "_id",
                from: "categories",
                as: "category",
                pipeline: [{ $project: { name: 1, slug: 1 } }],
            },
        },
        {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags",
            },
        },
        { $limit: 10 },
        { $sort: { created_at: -1 } },
        {
            $addFields: {
                thumbnail: "$thumbnail.url",
            },
        },
        {
            $project: {
                title: 1,
                slug: 1,
                thumbnail: 1,
                created_at: 1,
                summary: 1,
                author: 1,
                category: 1,
            },
        },
    ]);
}
