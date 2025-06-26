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
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessByRole from "../middlewares/auth/accessByRole";

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
  );

export default router;
