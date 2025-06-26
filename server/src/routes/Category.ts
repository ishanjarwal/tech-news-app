import express from "express";
import {
  createCategory,
  deleteCategory,
  deleteCategoryThumbnail,
  fetchCategories,
  fetchCategory,
  updateCategory,
  uploadCategoryThumbnail,
} from "../controllers/Category";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  validateNewCategory,
  validateUpdateCategory,
} from "../validations/validateCategory";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessByRole from "../middlewares/auth/accessByRole";
import handleUpload from "../middlewares/handleUpload";
import uploadToCloudinary from "../middlewares/uploadToCloudinary";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchCategories).get("/:slug", fetchCategory);

// admin routes
router
  .post(
    "/",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateNewCategory,
    handleValidation,
    createCategory
  )
  .put(
    "/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateUpdateCategory,
    handleValidation,
    updateCategory
  )
  .delete(
    "/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    deleteCategory
  )
  .post(
    "/thumbnail/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    handleUpload(["image/jpeg", "image/jpg", "image/png"], 0.5, "image"),
    handleValidation,
    uploadToCloudinary("category_thumbnails", "image", "category"),
    uploadCategoryThumbnail
  )
  .delete(
    "/thumbnail/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    deleteCategoryThumbnail
  );

export default router;
