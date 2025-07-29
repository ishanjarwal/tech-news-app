"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryThumbnail = exports.uploadCategoryThumbnail = exports.deleteCategory = exports.updateCategory = exports.fetchCategory = exports.fetchCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const slugify_1 = __importDefault(require("../utils/slugify"));
const Post_1 = __importDefault(require("../models/Post"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// create category
const createCategory = async (req, res) => {
    try {
        const { name, summary } = req.body;
        const slug = (0, slugify_1.default)(name);
        const newCategory = new Category_1.default({
            name,
            slug,
            summary,
        });
        await newCategory.save();
        res.success(200, "success", "Category created", {
            categoryId: newCategory._id,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.createCategory = createCategory;
// fetch all categories
const fetchCategories = async (req, res) => {
    try {
        const sortField = req.query.sort || "created_at";
        const sortOrder = req.query.order === "desc" ? -1 : 1;
        const categories = await Category_1.default.find()
            .sort({ [sortField]: sortOrder })
            .select("-__v");
        const total = await Category_1.default.countDocuments();
        res.success(200, "success", "Categories fetched", categories);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.fetchCategories = fetchCategories;
// fetch category by slug
const fetchCategory = async (req, res) => {
    try {
        const slug = req.params.slug;
        const category = await Category_1.default.findOne({ slug }).select("-_id -__v");
        if (!category) {
            res.error(400, "warning", "Category not found", {});
            return;
        }
        res.success(200, "success", "Category fetched", category);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.fetchCategory = fetchCategory;
// update a category
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category_1.default.findById(id);
        if (!category) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        const updateFields = {
            ...(req.body.name && { name: req.body.name }),
            ...(req.body.summary && { summary: req.body.summary }),
            ...(req.body.name && { slug: (0, slugify_1.default)(req.body.name) }),
        };
        if (Object.keys(updateFields).length !== 0) {
            updateFields.updated_at = new Date(Date.now());
        }
        const updated = await Category_1.default.findByIdAndUpdate(id, updateFields, {
            new: true,
        }).select("-_id -__v");
        if (!updated) {
            res.error(400, "warning", "Category not found", null);
            return;
        }
        res.success(200, "success", "Category updated", updated);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.updateCategory = updateCategory;
// delete a category (only if posts for that category are 0)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category_1.default.findById(id);
        if (!category) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        const postCount = await Post_1.default.countDocuments({ category: id });
        if (postCount >= 0) {
            res.error(400, "warning", "This category cannot be deleted because it has posts associated with it", null);
            return;
        }
        const deleted = await Category_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.error(400, "error", "Invalid category", null);
            return;
        }
        res.success(200, "success", "Category deleted", null);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.deleteCategory = deleteCategory;
const uploadCategoryThumbnail = async (req, res) => {
    try {
        const id = req.params.id;
        const image = req.body.image;
        if (!image)
            throw new Error();
        const existing = await Category_1.default.findOne({ _id: id });
        if (!existing) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        if (existing.thumbnail?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(existing.thumbnail.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while uploading", {});
                return;
            }
        }
        const updated = await Category_1.default.findByIdAndUpdate(id, {
            $set: {
                thumbnail: {
                    public_id: image.public_id,
                    url: image.secure_url,
                    format: image.format,
                },
            },
        }, { new: true });
        res.success(200, "success", "Thumbnail uploaded", {});
        return;
    }
    catch (error) {
        if (req.body?.image?.public_id) {
            await cloudinary_1.default.uploader.destroy(req.body.image.public_id);
        }
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.uploadCategoryThumbnail = uploadCategoryThumbnail;
const deleteCategoryThumbnail = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await Category_1.default.findById(id);
        if (!existing) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        if (existing.thumbnail?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(existing.thumbnail.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while deleting", {});
                return;
            }
        }
        const post = await Category_1.default.findByIdAndUpdate(id, { $unset: { thumbnail: 1 } }, { new: true });
        res.success(200, "success", "Thumbnail removed", {});
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.deleteCategoryThumbnail = deleteCategoryThumbnail;
