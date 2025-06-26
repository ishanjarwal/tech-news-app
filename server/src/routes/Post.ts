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

const router = express.Router();

router.use(responseHelper);

// author routes
router
  .post(
    "/",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    validateNewPost,
    handleValidation,
    createPost
  )
  .get(
    "/myposts",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    fetchAuthorPosts
  )
  .patch(
    "/change-status/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    changePostStatus
  )
  .put(
    "/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    validateUpdatePost,
    handleValidation,
    updatePost
  )
  .post(
    "/thumbnail/:id",
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
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    deletePostThumbnail
  );

// public routes
router
  .get("/", fetchPosts)
  .get("/metadata/:slug", fetchPostMetaData)
  .get("/:slug", fetchPost);

export default router;
