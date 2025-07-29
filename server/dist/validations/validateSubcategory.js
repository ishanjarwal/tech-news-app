"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateSubcategory = exports.validateCreateSubcategory = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const Category_1 = __importDefault(require("../models/Category"));
const SubCategory_1 = __importDefault(require("../models/SubCategory"));
const slugify_1 = __importDefault(require("../utils/slugify"));
exports.validateCreateSubcategory = [
    (0, express_validator_1.param)("categoryId").custom(async (id, { req }) => {
        try {
            const category = await Category_1.default.findById(id);
            if (!category) {
                throw new Error("Invalid category");
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
        .custom(async (value, { req }) => {
        try {
            const slug = (0, slugify_1.default)(value);
            const exists = await SubCategory_1.default.findOne({
                slug,
                category: req.params?.categoryId,
            });
            if (exists) {
                throw new Error("Subcategory already exists");
            }
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating Subcategory");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating Subcategory");
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
exports.validateUpdateSubcategory = [
    (0, express_validator_1.param)("id").custom(async (id, { req }) => {
        try {
            const subCategory = await SubCategory_1.default.findById(id);
            if (!subCategory) {
                throw new Error("Invalid Subcategory");
            }
            req.body.categoryId = subCategory.category;
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating Subcategory");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating Subcategory");
            }
        }
    }),
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
        .custom(async (value, { req }) => {
        try {
            const slug = (0, slugify_1.default)(value);
            const exists = await SubCategory_1.default.findOne({
                slug,
                category: req.body?.categoryId,
            });
            if (exists) {
                throw new Error("A subcategory with the same name already exists in this category");
            }
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating Subcategory");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating Subcategory");
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
