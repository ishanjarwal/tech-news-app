import { body, param } from "express-validator";

export const validateCreateComment = [
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must be at least 1 character long.")
    .isLength({ max: 250 })
    .withMessage("Content must be at most 250 characters long."),
];
