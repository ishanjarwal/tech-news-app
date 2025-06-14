import { RequestHandler } from "express";
import mongoose from "mongoose";
import { POST_LIMIT, POST_STATUS } from "../constants/constants";
import Post from "../models/Post";
import calcRaadingTime from "../utils/calcReadingTime";
import slugify from "../utils/slugify";
import Tag from "../models/Tag";
import Like from "../models/Like";

// create a post
export const createPost: RequestHandler = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      tagIds,
      categoryId,
      subCategoryId,
      thumbnail,
      status,
    } = req.body;

    const slug = slugify(title);
    const reading_time_sec = calcRaadingTime(content);

    const newPost = new Post({
      author_id: new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b"),
      title,
      slug,
      summary,
      content,
      tags: tagIds,
      category: new mongoose.Types.ObjectId(categoryId),
      subCategory: new mongoose.Types.ObjectId(subCategoryId),
      thumbnail,
      reading_time_sec,
      status: status || "draft",
    });
    await newPost.save();
    res.success(200, "success", "Post created", {
      postSlug: newPost.slug,
      postStatus: newPost.status,
    });
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
// fetch a post
export const fetchPost: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate({ path: "category", select: "slug name -_id" })
      .populate({ path: "subCategory", select: "slug name -_id" })
      .populate({
        path: "author_id",
        select: "fullname username avatarURL -_id",
      })
      .populate({ path: "tags", select: "name slug -_id" });
    if (!post) {
      res.error(400, "error", "Post not found", null);
      return;
    }
    const likeCount = await Like.countDocuments({ post_id: post._id });
    post.views_count += 1;
    await post.save();
    res.success(200, "success", "Post fetched", {
      ...post.toObject(),
      likes: likeCount,
    });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", error);
  }
};

// fetch posts (sorting and pagination)
export const fetchPosts: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = POST_LIMIT || 10;
    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate({ path: "category", select: "slug name -_id" })
      .populate({ path: "subCategory", select: "slug name -_id" })
      .populate({
        path: "author_id",
        select: "fullname username avatarURL -_id",
      })
      .populate({ path: "tags", select: "name slug -_id" });

    const total = await Post.countDocuments();
    res.success(200, "success", "Posts fetched", {
      posts,
      total,
      count: posts.length,
      page,
      limit,
    });
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};
// update post
export const updatePost: RequestHandler = async (req, res) => {
  try {
    const author_id = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b");
    const { id } = req.params;
    const updateFields = {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.title && { slug: slugify(req.body.title) }),
      ...(req.body.summary && { summary: req.body.summary }),
      ...(req.body.content && { content: req.body.content }),
      ...(req.body.content && {
        reading_time_sec: calcRaadingTime(req.body.content),
      }),
      ...(req.body.thumbnail && { thumbnail: req.body.thumbnail }),
      ...(req.body.categoryId && {
        category: new mongoose.Types.ObjectId(req.body.categoryId),
      }),
      ...(req.body.subCategoryId && {
        subCategory: new mongoose.Types.ObjectId(req.body.subCategoryId),
      }),
      ...(req.body.tagIds && { tags: req.body.tagIds }),
    };
    if (Object.keys(updateFields).length === 0) {
      res.error(400, "warning", "Nothing to update", null);
      return;
    }
    updateFields.updated_at = new Date(Date.now());
    const updated = await Post.findOneAndUpdate(
      { _id: id, author_id },
      updateFields,
      { new: true }
    );
    res.success(200, "success", "post updated", {
      postSlug: updated?.slug,
      postStatus: updated?.status,
    });
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};
// change post status
export const changePostStatus: RequestHandler = async (req, res) => {
  try {
    const author_id = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b");
    const { id } = req.params;
    const status =
      (req.body.status as (typeof POST_STATUS)[number]) || "published";
    const post = await Post.findOne({ _id: id, author_id });
    if (!post) {
      res.error(400, "error", "Post not found", null);
      return;
    }
    post.status = status;
    await post.save();
    res.success(200, "success", `Post ${status}`, post);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// fetch meta details
export const fetchPostMetaData: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    if (!post) {
      res.error(400, "error", "Post not found", null);
      return;
    }
    res.success(200, "success", "Post metadata fetched", {
      metaTitle: post.title,
      metaDescription: post.summary,
      metaImage: post.thumbnail,
      metaTags: post.tags,
    });
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// get posts for user (filter for drafts)
export const fetchAuthorPosts: RequestHandler = async (req, res) => {
  try {
    const author_id = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b");
    const status =
      (req.query.status as (typeof POST_STATUS)[number]) || "published";
    const page = parseInt(req.query.page as string) || 1;
    const limit = POST_LIMIT || 10;
    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const posts = await Post.find({ author_id, status })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author_id });
    res.success(200, "success", "user posts fetched", {
      posts,
      total,
      count: posts.length,
      page,
      limit,
    });
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// get posts for user (filter for drafts)
export const fetchPostsByTag: RequestHandler = async (req, res) => {
  try {
    const tag = req.params.tag;
    const check = await Tag.findOne({ slug: tag });
    if (!check) {
      res.error(400, "error", "Invalid tag", null);
      return;
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = POST_LIMIT || 10;
    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const posts = await Post.find({ tags: check._id })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ tags: check._id });
    res.success(200, "success", "Tag posts fetched", {
      posts,
      total,
      count: posts.length,
      limit,
      page,
    });
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};
