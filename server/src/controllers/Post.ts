import { RequestHandler } from "express";
import Post from "../models/Post";
import { POST_LIMIT } from "../constants/constants";

// create a post

// fetch a post

// fetch posts (sorting and pagination)
export const fetchPosts: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = POST_LIMIT || 10;
    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const count = await Post.countDocuments();
    res.success(200, "success", "Posts fetched", { posts, count });
  } catch (error) {
    res.error(500, "success", "Something went wrong", error);
  }
};
// update post

// disable/enable post

// fetch meta details

// get posts for user (filter for drafts)
