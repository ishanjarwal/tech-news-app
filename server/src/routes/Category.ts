import express from "express";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
} from "../controllers/Category";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  validateNewCategory,
  validateUpdateCategory,
} from "../validations/validateCategory";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchCategories).get("/:slug", fetchCategory);

// admin routes
router
  .post("/", validateNewCategory, handleValidation, createCategory)
  .put("/:id", validateUpdateCategory, handleValidation, updateCategory)
  .delete("/:id", deleteCategory);

export default router;
