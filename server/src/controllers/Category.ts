import { RequestHandler } from "express";
import Category from "../models/Category";
import slugify from "../utils/slugify";

// create category
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, summary, thumbnail } = req.body;
    const slug = slugify(name);
    const newCategory = new Category({
      name,
      slug,
      summary,
      thumbnail,
    });
    await newCategory.save();
    res.success(200, "success", "Category created", {
      categoryId: newCategory._id,
    });
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
// fetch all categories

// fetch category by slug

// fetch category by id

// update a category

// delete a category (only if posts for that category are 0)
