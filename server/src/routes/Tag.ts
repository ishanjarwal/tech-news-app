import express from "express";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  createTag,
  deleteTag,
  fetchTag,
  fetchTags,
  searchTag,
  updateTag,
} from "../controllers/Tag";
import { validateNewTag, validateUpdateTag } from "../validations/validateTag";
import accessByRole from "../middlewares/auth/accessByRole";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.use(responseHelper);

// public routes
router
  .get("/", rateLimiter(1, 100), fetchTags)
  .get("/:slug", rateLimiter(1, 100), fetchTag)
  .get("/search/:q", rateLimiter(1, 100), searchTag);
// admin
router
  .post(
    "/",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateNewTag,
    handleValidation,
    createTag
  )
  .put(
    "/:id",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    validateUpdateTag,
    handleValidation,
    updateTag
  )
  .delete(
    "/:id",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    deleteTag
  );

export default router;
