import { RequestHandler } from "express";
import mongoose from "mongoose";
import { COMMENT_LIMIT } from "../constants/constants";
import Comment from "../models/Comment";
import Post from "../models/Post";
import { UserValues } from "../models/User";

// create a comment
export const createComment: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    const content = req.body.content;
    const newComment = new Comment({
      user_id: userId,
      post_id: id,
      content,
      parent_comment_id: null,
    });
    await newComment.save();
    res.success(200, "success", "comment saved", null);
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// reply to a comment
export const replyComment: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = new mongoose.Types.ObjectId(req.params.id);
    const post = await Post.findById(id);
    if (!post) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    const parent_comment_id = new mongoose.Types.ObjectId(
      req.params.parent_comment_id
    );

    const parentComment = await Comment.findById(parent_comment_id);
    if (!parentComment || parentComment.parent_comment_id) {
      res.error(400, "error", "Invalid request", null);
      return;
    }

    const content = req.body.content;
    const newComment = new Comment({
      user_id: userId,
      post_id: id,
      content,
      parent_comment_id,
    });
    await newComment.save();
    res.success(200, "success", "replied", null);
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// fetch post comments
export const fetchPostComments: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = COMMENT_LIMIT || 10;
    const id = new mongoose.Types.ObjectId(req.params.id);

    const matchStage = { $match: { post_id: id, parent_comment_id: null } };

    const comments = await Comment.aggregate([
      matchStage,
      // Get main comment user
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
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
              },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                content: 1,
                created_at: 1,
                updated_at: 1,
                "user.username": 1,
                "user.fullname": 1,
                "user.avatar": 1,
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
          "user.username": 1,
          "user.fullname": 1,
          "user.avatar": 1,
          replies: 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { updated_at: -1 } },
    ]);

    const countPipeline = [matchStage, { $count: "total" }];
    const countResult = await Comment.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    res.success(200, "success", "comments fetched", {
      comments,
      total,
    });
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};
// update a comment
export const updateComment: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = new mongoose.Types.ObjectId(req.params.id);
    const post = await Post.findById(id);
    if (!post) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    const comment = await Comment.findOne({ _id: id, user_id: userId });
    if (!comment) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    comment.content = req.body.content;
    comment.updated_at = new Date(Date.now());
    await comment.save();
    res.success(200, "success", "comment updated", null);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};
// delete a comment
export const deleteComment: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = new mongoose.Types.ObjectId(req.params.id);
    const post = await Post.findById(id);
    if (!post) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    const comment = await Comment.findOne({ _id: id, user_id: userId });
    if (!comment) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    if (!comment.parent_comment_id) {
      await Comment.deleteMany({ parent_comment_id: id });
    }
    const message = comment.parent_comment_id
      ? "reply deleted"
      : "comment deleted";
    await comment.deleteOne();
    res.success(200, "success", message, null);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};
