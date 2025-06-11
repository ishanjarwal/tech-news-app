import { body } from "express-validator";
import Tag from "../models/Tag";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import { isURL } from "validator";

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
    .bail(),

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
      if (!Array.isArray(tags)) throw new Error("Invalid or missing tags");
      if (tags.length < 5) throw new Error("Minimum 5 tags are required");
      if (tags.length > 20) throw new Error("Maximum 20 tags are allowed");

      const existing = await Tag.find({ slug: { $in: tags } }).select("slug");
      const foundSlugs = existing.map((tag) => tag.slug);
      const missing = tags.filter((slug: string) => !foundSlugs.includes(slug));
      if (missing.length > 0) {
        throw new Error(`Invalid Tags : ${missing.join(", ")}`);
      }
      req.body.tagIds = existing.map((el) => el._id);
      return true;
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
      const category = await Category.findOne({ slug });
      if (!category) throw new Error("Category not found");
      req.body.categoryId = category._id;
      return true;
    })
    .bail(),

  body("subCategory")
    .optional()
    .isString()
    .withMessage("SubCategory must be a string")
    .bail()
    .custom(async (slug, { req }) => {
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
    })
    .bail(),

  body("thumbnail")
    .exists({ checkFalsy: true })
    .withMessage("Thumbnail is required")
    .bail()
    .isString()
    .withMessage("Thumbnail must be a string")
    .bail()
    .custom((value) => {
      if (!isURL(value)) {
        throw new Error("Invalid Thumbnail");
      }
      return true;
    })
    .bail(),

  body("status")
    .optional()
    .isIn(["archived", "published", "draft"])
    .withMessage("Invalid status value")
    .bail(),
];
