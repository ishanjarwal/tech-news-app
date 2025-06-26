import express from "express";
import {
  changePostStatus,
  createPost,
  deletePostThumbnail,
  fetchAuthorPosts,
  fetchPost,
  fetchPostMetaData,
  fetchPosts,
  updatePost,
  uploadPostThumbnail,
} from "../controllers/Post";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  validateNewPost,
  validateThumbnailUpload,
  validateUpdatePost,
} from "../validations/validatePost";
import handleUpload from "../middlewares/handleUpload";
import uploadToCloudinary from "../middlewares/uploadToCloudinary";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessByRole from "../middlewares/auth/accessByRole";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.use(responseHelper);

// author routes
router
  .post(
    "/",
    rateLimiter(1, 1),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    validateNewPost,
    handleValidation,
    createPost
  )
  .get(
    "/myposts",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    fetchAuthorPosts
  )
  .patch(
    "/change-status/:id",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    changePostStatus
  )
  .put(
    "/:id",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    validateUpdatePost,
    handleValidation,
    updatePost
  )
  .post(
    "/thumbnail/:id",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    validateThumbnailUpload,
    handleValidation,
    handleUpload(["image/jpeg", "image/jpg"], 2, "image"),
    uploadToCloudinary("post_thumbnails", "image", "thumbnail"),
    uploadPostThumbnail
  )
  .delete(
    "/thumbnail/:id",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    deletePostThumbnail
  );

// public routes
router
  .get("/", rateLimiter(1, 25), fetchPosts)
  .get("/metadata/:slug", rateLimiter(1, 25), fetchPostMetaData)
  .get("/:slug", rateLimiter(1, 25), fetchPost);

export default router;
