"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPostLikers = exports.fetchUserLikedPosts = exports.togglePostLike = exports.likedStatus = void 0;
const Like_1 = __importDefault(require("../models/Like"));
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
//  fetch post liked status
const likedStatus = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = req.params.id;
        const check = await Like_1.default.findOne({ post_id: id, user_id: userId });
        if (check) {
            res.success(200, "success", "Likes", { liked: true });
            return;
        }
        res.success(200, "success", "Doesn't like", { liked: false });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.likedStatus = likedStatus;
// toggle post like
const togglePostLike = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = req.params.id;
        const post = await Post_1.default.findById(id).select("author_id");
        if (!post) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const check = await Like_1.default.findOne({ post_id: id, user_id: userId });
        if (check) {
            await check.deleteOne();
            res.success(200, "success", "Post Unliked", { liked: false });
            return;
        }
        const newLike = new Like_1.default({
            post_id: id,
            user_id: userId,
            author_id: post?.author_id,
        });
        await newLike.save();
        res.success(200, "success", "Post liked", { liked: true });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.togglePostLike = togglePostLike;
// fetch user liked posts
const fetchUserLikedPosts = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const posts = await Like_1.default.aggregate([
            {
                $match: { user_id: userId },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "post_id",
                    foreignField: "_id",
                    as: "post",
                },
            },
            { $unwind: "$post" },
            {
                $lookup: {
                    from: "users",
                    localField: "post.author_id",
                    foreignField: "_id",
                    as: "author",
                },
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "post.category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            { $sort: { created_at: -1 } },
            {
                $project: {
                    _id: "$post._id",
                    title: "$post.title",
                    slug: "$post.slug",
                    thumbnail: "$post.thumbnail.url",
                    summary: "$post.summary",
                    created_at: "$post.created_at",
                    "author.fullname": "$author.fullname",
                    "author.username": "$author.username",
                    "author.avatar": "$author.avatar.url",
                    "category.name": "$category.name",
                    "category.slug": "$category.slug",
                },
            },
        ]);
        res.success(200, "success", "Liked posts fetched", posts);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchUserLikedPosts = fetchUserLikedPosts;
// fetch author post likes
const fetchPostLikers = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const post_id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const post = await Post_1.default.findById(post_id);
        if (!post) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const users = await Like_1.default.aggregate([
            { $match: { post_id, author_id: userId } },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    username: "$user.username",
                    fullname: "$user.fullname",
                    avatarURL: "$user.avatar",
                },
            },
        ]);
        res.success(200, "success", "Fetched post likers", users);
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchPostLikers = fetchPostLikers;
