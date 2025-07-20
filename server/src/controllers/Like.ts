import { RequestHandler } from "express";
import Like from "../models/Like";
import Post from "../models/Post";
import mongoose from "mongoose";
import { UserValues } from "../models/User";

//  fetch post liked status
export const likedStatus: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = req.params.id;

    const check = await Like.findOne({ post_id: id, user_id: userId });
    if (check) {
      res.success(200, "success", "Likes", { liked: true });
      return;
    }
    res.success(200, "success", "Doesn't like", { liked: false });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// toggle post like
export const togglePostLike: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = req.params.id;
    const post = await Post.findById(id).select("author_id");
    if (!post) {
      res.error(400, "error", "Invalid request", null);
      return;
    }

    const check = await Like.findOne({ post_id: id, user_id: userId });
    if (check) {
      await check.deleteOne();
      res.success(200, "success", "Post Unliked", { liked: false });
      return;
    }

    const newLike = new Like({
      post_id: id,
      user_id: userId,
      author_id: post?.author_id,
    });
    await newLike.save();
    res.success(200, "success", "Post liked", { liked: true });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// fetch user liked posts
export const fetchUserLikedPosts: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;

    const posts = await Like.aggregate([
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
          "post.author.avatar": 1,
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
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// fetch author post likes
export const fetchPostLikers: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const post_id = new mongoose.Types.ObjectId(req.params.id);
    const post = await Post.findById(post_id);
    if (!post) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const users = await Like.aggregate([
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
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};
