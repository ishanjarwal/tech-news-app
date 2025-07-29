"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.updateSubCategory = exports.fetchSubCategoryBySlug = exports.fetchSubCategories = exports.createSubCategory = void 0;
const SubCategory_1 = __importDefault(require("../models/SubCategory"));
const slugify_1 = __importDefault(require("../utils/slugify"));
const Post_1 = __importDefault(require("../models/Post"));
const Category_1 = __importDefault(require("../models/Category"));
// create subCategory
const createSubCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const { name, summary } = req.body;
        const slug = (0, slugify_1.default)(name);
        const newSubCategory = new SubCategory_1.default({
            name,
            slug,
            summary,
            category: categoryId,
        });
        await newSubCategory.save();
        res.success(200, "success", "Subcategory created", null);
    }
    catch (error) {
        res.error(500, "error", "Something went wrong", error);
    }
};
exports.createSubCategory = createSubCategory;
// fetch all subcategories for a category
const fetchSubCategories = async (req, res) => {
    try {
        const slug = req.params.slug;
        const category = await Category_1.default.findOne({ slug: slug });
        if (!category) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const subCategories = await SubCategory_1.default.find({
            category: category._id,
        })
            .populate({ path: "category", select: "-_id -__v" })
            .select("-__v -_id");
        res.success(200, "success", "Subcategories fetched", subCategories);
    }
    catch (error) {
        res.error(500, "error", "Something went wrong", error);
    }
};
exports.fetchSubCategories = fetchSubCategories;
// fetch subCategory by slug in a category
const fetchSubCategoryBySlug = async (req, res) => {
    try {
        const { slug, categorySlug } = req.params;
        const category = await Category_1.default.findOne({ slug: categorySlug });
        if (!category) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const subCategory = await SubCategory_1.default.findOne({
            slug,
            category: category._id,
        }).select("-__v");
        if (!subCategory) {
            res.error(404, "error", "Subcategory not found", null);
            return;
        }
        res.success(200, "success", "Subcategory fetched", {
            ...subCategory.toObject(),
            category: { name: category.name, slug: category.slug },
        });
        return;
    }
    catch (error) {
        res.error(500, "error", "Something went wrong", error);
        return;
    }
};
exports.fetchSubCategoryBySlug = fetchSubCategoryBySlug;
// update a subCategory in a category
const updateSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const subCategory = await SubCategory_1.default.findById(id);
        if (!subCategory) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const updateFields = {
            ...(req.body.name && { name: req.body.name }),
            ...(req.body.summary && { summary: req.body.summary }),
            ...(req.body.name && { slug: (0, slugify_1.default)(req.body.name) }),
        };
        if (Object.keys(updateFields).length > 0) {
            updateFields.updated_at = new Date(Date.now());
        }
        const updated = await SubCategory_1.default.findByIdAndUpdate(id, updateFields, {
            new: true,
        }).select("-__v -_id");
        if (!updated) {
            res.error(404, "error", "Subcategory not found", null);
            return;
        }
        res.success(200, "success", "Subcategory updated", updated);
        return;
    }
    catch (error) {
        res.error(500, "error", "Something went wrong", error);
        return;
    }
};
exports.updateSubCategory = updateSubCategory;
// delete a subCategory in a category (only if posts for that subCategory are 0)
const deleteSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const subCategory = await SubCategory_1.default.findById(id);
        if (!subCategory) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const postCount = await Post_1.default.countDocuments({ subCategory: id });
        if (postCount > 0) {
            res.error(400, "error", "This subcategory cannot be deleted because it has posts associated with it", null);
            return;
        }
        const deleted = await SubCategory_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.error(404, "error", "Subcategory not found", null);
            return;
        }
        res.success(200, "success", "Subcategory deleted", null);
        return;
    }
    catch (error) {
        res.error(500, "error", "Something went wrong", error);
        return;
    }
};
exports.deleteSubCategory = deleteSubCategory;
