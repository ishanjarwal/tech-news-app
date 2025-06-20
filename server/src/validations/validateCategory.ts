import { body } from "express-validator";
import { isURL } from "validator";
import slugify from "../utils/slugify";
import Category from "../models/Category";
import { MongooseError } from "mongoose";

export const validateNewCategory = [
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
    .custom(async (value) => {
      try {
        const slug = slugify(value);
        const exists = await Category.findOne({ slug });
        if (exists) {
          throw new Error("Category already exists");
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

export const validateUpdateCategory = [
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
    .custom(async (value) => {
      try {
        const slug = slugify(value);
        const exists = await Category.findOne({ slug });
        if (exists) {
          throw new Error("Category already exists");
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
