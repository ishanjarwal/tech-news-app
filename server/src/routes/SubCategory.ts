import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  fetchSubCategories,
  fetchSubCategoryBySlug,
  updateSubCategory,
} from "../controllers/SubCategory";
import responseHelper from "../middlewares/responseHelper";

const router = express.Router();

router.use(responseHelper);

// public routes
router
  .get("/:categoryId", fetchSubCategories)
  .get("/:categoryId/:slug", fetchSubCategoryBySlug);

// admin routes
router
  .post("/", createSubCategory)
  .put("/:id", updateSubCategory)
  .delete("/:id", deleteSubCategory);

export default router;
