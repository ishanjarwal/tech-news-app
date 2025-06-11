import { body } from "express-validator";
import { isURL } from "validator";

export const validateNewTag = [
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
    .bail(),

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
