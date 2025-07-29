"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadContentImage = exports.fetchPagePosts = exports.fetchTrendingPosts = exports.uploadThumbnailTemporary = exports.deletePostThumbnail = exports.uploadPostThumbnail = exports.deletePost = exports.fetchAuthorPosts = exports.fetchPostMetaData = exports.changePostStatus = exports.updatePost = exports.fetchPosts = exports.fetchPostById = exports.fetchPost = exports.createPost = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants/constants");
const Category_1 = __importDefault(require("../models/Category"));
const Like_1 = __importDefault(require("../models/Like"));
const Post_1 = __importDefault(require("../models/Post"));
const SubCategory_1 = __importDefault(require("../models/SubCategory"));
const Tag_1 = __importDefault(require("../models/Tag"));
const calcReadingTime_1 = __importDefault(require("../utils/calcReadingTime"));
const slugify_1 = __importDefault(require("../utils/slugify"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const TempImage_1 = __importDefault(require("../models/TempImage"));
// create a post
const createPost = async (req, res) => {
    const user = req.user;
    if (!user)
        throw new Error();
    const userId = user._id;
    try {
        const { title, summary, content, tagIds, categoryId, subCategoryId, status, thumbnail, } = req.body;
        const slug = (0, slugify_1.default)(title);
        const reading_time_sec = (0, calcReadingTime_1.default)(content);
        const newPost = new Post_1.default({
            author_id: userId,
            title,
            slug,
            summary,
            content,
            tags: tagIds,
            category: new mongoose_1.default.Types.ObjectId(categoryId),
            subCategory: new mongoose_1.default.Types.ObjectId(subCategoryId),
            reading_time_sec,
            status: status || "draft",
            thumbnail,
        });
        if (thumbnail?.public_id) {
            const doc = await TempImage_1.default.findOne({
                "image.public_id": thumbnail.public_id,
            });
            if (doc) {
                await doc.deleteOne();
            }
        }
        await newPost.save();
        const message = newPost.status === "published" ? "Post published" : "Draft Saved";
        res.success(200, "success", message, {
            slug: newPost.slug,
        });
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.createPost = createPost;
// fetch a post
const fetchPost = async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await Post_1.default.aggregate([
            { $match: { slug, status: "published" } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                fullname: 1,
                                avatar: "$avatar.url",
                                cover_image: "$cover_image.url",
                                bio: 1,
                                joined: "$created_at",
                            },
                        },
                    ],
                },
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: { name: 1, slug: 1, _id: 0, thumbnail: 1, summary: 1 },
                        },
                    ],
                },
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory",
                    pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
                },
            },
            { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags",
                    pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
                },
            },
            {
                $addFields: {
                    thumbnail: "$thumbnail.url",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "totalLikes",
                },
            },
            {
                $addFields: {
                    totalLikes: { $size: "$totalLikes" },
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "totalComments",
                },
            },
            {
                $addFields: {
                    totalComments: { $size: "$totalComments" },
                },
            },
            {
                $addFields: {
                    totalViews: "$views_count",
                },
            },
            {
                $project: {
                    // _id: 0,
                    __v: 0,
                    author_id: 0,
                    views_count: 0,
                },
            },
        ]);
        const post = result.length > 0 ? result[0] : null;
        if (!post) {
            res.error(400, "error", "Post not found", null);
            return;
        }
        await Post_1.default.updateOne({ _id: post._id }, { $inc: { views_count: 1 } }, { timestamps: false });
        res.success(200, "success", "Post fetched", post);
        return;
    }
    catch (error) {
        console.log(error);
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchPost = fetchPost;
const fetchPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const postId = new mongoose_1.Types.ObjectId(id);
        const result = await Post_1.default.aggregate([
            { $match: { _id: postId } },
            // Lookup category
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            // Lookup subCategory
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory",
                },
            },
            { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },
            // Lookup author
            {
                $lookup: {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        { $project: { username: 1, fullname: 1, avatar: 1, _id: 0 } },
                    ],
                },
            },
            {
                $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
            },
            // {
            //   $project: {
            //     // Only select desired author fields
            //     "author_id.fullname": 1,
            //     "author_id.username": 1,
            //     "author_id.avatarURL": 1,
            //     "author_id._id": 1,
            //     // Include all other post fields
            //     title: 1,
            //     content: 1,
            //     views_count: 1,
            //     category: 1,
            //     subCategory: 1,
            //     tags: 1,
            //     createdAt: 1,
            //     updatedAt: 1,
            //   },
            // },
            // Lookup tags
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags",
                },
            },
        ]);
        const post = result[0];
        if (!post) {
            res.error(400, "error", "Post not found", null);
            return;
        }
        const likeCount = await Like_1.default.countDocuments({ post_id: post._id });
        // Increment views_count manually (not through aggregation)
        await Post_1.default.updateOne({ _id: post._id }, { $inc: { views_count: 1 } });
        res.success(200, "success", "Post fetched", {
            ...post,
            likes: likeCount,
        });
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchPostById = fetchPostById;
// fetch posts (sorting and pagination)
const fetchPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = constants_1.POST_LIMIT;
        const skip = (page - 1) * limit;
        const sortField = req.query.sort || "created_at";
        const sortOrder = req.query.order === "asc" ? 1 : -1;
        const { category, subcategory, tag, author } = req.query;
        // Pre-fetch related IDs only if slugs exist
        const [categoryDoc, tagDoc] = await Promise.all([
            category ? Category_1.default.findOne({ slug: category }).select("_id") : null,
            tag ? Tag_1.default.findOne({ slug: tag }).select("_id") : null,
        ]);
        const subCategoryDoc = categoryDoc && subcategory
            ? await SubCategory_1.default.findOne({
                slug: subcategory,
                category: categoryDoc._id,
            }).select("_id")
            : null;
        const matchStage = { status: "published" };
        if (categoryDoc)
            matchStage.category = categoryDoc._id;
        if (subCategoryDoc)
            matchStage.subCategory = subCategoryDoc._id;
        if (tagDoc)
            matchStage.tags = { $in: [tagDoc._id] };
        const pipeline = [{ $match: matchStage }];
        // Lookups and optional author match
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "author_id",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: "$avatar.url",
                            _id: 0,
                        },
                    },
                ],
            },
        }, { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } });
        if (author) {
            pipeline.push({ $match: { "author.username": author } });
        }
        pipeline.push({
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        }, { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory",
            },
        }, { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } }, {
            $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags",
            },
        }, { $addFields: { thumbnail: "$thumbnail.url" } }, {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post_id",
                as: "totalLikes",
            },
        }, {
            $addFields: {
                totalLikes: { $size: "$totalLikes" },
            },
        }, {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post_id",
                as: "totalComments",
            },
        }, {
            $addFields: {
                totalComments: { $size: "$totalComments" },
            },
        }, {
            $addFields: {
                totalViews: "$views_count",
            },
        }, {
            $project: {
                __v: 0,
                author_id: 0,
                views_count: 0,
            },
        }, { $sort: { [sortField]: sortOrder } }, { $skip: skip }, { $limit: limit });
        const posts = await Post_1.default.aggregate(pipeline);
        // Count total matching documents
        const total = await Post_1.default.countDocuments(matchStage);
        res.success(200, "success", "Posts fetched", {
            posts,
            total,
            count: posts.length,
            page,
            limit,
        });
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchPosts = fetchPosts;
// update post
const updatePost = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            res.error(401, "error", "Unauthorized access", null);
            return;
        }
        const userId = user._id;
        const postId = req.params.id;
        if (!mongoose_1.default.isValidObjectId(postId)) {
            res.error(400, "error", "Invalid post ID", null);
            return;
        }
        const post = await Post_1.default.findOne({ _id: postId, author_id: userId });
        if (!post) {
            res.error(404, "error", "Post not found or unauthorized", null);
            return;
        }
        const { title, summary, content, categoryId, subCategoryId, tagIds } = req.body;
        const updateFields = {};
        if (title) {
            updateFields.title = title;
            updateFields.slug = (0, slugify_1.default)(title);
        }
        if (summary)
            updateFields.summary = summary;
        if (content) {
            updateFields.content = content;
            updateFields.reading_time_sec = (0, calcReadingTime_1.default)(content);
        }
        if (categoryId && mongoose_1.default.isValidObjectId(categoryId)) {
            updateFields.category = new mongoose_1.default.Types.ObjectId(categoryId);
        }
        if (subCategoryId && mongoose_1.default.isValidObjectId(subCategoryId)) {
            updateFields.subCategory = new mongoose_1.default.Types.ObjectId(subCategoryId);
        }
        if (Array.isArray(tagIds)) {
            updateFields.tags = tagIds;
        }
        if (Object.keys(updateFields).length === 0) {
            res.error(400, "warning", "Nothing to update", null);
            return;
        }
        updateFields.updated_at = new Date();
        const updatedPost = await Post_1.default.findOneAndUpdate({ _id: postId, author_id: userId }, updateFields, { new: true });
        res.success(200, "success", "Post updated", {
            slug: updatedPost?.slug,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.updatePost = updatePost;
// change post status
const changePostStatus = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = req.params.id;
        const post = await Post_1.default.findOne({
            _id: id,
            author_id: userId,
            status: { $ne: "archived" },
        });
        if (!post) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const status = req.body.status === "draft"
            ? "draft"
            : "published";
        post.status = status;
        await post.save();
        res.success(200, "success", `Post status changed to ${status}`, {
            slug: post.slug,
            status: post.status,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.changePostStatus = changePostStatus;
// fetch meta details
const fetchPostMetaData = async (req, res) => {
    try {
        const slug = req.params.slug;
        const post = await Post_1.default.findOne({ slug }).populate("tags");
        if (!post) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        res.success(200, "success", "Post metadata fetched", {
            metaTitle: post.title,
            metaDescription: post.summary,
            metaImage: post.thumbnail?.url,
            metaTags: post.tags.map((tag) => tag.name),
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchPostMetaData = fetchPostMetaData;
// get posts for user (filter for drafts)
const fetchAuthorPosts = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const status = req.query.status === "draft"
            ? "draft"
            : "published";
        const page = parseInt(req.query.page) || 1;
        const limit = constants_1.POST_LIMIT || 10;
        const sortField = req.query.sort || "updated_at";
        const sortOrder = req.query.order === "asc" ? 1 : -1;
        const skip = (page - 1) * limit;
        const matchStage = { $match: { author_id: userId, status } };
        const posts = await Post_1.default.aggregate([
            matchStage,
            {
                $lookup: {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        { $project: { username: 1, fullname: 1, avatarURL: 1, _id: 0 } },
                    ],
                },
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                    // pipeline: [{ $project: { name: 1, slug: 1, _id: 1, thumbnail: 1, summary: 1 } }],
                },
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory",
                    // pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
                },
            },
            { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags",
                    // pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
                },
            },
            {
                $project: {
                    // _id: 0,
                    __v: 0,
                    author_id: 0,
                },
            },
            { $sort: { [sortField]: sortOrder } },
            { $skip: skip },
            { $limit: limit },
        ]);
        const countPipeline = [matchStage, { $count: "total" }];
        const countResult = await Post_1.default.aggregate(countPipeline);
        const totalCount = countResult[0]?.total || 0;
        res.success(200, "success", "posts fetched", {
            posts,
            totalCount,
            page,
            limit,
        });
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchAuthorPosts = fetchAuthorPosts;
// delete (disable) post
const deletePost = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const post = await Post_1.default.findOne({ _id: id, author_id: userId });
        if (!post) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        post.status = "archived";
        await post.save();
        res.success(200, "success", "Post deleted", null);
        return;
    }
    catch (error) {
        console.log(error);
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.deletePost = deletePost;
const uploadPostThumbnail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        if (!user)
            throw new Error();
        const image = req.body.image;
        if (!image)
            throw new Error();
        const existing = await Post_1.default.findOne({ _id: id, author_id: user._id });
        if (!existing)
            throw new Error();
        if (existing.thumbnail?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(existing.thumbnail.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while uploading", {});
                return;
            }
        }
        const post = await Post_1.default.findByIdAndUpdate(id, {
            $set: {
                thumbnail: {
                    public_id: image.public_id,
                    url: image.secure_url,
                    format: image.format,
                },
            },
        }, { new: true });
        res.success(200, "success", "Thumbnail uploaded", {
            url: image.secure_url,
        });
        return;
    }
    catch (error) {
        if (req.body?.image?.public_id) {
            await cloudinary_1.default.uploader.destroy(req.body.image.public_id);
        }
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.uploadPostThumbnail = uploadPostThumbnail;
const deletePostThumbnail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        if (!user)
            throw new Error();
        const existing = await Post_1.default.findOne({ _id: id, author_id: user._id });
        if (!existing)
            throw new Error();
        if (existing.thumbnail?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(existing.thumbnail.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while uploading", {});
                return;
            }
        }
        const post = await Post_1.default.findByIdAndUpdate(id, { $unset: { thumbnail: 1 } }, { new: true });
        res.success(200, "success", "Thumbnail removed", {});
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.deletePostThumbnail = deletePostThumbnail;
const uploadThumbnailTemporary = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const image = req.body.image;
        if (!image)
            throw new Error();
        await new TempImage_1.default({
            author_id: user._id,
            image: {
                public_id: image.public_id,
                url: image.secure_url,
                format: image.format,
            },
        }).save();
        res.success(200, "success", "Thumbnail uploaded", {
            public_id: image.public_id,
            url: image.secure_url,
            format: image.format,
        });
        return;
    }
    catch (error) {
        if (req.body?.image?.public_id) {
            await cloudinary_1.default.uploader.destroy(req.body.image.public_id);
        }
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.uploadThumbnailTemporary = uploadThumbnailTemporary;
const fetchTrendingPosts = async (req, res) => {
    try {
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
                    pipeline: [{ $project: { fullname: 1, username: 1 } }],
                },
            },
            {
                $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
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
                $limit: 5,
            },
            {
                $project: {
                    slug: 1,
                    title: 1,
                    _id: 1,
                    thumbnail: "$thumbnail.url",
                    author: 1,
                    updated_at: 1,
                },
            },
        ]);
        res.success(200, "success", "Fetched posts", trendingPosts);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.fetchTrendingPosts = fetchTrendingPosts;
const fetchPagePosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = constants_1.POST_LIMIT;
        const skip = (page - 1) * limit;
        const filter = req.query.filter?.toLowerCase() || "latest";
        const matchStage = { status: "published" };
        const pipeline = [{ $match: matchStage }];
        // Join likes to compute total likes per post
        pipeline.push({
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post_id",
                as: "likes",
            },
        });
        pipeline.push({
            $addFields: {
                likeCount: { $size: "$likes" },
            },
        });
        // Apply sorting based on filter
        switch (filter) {
            case "most-viewed":
                pipeline.push({ $sort: { views_count: -1 } });
                break;
            case "most-liked":
                pipeline.push({ $sort: { likeCount: -1 } });
                break;
            case "latest":
            default:
                pipeline.push({ $sort: { created_at: -1 } });
                break;
        }
        // Lookup and enrich author
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "author_id",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: "$avatar.url",
                            _id: 0,
                        },
                    },
                ],
            },
        }, { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } });
        // Lookup and enrich tags
        pipeline.push({
            $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags",
            },
        });
        pipeline.push({
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        }, {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
        });
        pipeline.push({
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory",
            },
        }, {
            $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true },
        });
        pipeline.push({
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post_id",
                as: "totalLikes",
            },
        }, {
            $addFields: { totalLikes: { $size: "$totalLikes" } },
        });
        pipeline.push({
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post_id",
                as: "totalComments",
            },
        }, {
            $addFields: { totalComments: { $size: "$totalComments" } },
        });
        pipeline.push({
            $addFields: {
                thumbnail: "$thumbnail.url",
                totalViews: "$views_count",
            },
        }, {
            $project: {
                __v: 0,
                author_id: 0,
                likes: 0,
            },
        }, { $skip: skip }, { $limit: limit });
        const posts = await Post_1.default.aggregate(pipeline);
        const total = await Post_1.default.countDocuments(matchStage);
        res.success(200, "success", "Posts fetched", {
            posts,
            total,
            count: posts.length,
            page,
            limit,
        });
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchPagePosts = fetchPagePosts;
const uploadContentImage = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const image = req.body.image;
        if (!image)
            throw new Error();
        res.success(200, "success", "Image uploaded", {
            public_id: image.public_id,
            url: image.secure_url,
            format: image.format,
        });
        return;
    }
    catch (error) {
        if (req.body?.image?.public_id) {
            await cloudinary_1.default.uploader.destroy(req.body.image.public_id);
        }
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.uploadContentImage = uploadContentImage;
