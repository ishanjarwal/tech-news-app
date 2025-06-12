import { RequestHandler } from "express";
import Like from "../models/Like";
import Post from "../models/Post";
import mongoose from "mongoose";

// toggle post like
export const togglePostLike: RequestHandler = async (req, res) => {
  try {
    const userId = "6849905025c3c13ff2e36f6b"; // from req.user
    const id = req.params.id;

    const post = await Post.findById(id).select("author_id");
    if (!post) {
      res.error(404, "error", "Post not found", null);
      return;
    }

    const check = await Like.findOne({ post_id: id, user_id: userId });
    if (check) {
      await check.deleteOne();
      res.success(200, "success", "Post Unliked", null);
      return;
    }

    const newLike = new Like({
      post_id: id,
      user_id: userId,
      author_id: post?.author_id,
    });
    await newLike.save();
    res.success(200, "success", "Post liked", null);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// fetch user liked posts
export const fetchUserLikedPosts: RequestHandler = async (req, res) => {
  try {
    const userId = "6849905025c3c13ff2e36f6b"; //from req.user
    const posts = await Like.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userId) },
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
          as: "post.author",
        },
      },
      { $unwind: { path: "$post.author", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "post.category",
          foreignField: "_id",
          as: "post.category",
        },
      },
      { $unwind: { path: "$post.category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "post.subCategory",
          foreignField: "_id",
          as: "post.subCategory",
        },
      },
      {
        $unwind: {
          path: "$post.subCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "post.tags",
          foreignField: "_id",
          as: "post.tags",
        },
      },
      {
        $project: {
          _id: 0,
          likedAt: "$created_at",
          "post.author.fullname": 1,
          "post.author.username": 1,
          "post.author.avatarURL": 1,
          "post._id": 1,
          "post.title": 1,
          "post.slug": 1,
          "post.thumbnail": 1,
          "post.summary": 1,
          "post.category.name": 1,
          "post.category.slug": 1,
          "post.subCategory.name": 1,
          "post.subCategory.slug": 1,
          "post.tags.name": 1,
          "post.tags.slug": 1,
        },
      },
    ]);

    res.success(200, "success", "Liked posts fetched", posts);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// fetch author post likes
export const fetchAuthorPostLikes: RequestHandler = async (req, res) => {
  try {
    const author_id = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b"); // from req.user
    const id = new mongoose.Types.ObjectId(req.params.id);
    const likes = await Like.aggregate([
      { $match: { author_id, post_id: id } },
      {
        $lookup: {
          from: "posts",
          localField: "post_id",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: { path: "$post", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "post.author_id",
          foreignField: "_id",
          as: "post.author",
        },
      },
      { $unwind: { path: "$post.author", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "post.category",
          foreignField: "_id",
          as: "post.category",
        },
      },
      { $unwind: { path: "$post.category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "post.subCategory",
          foreignField: "_id",
          as: "post.subCategory",
        },
      },
      {
        $unwind: {
          path: "$post.subCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "post.tags",
          foreignField: "_id",
          as: "post.tags",
        },
      },
      {
        $project: {
          _id: 0,
          likedAt: "$created_at",
          "post.author.fullname": 1,
          "post.author.username": 1,
          "post.author.avatarURL": 1,
          "post._id": 1,
          "post.title": 1,
          "post.slug": 1,
          "post.thumbnail": 1,
          "post.summary": 1,
          "post.category.name": 1,
          "post.category.slug": 1,
          "post.subCategory.name": 1,
          "post.subCategory.slug": 1,
          "post.tags.name": 1,
          "post.tags.slug": 1,
        },
      },
    ]);
    res.success(200, "success", "Fetched post likes", likes);
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};
