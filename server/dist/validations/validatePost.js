"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateThumbnailUpload = exports.validateUpdatePost = exports.validateNewPost = void 0;
const express_validator_1 = require("express-validator");
const Tag_1 = __importDefault(require("../models/Tag"));
const Category_1 = __importDefault(require("../models/Category"));
const SubCategory_1 = __importDefault(require("../models/SubCategory"));
const validator_1 = require("validator");
const slugify_1 = __importDefault(require("../utils/slugify"));
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = require("mongoose");
const is_html_1 = __importDefault(require("is-html"));
exports.validateNewPost = [
    (0, express_validator_1.body)("title")
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
            const slug = (0, slugify_1.default)(value);
            const found = await Post_1.default.findOne({ slug });
            if (found)
                throw new Error("Post with same title already exists");
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating title");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating title");
            }
        }
    }),
    (0, express_validator_1.body)("summary")
        .exists({ checkFalsy: true })
        .withMessage("Summary is required")
        .bail()
        .isString()
        .withMessage("Invalid summary")
        .bail()
        .isLength({ max: 300 })
        .withMessage("Max length is 300 characters")
        .bail(),
    (0, express_validator_1.body)("content")
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
        if (!(0, is_html_1.default)(value)) {
            throw new Error("Invalid format");
        }
        return true;
    })
        .bail(),
    (0, express_validator_1.body)("tags")
        .custom(async (tags, { req }) => {
        try {
            if (!Array.isArray(tags))
                throw new Error("Invalid or missing tags");
            if (tags.length < 5)
                throw new Error("Minimum 5 tags are required");
            if (tags.length > 20)
                throw new Error("Maximum 20 tags are allowed");
            const existing = await Tag_1.default.find({ slug: { $in: tags } }).select("slug");
            const foundSlugs = existing.map((tag) => tag.slug);
            const missing = tags.filter((slug) => !foundSlugs.includes(slug));
            if (missing.length > 0) {
                throw new Error(`Invalid Tags : ${missing.join(", ")}`);
            }
            req.body.tagIds = existing.map((el) => el._id);
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating tags");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating tags");
            }
        }
    })
        .bail(),
    (0, express_validator_1.body)("category")
        .exists({ checkFalsy: true })
        .withMessage("Category is required")
        .bail()
        .isString()
        .withMessage("Invalid category")
        .bail()
        .custom(async (slug, { req }) => {
        try {
            const category = await Category_1.default.findOne({ slug });
            if (!category)
                throw new Error("Category not found");
            req.body.categoryId = category._id;
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
    })
        .bail(),
    (0, express_validator_1.body)("subCategory")
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
            const subCategory = await SubCategory_1.default.findOne({
                slug,
                category: categoryId,
            });
            if (!subCategory) {
                throw new Error("SubCategory not found or does not belong to the specified category");
            }
            req.body.subCategoryId = subCategory._id;
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating subcategory");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating subcategory");
            }
        }
    })
        .bail(),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["published", "draft"])
        .withMessage("Invalid status value")
        .bail(),
    (0, express_validator_1.body)("thumbnail")
        .optional()
        .custom((value) => {
        if (typeof value !== "object" || Array.isArray(value) || value === null) {
            throw new Error("Thumbnail must be an object");
        }
        const { public_id, url, format } = value;
        if (typeof public_id !== "string" || !public_id.trim()) {
            throw new Error("thumbnail public_id must be a non-empty string");
        }
        if (typeof url !== "string" || !(0, validator_1.isURL)(url)) {
            throw new Error("thumbnail url must be a valid URL");
        }
        const allowedFormats = ["jpeg", "jpg", "png"];
        if (!allowedFormats.includes(format)) {
            throw new Error(`thumbnail format must be one of ${allowedFormats.join(", ")}`);
        }
        return true;
    }),
];
exports.validateUpdatePost = [
    (0, express_validator_1.body)("title")
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
            const slug = (0, slugify_1.default)(value);
            const found = await Post_1.default.findOne({ slug });
            if (found)
                throw new Error("Post with same title already exists");
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating title");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating title");
            }
        }
    }),
    (0, express_validator_1.body)("summary")
        .optional()
        .bail()
        .isString()
        .withMessage("Invalid summary")
        .bail()
        .isLength({ max: 300 })
        .withMessage("Max length is 300 characters")
        .bail(),
    (0, express_validator_1.body)("content")
        .optional()
        .bail()
        .isString()
        .withMessage("Invalid content format")
        .bail()
        .isLength({ min: 100, max: 20000 })
        .withMessage("Content must be between 100 and 20,000 characters")
        .bail()
        .custom((value) => {
        if (!(0, is_html_1.default)(value)) {
            throw new Error("Invalid format");
        }
        return true;
    })
        .bail(),
    (0, express_validator_1.body)("tags")
        .optional()
        .custom(async (tags, { req }) => {
        try {
            if (!Array.isArray(tags))
                throw new Error("Invalid or missing tags");
            if (tags.length < 5)
                throw new Error("Minimum 5 tags are required");
            if (tags.length > 20)
                throw new Error("Maximum 20 tags are allowed");
            const existing = await Tag_1.default.find({ slug: { $in: tags } }).select("slug");
            const foundSlugs = existing.map((tag) => tag.slug);
            const missing = tags.filter((slug) => !foundSlugs.includes(slug));
            if (missing.length > 0) {
                throw new Error(`Invalid Tags : ${missing.join(", ")}`);
            }
            req.body.tagIds = existing.map((el) => el._id);
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating tags");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating tags");
            }
        }
    })
        .bail(),
    (0, express_validator_1.body)("category")
        .optional()
        .bail()
        .isString()
        .withMessage("Invalid category")
        .bail()
        .custom(async (slug, { req }) => {
        try {
            const category = await Category_1.default.findOne({ slug });
            if (!category)
                throw new Error("Category not found");
            req.body.categoryId = category._id;
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
    })
        .bail(),
    (0, express_validator_1.body)("subCategory")
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
            const subCategory = await SubCategory_1.default.findOne({
                slug,
                category: categoryId,
            });
            if (!subCategory) {
                throw new Error("SubCategory not found or does not belong to the specified category");
            }
            req.body.subCategoryId = subCategory._id;
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating subcategory");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating subcategory");
            }
        }
    })
        .bail(),
];
exports.validateThumbnailUpload = [
    (0, express_validator_1.param)("id").custom(async (id, { req }) => {
        try {
            const check = await Post_1.default.findOne({ _id: id, author_id: req.user._id });
            if (!check)
                throw new Error("Invalid request");
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("validation error");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("validation error");
            }
        }
    }),
];
