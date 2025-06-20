import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  fetchSubCategories,
  fetchSubCategoryBySlug,
  updateSubCategory,
} from "../controllers/SubCategory";
import responseHelper from "../middlewares/responseHelper";
import {
  validateCreateSubcategory,
  validateUpdateSubcategory,
} from "../validations/validateSubcategory";
import { handleValidation } from "../middlewares/handleValidation";

const router = express.Router();

router.use(responseHelper);

// public routes
router
  .get("/:slug", fetchSubCategories)
  .get("/:categorySlug/:slug", fetchSubCategoryBySlug);

// admin routes
router
  .post(
    "/:categoryId",
    validateCreateSubcategory,
    handleValidation,
    createSubCategory
  )
  .put("/:id", validateUpdateSubcategory, handleValidation, updateSubCategory)
  .delete("/:id", deleteSubCategory);

export default router;
