import { body, param } from "express-validator";
import { isURL } from "validator";
import slugify from "../utils/slugify";
import Category from "../models/Category";
import { MongooseError } from "mongoose";
import SubCategory from "../models/SubCategory";

export const validateCreateSubcategory = [
  param("categoryId").custom(async (id, { req }) => {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Invalid category");
      }
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
  }),
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters long")
    .bail()
    .matches(/^[A-Za-z\s\-]+$/)
    .withMessage(
      "Name must contain only alphabetic characters, spaces, or hyphens"
    )
    .bail()
    .custom(async (value, { req }) => {
      try {
        const slug = slugify(value);
        const exists = await SubCategory.findOne({
          slug,
          category: req.params?.categoryId,
        });
        if (exists) {
          throw new Error("Subcategory already exists");
        }
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating Subcategory");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating Subcategory");
        }
      }
    }),

  body("summary")
    .optional()
    .isString()
    .withMessage("Summary must be a string")
    .bail()
    .isLength({ max: 300 })
    .withMessage("Summary must be at most 300 characters long")
    .bail(),

  body("thumbnail")
    .optional()
    .isString()
    .withMessage("Thumbnail must be a string")
    .bail()
    .custom((value) => {
      if (!isURL(value)) {
        throw new Error("Thumbnail must be a valid URL with http/https");
      }
      return true;
    })
    .bail(),
];

export const validateUpdateSubcategory = [
  param("id").custom(async (id, { req }) => {
    try {
      const subCategory = await SubCategory.findById(id);
      if (!subCategory) {
        throw new Error("Invalid Subcategory");
      }
      req.body.categoryId = subCategory.category;
      return true;
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new Error("Error validating Subcategory");
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error validating Subcategory");
      }
    }
  }),
  body("name")
    .optional()
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters long")
    .bail()
    .matches(/^[A-Za-z\s\-]+$/)
    .withMessage(
      "Name must contain only alphabetic characters, spaces, or hyphens"
    )
    .bail()
    .custom(async (value, { req }) => {
      try {
        const slug = slugify(value);
        const exists = await SubCategory.findOne({
          slug,
          category: req.body?.categoryId,
        });
        if (exists) {
          throw new Error(
            "A subcategory with the same name already exists in this category"
          );
        }
        return true;
      } catch (error) {
        if (error instanceof MongooseError) {
          throw new Error("Error validating Subcategory");
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error validating Subcategory");
        }
      }
    }),

  body("summary")
    .optional()
    .isString()
    .withMessage("Summary must be a string")
    .bail()
    .isLength({ max: 300 })
    .withMessage("Summary must be at most 300 characters long")
    .bail(),

  body("thumbnail")
    .optional()
    .isString()
    .withMessage("Thumbnail must be a string")
    .bail()
    .custom((value) => {
      if (!isURL(value)) {
        throw new Error("Thumbnail must be a valid URL with http/https");
      }
      return true;
    })
    .bail(),
];
