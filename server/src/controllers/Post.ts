import { RequestHandler } from "express";
import mongoose from "mongoose";
import { POST_LIMIT, POST_STATUS } from "../constants/constants";
import Category from "../models/Category";
import Like from "../models/Like";
import Post from "../models/Post";
import SubCategory from "../models/SubCategory";
import Tag from "../models/Tag";
import calcRaadingTime from "../utils/calcReadingTime";
import slugify from "../utils/slugify";
import { UserValues } from "../models/User";
import cloudinary from "../config/cloudinary";

// create a post
export const createPost: RequestHandler = async (req, res) => {
  const user = req.user as UserValues;
  if (!user) throw new Error();
  const userId = user._id;

  try {
    const {
      title,
      summary,
      content,
      tagIds,
      categoryId,
      subCategoryId,
      status,
    } = req.body;

    const slug = slugify(title);
    const reading_time_sec = calcRaadingTime(content);

    const newPost = new Post({
      author_id: userId,
      title,
      slug,
      summary,
      content,
      tags: tagIds,
      category: new mongoose.Types.ObjectId(categoryId),
      subCategory: new mongoose.Types.ObjectId(subCategoryId),
      reading_time_sec,
      status: status || "draft",
    });
    await newPost.save();
    const message = newPost.status==="published"? "Post published": "Draft Saved"
    res.success(200, "success", message, {
      postSlug: newPost.slug,
      postStatus: newPost.status,
    });
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
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
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
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

    const { category, subcategory, tag } = req.query; // as slugs
    const categoryId = category
      ? (await Category.findOne({ slug: category }))?._id
      : null;
    const subCategoryId = subcategory
      ? (await SubCategory.findOne({ slug: subcategory }))?._id
      : null;
    const tagId = tag ? (await Tag.findOne({ slug: tag }))?._id : null;

    const pipeline: any[] = [];
    const matchStage: any = {};
    if (categoryId) matchStage.category = categoryId;
    if (subCategoryId) matchStage.subCategory = subCategoryId;
    if (tagId) matchStage.tags = { $in: [tagId] };

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
    pipeline.push(
      ...[
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
            pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
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
          $project: {
            _id: 0,
            __v: 0,
            author_id: 0,
          },
        },
        { $sort: { [sortField]: sortOrder } },
        { $skip: skip },
        { $limit: limit },
      ]
    );

    const posts = await Post.aggregate(pipeline);

    const countPipeline = [];
    if (Object.keys(matchStage).length > 0) {
      countPipeline.push({ $match: matchStage });
    }
    countPipeline.push({ $count: "total" });

    const countResult = await Post.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    res.success(200, "success", "Posts fetched", {
      posts,
      total,
      count: posts.length,
      page,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};
// update post
export const updatePost: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = req.params.id;
    const post = await Post.findOne({ _id: id, author_id: userId });
    if (!post) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const updateFields = {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.title && { slug: slugify(req.body.title) }),
      ...(req.body.summary && { summary: req.body.summary }),
      ...(req.body.content && { content: req.body.content }),
      ...(req.body.content && {
        reading_time_sec: calcRaadingTime(req.body.content),
      }),
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
      { _id: id, author_id: userId },
      updateFields,
      { new: true }
    );
    res.success(200, "success", "post updated", {
      postSlug: updated?.slug,
      postStatus: updated?.status,
    });
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};
// change post status
export const changePostStatus: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = req.params.id;
    const post = await Post.findOne({ _id: id, author_id: userId });
    if (!post) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const status =
      (req.body.status as (typeof POST_STATUS)[number]) === "draft"
        ? "draft"
        : "published";
    post.status = status;
    await post.save();
    res.success(200, "success", `Post status changed to ${status}`, {
      slug: post.slug,
      status: post.status,
    });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// fetch meta details
export const fetchPostMetaData: RequestHandler = async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await Post.findOne({ slug });
    if (!post) {
      res.error(400, "error", "Invalid request", null);
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
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// get posts for user (filter for drafts)
export const fetchAuthorPosts: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const status =
      (req.query.status as (typeof POST_STATUS)[number]) === "draft"
        ? "draft"
        : "published";
    const page = parseInt(req.query.page as string) || 1;
    const limit = POST_LIMIT || 10;
    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const matchStage = { $match: { author_id: userId, status } };

    const posts = await Post.aggregate([
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
          pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
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
        $project: {
          _id: 0,
          __v: 0,
          author_id: 0,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const countPipeline = [matchStage, { $count: "total" }];
    const countResult = await Post.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    res.success(200, "success", "posts fetched", {
      posts,
      total,
      count: posts.length,
      page,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// delete (disable) post
export const deletePost: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const id = new mongoose.Types.ObjectId(req.params.id);
    const post = await Post.findOne({ _id: id, author_id: userId });
    if (!post) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    post.status = "archived";
    await post.save();
    res.success(200, "success", "Post deleted", null);
    return;
  } catch (error) {
    console.log(error);
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

export const uploadPostThumbnail: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const image = req.body.image;
    if (!image) throw new Error();
    const existing = await Post.findOne({ _id: id, author_id: user._id });
    if (!existing) throw new Error();

    if (existing.thumbnail?.public_id) {
      const result = await cloudinary.uploader.destroy(
        existing.thumbnail.public_id
      );
      if (result.result !== "ok") {
        res.error(400, "error", "Something went wrong while uploading", {});
        return;
      }
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          thumbnail: {
            public_id: image.public_id,
            url: image.secure_url,
            format: image.format,
          },
        },
      },
      { new: true }
    );

    res.success(200, "success", "Thumbnail uploaded", {});
    return;
  } catch (error) {
    if (req.body?.image?.public_id) {
      await cloudinary.uploader.destroy(req.body.image.public_id);
    }
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

export const deletePostThumbnail: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user as UserValues;
    if (!user) throw new Error();

    const existing = await Post.findOne({ _id: id, author_id: user._id });
    if (!existing) throw new Error();

    if (existing.thumbnail?.public_id) {
      const result = await cloudinary.uploader.destroy(
        existing.thumbnail.public_id
      );
      if (result.result !== "ok") {
        res.error(400, "error", "Something went wrong while uploading", {});
        return;
      }
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $unset: { thumbnail: 1 } },
      { new: true }
    );

    res.success(200, "success", "Thumbnail removed", {});
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};
