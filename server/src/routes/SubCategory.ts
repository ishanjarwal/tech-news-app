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
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessByRole from "../middlewares/auth/accessByRole";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.use(responseHelper);

// public routes
router
  .get("/:slug", rateLimiter(1, 100), fetchSubCategories)
  .get("/:categorySlug/:slug", rateLimiter(1, 100), fetchSubCategoryBySlug);

// admin routes
router
  .post(
    "/:categoryId",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateCreateSubcategory,
    handleValidation,
    createSubCategory
  )
  .put(
    "/:id",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateUpdateSubcategory,
    handleValidation,
    updateSubCategory
  )
  .delete(
    "/:id",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    deleteSubCategory
  );

export default router;
