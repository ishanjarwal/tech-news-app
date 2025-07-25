import express from "express";
import {
  changePostStatus,
  createPost,
  deletePostThumbnail,
  fetchAuthorPosts,
  fetchPagePosts,
  fetchPost,
  fetchPostById,
  fetchPostMetaData,
  fetchPosts,
  fetchTrendingPosts,
  updatePost,
  uploadContentImage,
  uploadPostThumbnail,
  uploadThumbnailTemporary,
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
  .get("/id/:id", rateLimiter(1, 25), fetchPostById)
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
    handleUpload(["image/jpeg", "image/jpg"], 2, "image"),
    handleValidation,
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
  )
  .post(
    "/thumbnail-temp",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    handleUpload(["image/jpeg", "image/jpg"], 2, "image"),
    handleValidation,
    uploadToCloudinary("post_thumbnails", "image", "thumbnail"),
    uploadThumbnailTemporary
  )
  .post(
    "/content-image",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    handleUpload(["image/jpeg", "image/jpg", "image/gif"], 2, "image"),
    handleValidation,
    uploadToCloudinary("content_images", "image", "content"),
    uploadContentImage
  );

// public routes
router
  .get("/", rateLimiter(1, 25), fetchPosts)
  .get("/page-posts", rateLimiter(1, 25), fetchPagePosts)
  .get("/trending", rateLimiter(1, 25), fetchTrendingPosts)
  .get("/metadata/:slug", rateLimiter(1, 25), fetchPostMetaData)
  .get("/:slug", rateLimiter(1, 25), fetchPost);

export default router;
