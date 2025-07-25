import { RequestHandler } from "express";
import mongoose, { Types } from "mongoose";
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
import TempImage from "../models/TempImage";

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
      thumbnail,
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
      thumbnail,
    });

    if (thumbnail?.public_id) {
      const doc = await TempImage.findOne({
        "image.public_id": thumbnail.public_id,
      });
      if (doc) {
        await doc.deleteOne();
      }
    }
    await newPost.save();
    const message =
      newPost.status === "published" ? "Post published" : "Draft Saved";
    res.success(200, "success", message, {
      slug: newPost.slug,
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

    const result = await Post.aggregate([
      { $match: { slug, status: "published" } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                fullname: 1,
                avatar: "$avatar.url",
                cover_image: "$cover_image.url",
                bio: 1,
                joined: "$created_at",
              },
            },
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
          pipeline: [
            {
              $project: { name: 1, slug: 1, _id: 0, thumbnail: 1, summary: 1 },
            },
          ],
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
        $addFields: {
          thumbnail: "$thumbnail.url",
        },
      },
      {
        $project: {
          // _id: 0,
          __v: 0,
          author_id: 0,
        },
      },
    ]);

    const post = result.length > 0 ? result[0] : null;

    if (!post) {
      res.error(400, "error", "Post not found", null);
      return;
    }
    // const likeCount = await Like.countDocuments({ post_id: post._id });
    // post.views_count += 1;
    // await post.save();
    res.success(200, "success", "Post fetched", post);
    return;
  } catch (error) {
    console.log(error);
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

export const fetchPostById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const postId = new Types.ObjectId(id);

    const result = await Post.aggregate([
      { $match: { _id: postId } },

      // Lookup category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // Lookup subCategory
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

      // Lookup author
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author",
          pipeline: [
            { $project: { username: 1, fullname: 1, avatar: 1, _id: 0 } },
          ],
        },
      },
      {
        $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $project: {
      //     // Only select desired author fields
      //     "author_id.fullname": 1,
      //     "author_id.username": 1,
      //     "author_id.avatarURL": 1,
      //     "author_id._id": 1,
      //     // Include all other post fields
      //     title: 1,
      //     content: 1,
      //     views_count: 1,
      //     category: 1,
      //     subCategory: 1,
      //     tags: 1,
      //     createdAt: 1,
      //     updatedAt: 1,
      //   },
      // },

      // Lookup tags
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
    ]);

    const post = result[0];
    if (!post) {
      res.error(400, "error", "Post not found", null);
      return;
    }

    const likeCount = await Like.countDocuments({ post_id: post._id });

    // Increment views_count manually (not through aggregation)
    await Post.updateOne({ _id: post._id }, { $inc: { views_count: 1 } });

    res.success(200, "success", "Post fetched", {
      ...post,
      likes: likeCount,
    });
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// fetch posts (sorting and pagination)
export const fetchPosts: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = POST_LIMIT;
    const skip = (page - 1) * limit;

    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "asc" ? 1 : -1;

    const { category, subcategory, tag, author } = req.query as Record<
      string,
      string
    >;

    // Pre-fetch related IDs only if slugs exist
    const [categoryDoc, tagDoc] = await Promise.all([
      category ? Category.findOne({ slug: category }).select("_id") : null,
      tag ? Tag.findOne({ slug: tag }).select("_id") : null,
    ]);

    const subCategoryDoc =
      categoryDoc && subcategory
        ? await SubCategory.findOne({
            slug: subcategory,
            category: categoryDoc._id,
          }).select("_id")
        : null;

    const matchStage: Record<string, any> = { status: "published" };
    if (categoryDoc) matchStage.category = categoryDoc._id;
    if (subCategoryDoc) matchStage.subCategory = subCategoryDoc._id;
    if (tagDoc) matchStage.tags = { $in: [tagDoc._id] };

    const pipeline: any[] = [{ $match: matchStage }];

    // Lookups and optional author match
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author",
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
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }
    );

    if (author) {
      pipeline.push({ $match: { "author.username": author } });
    }

    pipeline.push(
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },

      { $addFields: { thumbnail: "$thumbnail.url" } },

      {
        $project: {
          __v: 0,
          author_id: 0,
        },
      },

      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit }
    );

    const posts = await Post.aggregate(pipeline);

    // Count total matching documents
    const total = await Post.countDocuments(matchStage);

    res.success(200, "success", "Posts fetched", {
      posts,
      total,
      count: posts.length,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// update post
export const updatePost: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user || !user._id) {
      res.error(401, "error", "Unauthorized access", null);
      return;
    }

    const userId = user._id;
    const postId = req.params.id;

    if (!mongoose.isValidObjectId(postId)) {
      res.error(400, "error", "Invalid post ID", null);
      return;
    }

    const post = await Post.findOne({ _id: postId, author_id: userId });
    if (!post) {
      res.error(404, "error", "Post not found or unauthorized", null);
      return;
    }

    const { title, summary, content, categoryId, subCategoryId, tagIds } =
      req.body;

    const updateFields: Record<string, any> = {};

    if (title) {
      updateFields.title = title;
      updateFields.slug = slugify(title);
    }

    if (summary) updateFields.summary = summary;
    if (content) {
      updateFields.content = content;
      updateFields.reading_time_sec = calcRaadingTime(content);
    }

    if (categoryId && mongoose.isValidObjectId(categoryId)) {
      updateFields.category = new mongoose.Types.ObjectId(categoryId);
    }

    if (subCategoryId && mongoose.isValidObjectId(subCategoryId)) {
      updateFields.subCategory = new mongoose.Types.ObjectId(subCategoryId);
    }

    if (Array.isArray(tagIds)) {
      updateFields.tags = tagIds;
    }

    if (Object.keys(updateFields).length === 0) {
      res.error(400, "warning", "Nothing to update", null);
      return;
    }

    updateFields.updated_at = new Date();

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author_id: userId },
      updateFields,
      { new: true }
    );

    res.success(200, "success", "Post updated", {
      slug: updatedPost?.slug,
    });
    return;
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
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
    const post = await Post.findOne({ slug }).populate("tags");
    if (!post) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    res.success(200, "success", "Post metadata fetched", {
      metaTitle: post.title,
      metaDescription: post.summary,
      metaImage: post.thumbnail?.url,
      metaTags: post.tags.map((tag: any) => tag.name),
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
    const sortField = (req.query.sort as string) || "updated_at";
    const sortOrder = (req.query.order as string) === "asc" ? 1 : -1;

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
          // pipeline: [{ $project: { name: 1, slug: 1, _id: 1, thumbnail: 1, summary: 1 } }],
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
          // pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
        },
      },
      { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
          // pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
        },
      },
      {
        $project: {
          // _id: 0,
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
    const totalCount = countResult[0]?.total || 0;

    res.success(200, "success", "posts fetched", {
      posts,
      totalCount,
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

    res.success(200, "success", "Thumbnail uploaded", {
      url: image.secure_url,
    });
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

export const uploadThumbnailTemporary: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const image = req.body.image;
    if (!image) throw new Error();

    await new TempImage({
      author_id: user._id,
      image: {
        public_id: image.public_id,
        url: image.secure_url,
        format: image.format,
      },
    }).save();

    res.success(200, "success", "Thumbnail uploaded", {
      public_id: image.public_id,
      url: image.secure_url,
      format: image.format,
    });
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

export const fetchTrendingPosts: RequestHandler = async (req, res) => {
  try {
    const now = new Date();

    const trendingPosts = await Post.aggregate([
      {
        $match: {
          status: "published", // Only published posts
        },
      },
      {
        $lookup: {
          localField: "author_id",
          foreignField: "_id",
          from: "users",
          as: "author",
          pipeline: [{ $project: { fullname: 1, username: 1 } }],
        },
      },
      {
        $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          ageInHours: {
            $divide: [
              { $subtract: [now, "$created_at"] },
              1000 * 60 * 60, // Convert ms to hours
            ],
          },
        },
      },
      {
        $addFields: {
          trendingScore: {
            $cond: {
              if: { $lte: ["$ageInHours", 1] },
              then: "$views_count",
              else: { $divide: ["$views_count", "$ageInHours"] },
            },
          },
        },
      },
      {
        $sort: { trendingScore: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          slug: 1,
          title: 1,
          _id: 1,
          thumbnail: "$thumbnail.url",
          author: 1,
          updated_at: 1,
        },
      },
    ]);

    res.success(200, "success", "Fetched posts", trendingPosts);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

export const fetchPagePosts: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = POST_LIMIT;
    const skip = (page - 1) * limit;

    const filter = (req.query.filter as string)?.toLowerCase() || "latest";

    const matchStage = { status: "published" };

    const pipeline: any[] = [{ $match: matchStage }];

    // Join likes to compute total likes per post
    pipeline.push({
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post_id",
        as: "likes",
      },
    });

    pipeline.push({
      $addFields: {
        likeCount: { $size: "$likes" },
      },
    });

    // Apply sorting based on filter
    switch (filter) {
      case "most-viewed":
        pipeline.push({ $sort: { views_count: -1 } });
        break;
      case "most-liked":
        pipeline.push({ $sort: { likeCount: -1 } });
        break;
      case "latest":
      default:
        pipeline.push({ $sort: { created_at: -1 } });
        break;
    }

    // Lookup and enrich author
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author",
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
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }
    );

    // Lookup and enrich tags
    pipeline.push({
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    });

    pipeline.push(
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      }
    );

    pipeline.push(
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      {
        $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true },
      }
    );

    pipeline.push(
      {
        $addFields: {
          thumbnail: "$thumbnail.url",
        },
      },
      {
        $project: {
          __v: 0,
          author_id: 0,
          likes: 0,
        },
      },
      { $skip: skip },
      { $limit: limit }
    );

    const posts = await Post.aggregate(pipeline);
    const total = await Post.countDocuments(matchStage);

    res.success(200, "success", "Posts fetched", {
      posts,
      total,
      count: posts.length,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

export const uploadContentImage: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const image = req.body.image;
    if (!image) throw new Error();

    res.success(200, "success", "Image uploaded", {
      public_id: image.public_id,
      url: image.secure_url,
      format: image.format,
    });
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
