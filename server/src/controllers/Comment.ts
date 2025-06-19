import { RequestHandler } from "express";
import mongoose from "mongoose";
import { COMMENT_LIMIT } from "../constants/constants";
import Comment from "../models/Comment";

// create a comment
export const createComment: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b"); // from req.user
    const id = req.params.id;
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
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};

// reply to a comment
export const replyComment: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b"); // from req.user
    const id = new mongoose.Types.ObjectId(req.params.id);
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
    res.error(500, "error", "Something went wrong", error);
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
                "user.avatarURL": 1,
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
          "user.avatarURL": 1,
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
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
// update a comment
export const updateComment: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b"); // from req.user
    const id = new mongoose.Types.ObjectId(req.params.id);
    const comment = await Comment.findOne({ _id: id, user_id: userId });
    if (!comment) {
      res.error(404, "error", "invalid request", null);
      return;
    }
    if (!req.body.content || req.body.content.trim() === "") {
      res.error(403, "warning", "nothing to update", null);
      return;
    }
    comment.content = req.body.content;
    comment.updated_at = new Date(Date.now());
    await comment.save();
    res.success(200, "success", "comment updated", null);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
// delete a comment
export const deleteComment: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b");
    const id = new mongoose.Types.ObjectId(req.params.id);
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
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
