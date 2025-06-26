import express from "express";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  createTag,
  deleteTag,
  fetchTag,
  fetchTags,
  updateTag,
} from "../controllers/Tag";
import { validateNewTag, validateUpdateTag } from "../validations/validateTag";
import accessByRole from "../middlewares/auth/accessByRole";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchTags).get("/:slug", fetchTag);
// admin
router
  .post(
    "/",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateNewTag,
    handleValidation,
    createTag
  )
  .put(
    "/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateUpdateTag,
    handleValidation,
    updateTag
  )
  .delete(
    "/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    deleteTag
  );

export default router;
