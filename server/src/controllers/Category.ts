import { RequestHandler } from "express";
import Category from "../models/Category";
import slugify from "../utils/slugify";
import { CATEGORY_LIMIT } from "../constants/constants";
import Post from "../models/Post";
import cloudinary from "../config/cloudinary";

// create category
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, summary } = req.body;
    const slug = slugify(name);
    const newCategory = new Category({
      name,
      slug,
      summary,
    });
    await newCategory.save();
    res.success(200, "success", "Category created", {
      categoryId: newCategory._id,
    });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// fetch all categories
export const fetchCategories: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = CATEGORY_LIMIT || 100;
    const sortField = (req.query.sort as string) || "created_at";
    const sortOrder = (req.query.order as string) === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const total = await Category.countDocuments();

    res.success(200, "success", "Categories fetched", {
      categories,
      total,
      count: categories.length,
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
// fetch category by slug
export const fetchCategory: RequestHandler = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug }).select("-_id -__v");
    if (!category) {
      res.error(400, "warning", "Category not found", {});
      return;
    }
    res.success(200, "success", "Category fetched", category);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// update a category
export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      res.error(400, "error", "Invalid request", {});
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

    const updated = await Category.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).select("-_id -__v");

    if (!updated) {
      res.error(400, "warning", "Category not found", null);
      return;
    }
    res.success(200, "success", "Category updated", updated);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// delete a category (only if posts for that category are 0)
export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    const postCount = await Post.countDocuments({ category: id });
    if (postCount >= 0) {
      res.error(
        400,
        "warning",
        "This category cannot be deleted because it has posts associated with it",
        null
      );
      return;
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      res.error(400, "error", "Invalid category", null);
      return;
    }
    res.success(200, "success", "Category deleted", null);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

export const uploadCategoryThumbnail: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.body.image;
    if (!image) throw new Error();
    const existing = await Category.findOne({ _id: id });
    if (!existing) {
      res.error(400, "error", "Invalid request", {});
      return;
    }

    if (existing.thumbnail?.public_id) {
      const result = await cloudinary.uploader.destroy(
        existing.thumbnail.public_id
      );
      if (result.result !== "ok") {
        res.error(400, "error", "Something went wrong while uploading", {});
        return;
      }
    }

    const updated = await Category.findByIdAndUpdate(
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

export const deleteCategoryThumbnail: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await Category.findById(id);
    if (!existing) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    if (existing.thumbnail?.public_id) {
      const result = await cloudinary.uploader.destroy(
        existing.thumbnail.public_id
      );
      if (result.result !== "ok") {
        res.error(400, "error", "Something went wrong while deleting", {});
        return;
      }
    }

    const post = await Category.findByIdAndUpdate(
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
