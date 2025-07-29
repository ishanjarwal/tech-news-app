"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.fetchPostComments = exports.replyComment = exports.createComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants/constants");
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
// create a comment
const createComment = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = req.params.id;
        const post = await Post_1.default.findById(id);
        if (!post) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        const content = req.body.content;
        const newComment = new Comment_1.default({
            user_id: userId,
            post_id: id,
            content,
            parent_comment_id: null,
        });
        await newComment.save();
        res.success(200, "success", "comment added", {
            _id: newComment._id,
            content: newComment.content,
            created_at: newComment.created_at,
            user: {
                username: user.username,
                fullname: user.fullname,
                avatar: user.avatar?.url ?? undefined,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.createComment = createComment;
// reply to a comment
const replyComment = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const post = await Post_1.default.findById(id);
        if (!post) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        const parent_comment_id = new mongoose_1.default.Types.ObjectId(req.params.parent_comment_id);
        const parentComment = await Comment_1.default.findById(parent_comment_id);
        if (!parentComment || parentComment.parent_comment_id) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const content = req.body.content;
        const newComment = new Comment_1.default({
            user_id: userId,
            post_id: id,
            content,
            parent_comment_id,
        });
        await newComment.save();
        res.success(200, "success", "replied", {
            parent_id: parentComment._id,
            _id: newComment._id,
            content: newComment.content,
            created_at: newComment.created_at,
            user: {
                username: user.username,
                fullname: user.fullname,
                avatar: user.avatar?.url ?? undefined,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.replyComment = replyComment;
// fetch post comments
const fetchPostComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = constants_1.COMMENT_LIMIT || 10;
        const id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const matchStage = { $match: { post_id: id, parent_comment_id: null } };
        const comments = await Comment_1.default.aggregate([
            matchStage,
            // Get main comment user
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
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
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            // Get replies
            {
                $lookup: {
                    from: "comments",
                    let: { parentId: "$_id" },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$parent_comment_id", "$$parentId"] } },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "user",
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
                        },
                        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                content: 1,
                                created_at: 1,
                                updated_at: 1,
                                user: 1,
                            },
                        },
                        { $sort: { updated_at: -1 } },
                    ],
                    as: "replies",
                },
            },
            // Final projection
            {
                $project: {
                    content: 1,
                    created_at: 1,
                    updated_at: 1,
                    user: 1,
                    replies: 1,
                },
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $sort: { updated_at: -1 } },
        ]);
        const countPipeline = [matchStage, { $count: "total" }];
        const countResult = await Comment_1.default.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;
        res.success(200, "success", "comments fetched", {
            comments,
            total,
        });
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.fetchPostComments = fetchPostComments;
// update a comment
const updateComment = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const comment = await Comment_1.default.findOne({ _id: id, user_id: userId });
        const content = req.body.content;
        if (!comment) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        comment.content = content;
        await comment.save();
        res.success(200, "success", "comment updated", {
            id: comment._id,
            content: content,
            parent_comment_id: comment.parent_comment_id ?? undefined,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.updateComment = updateComment;
// delete a comment
const deleteComment = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const comment = await Comment_1.default.findOne({ _id: id, user_id: userId });
        if (!comment) {
            res.error(400, "error", "invalid request", null);
            return;
        }
        let totalDeleted = 0;
        if (!comment.parent_comment_id) {
            const deleted = await Comment_1.default.deleteMany({ parent_comment_id: id });
            totalDeleted += deleted.deletedCount;
        }
        const message = comment.parent_comment_id
            ? "reply removed"
            : "comment removed";
        await comment.deleteOne();
        totalDeleted += 1;
        res.success(200, "success", message, {
            comment_id: comment._id,
            parent_comment_id: comment.parent_comment_id ?? undefined,
            totalDeleted,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.deleteComment = deleteComment;
