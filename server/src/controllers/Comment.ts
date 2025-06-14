import { RequestHandler } from "express";
import mongoose from "mongoose";
import { COMMENT_LIMIT } from "../constants/constants";
import Comment from "../models/Comment";

// create a comment
export const createComment: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(""); // from req.user
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
    const userId = new mongoose.Types.ObjectId(""); // from req.user
    const id = req.params.id;
    const parent_comment_id = req.params.parent_comment_id;
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
    const id = req.params.id;
    const comments = await Comment.find({ post_id: id })
      .sort({ created_at: "desc" })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Comment.countDocuments({ post_id: id });
    res.success(200, "success", "comments fetched", {
      comments,
      total,
      count: comments.length,
      page,
      limit,
    });
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
// update a comment
export const updateComment: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(""); // from req.user
    const id = req.params.id;
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
    const userId = new mongoose.Types.ObjectId("");
    const id = req.params.id;
    const comment = await Comment.findOne({ _id: id, user_id: userId });
    if (!comment) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    await comment.deleteOne();
    res.success(200, "success", "comment deleted", null);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
