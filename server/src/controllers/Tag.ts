import { RequestHandler } from "express";
import slugify from "../utils/slugify";
import Tag from "../models/Tag";
import Post from "../models/Post";
import { TAG_LIMIT } from "../constants/constants";

// create a tag
export const createTag: RequestHandler = async (req, res) => {
  try {
    const { name, summary } = req.body;
    const slug = slugify(name);
    const newTag = new Tag({
      name,
      slug,
      summary,
    });
    await newTag.save();
    res.success(200, "success", "Tag created", { tagId: newTag._id });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// Fetch all tags (with optional filtering, sorting, and pagination)
export const fetchTags: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = TAG_LIMIT || 100;
    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "desc" ? -1 : 1;
    const search = (req.params.slug as string) || "";
    const skip = (page - 1) * limit;

    const tags = await Tag.find({ name: { $regex: search, $options: "i" } })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("-_id -__v");

    const total = await Tag.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.success(200, "success", "Tags fetched", {
      tags,
      total,
      count: tags.length,
      page,
      limit,
    });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// Fetch a tag by slug
export const fetchTag: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const tag = await Tag.findOne({ slug }).select("-_id -__v");
    if (!tag) {
      res.error(400, "error", "Tag not found", null);
      return;
    }
    res.success(200, "success", "Tag fetched", tag);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// Update a tag
export const updateTag: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findById(id);
    if (!tag) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const updateFields = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.summary && { summary: req.body.summary }),
      ...(req.body.name && { slug: slugify(req.body.name) }),
    };

    if (Object.keys(updateFields).length !== 0) {
      updateFields.updated_at = new Date(Date.now());
    }

    const updated = await Tag.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
      }
    ).select("-_id -__v");

    if (!updated) {
      res.error(400, "error", "Tag not found", null);
      return;
    }

    res.success(200, "success", "Tag updated", updated);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// Delete a tag (only if no posts use it)
export const deleteTag: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findById(id);
    if (!tag) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const postCount = await Post.countDocuments({ tags: id });
    if (postCount > 0) {
      res.error(
        400,
        "error",
        "This tag cannot be deleted because it is associated with posts",
        null
      );
      return;
    }

    const deleted = await Tag.findByIdAndDelete(id);
    if (!deleted) {
      res.error(400, "error", "Invalid tag", null);
      return;
    }

    res.success(200, "success", "Tag deleted", null);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};
