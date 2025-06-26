import { body, param } from "express-validator";
import Tag from "../models/Tag";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import { isURL } from "validator";
import slugify from "../utils/slugify";
import Post from "../models/Post";
import { MongooseError } from "mongoose";
import { optional } from "zod";

export const validateNewPost = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Invalid title")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Max length is 150 characters")
    .bail()
    .custom(async (value) => {
      try {
        const slug = slugify(value);
        const found = await Post.findOne({ slug });
        if (found) throw new Error("Post with same title already exists");
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating title");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating title");
        }
      }
    }),

  body("summary")
    .exists({ checkFalsy: true })
    .withMessage("Summary is required")
    .bail()
    .isString()
    .withMessage("Invalid summary")
    .bail()
    .isLength({ max: 300 })
    .withMessage("Max length is 300 characters")
    .bail(),

  body("content")
    .exists({ checkFalsy: true })
    .withMessage("Content is required")
    .bail()
    .isString()
    .withMessage("Invalid content format")
    .bail()
    .isLength({ min: 100, max: 20000 })
    .withMessage("Content must be between 100 and 20,000 characters")
    .bail()
    .custom((value) => {
      const markdownPatterns = [/#|\*|-|\[.*\]\(.*\)/];
      const matches = markdownPatterns.some((pattern) => pattern.test(value));
      if (!matches) throw new Error("Invalid content format");
      return true;
    })
    .bail(),

  body("tags")
    .custom(async (tags, { req }) => {
      try {
        if (!Array.isArray(tags)) throw new Error("Invalid or missing tags");
        if (tags.length < 5) throw new Error("Minimum 5 tags are required");
        if (tags.length > 20) throw new Error("Maximum 20 tags are allowed");

        const existing = await Tag.find({ slug: { $in: tags } }).select("slug");
        const foundSlugs = existing.map((tag) => tag.slug);
        const missing = tags.filter(
          (slug: string) => !foundSlugs.includes(slug)
        );
        if (missing.length > 0) {
          throw new Error(`Invalid Tags : ${missing.join(", ")}`);
        }
        req.body.tagIds = existing.map((el) => el._id);
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating tags");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating tags");
        }
      }
    })
    .bail(),

  body("category")
    .exists({ checkFalsy: true })
    .withMessage("Category is required")
    .bail()
    .isString()
    .withMessage("Invalid category")
    .bail()
    .custom(async (slug, { req }) => {
      try {
        const category = await Category.findOne({ slug });
        if (!category) throw new Error("Category not found");
        req.body.categoryId = category._id;
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating category");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating category");
        }
      }
    })
    .bail(),

  body("subCategory")
    .optional()
    .isString()
    .withMessage("SubCategory must be a string")
    .bail()
    .custom(async (slug, { req }) => {
      try {
        const categoryId = req.body.categoryId;
        if (!categoryId) {
          throw new Error("Category for this subcategory is invalid");
        }

        const subCategory = await SubCategory.findOne({
          slug,
          category: categoryId,
        });
        if (!subCategory) {
          throw new Error(
            "SubCategory not found or does not belong to the specified category"
          );
        }
        req.body.subCategoryId = subCategory._id;
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating subcategory");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating subcategory");
        }
      }
    })
    .bail(),

  body("status")
    .optional()
    .isIn(["published", "draft"])
    .withMessage("Invalid status value")
    .bail(),
];

export const validateUpdatePost = [
  body("title")
    .optional()
    .bail()
    .isString()
    .withMessage("Invalid title")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Max length is 150 characters")
    .bail()
    .custom(async (value) => {
      try {
        const slug = slugify(value);
        const found = await Post.findOne({ slug });
        if (found) throw new Error("Post with same title already exists");
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating title");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating title");
        }
      }
    }),

  body("summary")
    .optional()
    .bail()
    .isString()
    .withMessage("Invalid summary")
    .bail()
    .isLength({ max: 300 })
    .withMessage("Max length is 300 characters")
    .bail(),

  body("content")
    .optional()
    .bail()
    .isString()
    .withMessage("Invalid content format")
    .bail()
    .isLength({ min: 100, max: 20000 })
    .withMessage("Content must be between 100 and 20,000 characters")
    .bail()
    .custom((value) => {
      const markdownPatterns = [/#|\*|-|\[.*\]\(.*\)/];
      const matches = markdownPatterns.some((pattern) => pattern.test(value));
      if (!matches) throw new Error("Invalid content format");
      return true;
    })
    .bail(),

  body("tags")
    .optional()
    .custom(async (tags, { req }) => {
      try {
        if (!Array.isArray(tags)) throw new Error("Invalid or missing tags");
        if (tags.length < 5) throw new Error("Minimum 5 tags are required");
        if (tags.length > 20) throw new Error("Maximum 20 tags are allowed");

        const existing = await Tag.find({ slug: { $in: tags } }).select("slug");
        const foundSlugs = existing.map((tag) => tag.slug);
        const missing = tags.filter(
          (slug: string) => !foundSlugs.includes(slug)
        );
        if (missing.length > 0) {
          throw new Error(`Invalid Tags : ${missing.join(", ")}`);
        }
        req.body.tagIds = existing.map((el) => el._id);
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating tags");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating tags");
        }
      }
    })
    .bail(),

  body("category")
    .optional()
    .bail()
    .isString()
    .withMessage("Invalid category")
    .bail()
    .custom(async (slug, { req }) => {
      try {
        const category = await Category.findOne({ slug });
        if (!category) throw new Error("Category not found");
        req.body.categoryId = category._id;
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating category");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating category");
        }
      }
    })
    .bail(),

  body("subCategory")
    .optional()
    .isString()
    .withMessage("SubCategory must be a string")
    .bail()
    .custom(async (slug, { req }) => {
      try {
        const categoryId = req.body.categoryId;
        if (!categoryId) {
          throw new Error("Category for this subcategory is invalid");
        }

        const subCategory = await SubCategory.findOne({
          slug,
          category: categoryId,
        });
        if (!subCategory) {
          throw new Error(
            "SubCategory not found or does not belong to the specified category"
          );
        }
        req.body.subCategoryId = subCategory._id;
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating subcategory");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating subcategory");
        }
      }
    })
    .bail(),
];

export const validateThumbnailUpload = [
  param("id").custom(async (id, { req }) => {
    try {
      const check = await Post.findOne({ _id: id, author_id: req.user._id });
      if (!check) throw new Error("Invalid request");
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new Error("validation error");
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("validation error");
      }
    }
  }),
];
