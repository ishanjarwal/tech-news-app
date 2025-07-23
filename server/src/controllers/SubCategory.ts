import { RequestHandler } from "express";
import SubCategory from "../models/SubCategory";
import slugify from "../utils/slugify";
import Post from "../models/Post";
import Category from "../models/Category";

// create subCategory
export const createSubCategory: RequestHandler = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name, summary } = req.body;
    const slug = slugify(name);
    const newSubCategory = new SubCategory({
      name,
      slug,
      summary,
      category: categoryId,
    });
    await newSubCategory.save();
    res.success(200, "success", "Subcategory created", null);
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// fetch all subcategories for a category
export const fetchSubCategories: RequestHandler = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug: slug });
    if (!category) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const subCategories = await SubCategory.find({
      category: category._id,
    })
      .populate({ path: "category", select: "-_id -__v" })
      .select("-__v -_id");
    res.success(200, "success", "Subcategories fetched", subCategories);
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// fetch subCategory by slug in a category
export const fetchSubCategoryBySlug: RequestHandler = async (req, res) => {
  try {
    const { slug, categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const subCategory = await SubCategory.findOne({
      slug,
      category: category._id,
    }).select("-__v");
    if (!subCategory) {
      res.error(404, "error", "Subcategory not found", null);
      return;
    }
    res.success(200, "success", "Subcategory fetched", {
      ...subCategory.toObject(),
      category: { name: category.name, slug: category.slug },
    });
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};

// update a subCategory in a category
export const updateSubCategory: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const updateFields = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.summary && { summary: req.body.summary }),
      ...(req.body.name && { slug: slugify(req.body.name) }),
    };

    if (Object.keys(updateFields).length > 0) {
      updateFields.updated_at = new Date(Date.now());
    }

    const updated = await SubCategory.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).select("-__v -_id");

    if (!updated) {
      res.error(404, "error", "Subcategory not found", null);
      return;
    }
    res.success(200, "success", "Subcategory updated", updated);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};

// delete a subCategory in a category (only if posts for that subCategory are 0)
export const deleteSubCategory: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      res.error(400, "error", "Invalid request", null);
      return;
    }
    const postCount = await Post.countDocuments({ subCategory: id });
    if (postCount > 0) {
      res.error(
        400,
        "error",
        "This subcategory cannot be deleted because it has posts associated with it",
        null
      );
      return;
    }

    const deleted = await SubCategory.findByIdAndDelete(id);
    if (!deleted) {
      res.error(404, "error", "Subcategory not found", null);
      return;
    }
    res.success(200, "success", "Subcategory deleted", null);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
