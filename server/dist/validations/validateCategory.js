"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCategory = exports.validateNewCategory = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("../utils/slugify"));
const Category_1 = __importDefault(require("../models/Category"));
const mongoose_1 = require("mongoose");
exports.validateNewCategory = [
    (0, express_validator_1.body)("name")
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
        .withMessage("Name must contain only alphabetic characters, spaces, or hyphens")
        .bail()
        .custom(async (value) => {
        try {
            const slug = (0, slugify_1.default)(value);
            const exists = await Category_1.default.findOne({ slug });
            if (exists) {
                throw new Error("Category already exists");
            }
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating category");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating category");
            }
        }
    }),
    (0, express_validator_1.body)("summary")
        .optional()
        .isString()
        .withMessage("Summary must be a string")
        .bail()
        .isLength({ max: 300 })
        .withMessage("Summary must be at most 300 characters long")
        .bail(),
];
exports.validateUpdateCategory = [
    (0, express_validator_1.body)("name")
        .optional()
        .bail()
        .isString()
        .withMessage("Name must be a string")
        .bail()
        .isLength({ max: 100 })
        .withMessage("Name must be at most 100 characters long")
        .bail()
        .matches(/^[A-Za-z\s\-]+$/)
        .withMessage("Name must contain only alphabetic characters, spaces, or hyphens")
        .bail()
        .custom(async (value) => {
        try {
            const slug = (0, slugify_1.default)(value);
            const exists = await Category_1.default.findOne({ slug });
            if (exists) {
                throw new Error("Category already exists");
            }
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating category");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating category");
            }
        }
    }),
    (0, express_validator_1.body)("summary")
        .optional()
        .isString()
        .withMessage("Summary must be a string")
        .bail()
        .isLength({ max: 300 })
        .withMessage("Summary must be at most 300 characters long")
        .bail(),
];
