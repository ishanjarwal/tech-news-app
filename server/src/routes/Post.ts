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

const router = express.Router();

router.use(responseHelper);

// author routes
router
  .post("/", validateNewPost, handleValidation, createPost)
  .get("/myposts", fetchAuthorPosts)
  .patch("/change-status/:id", changePostStatus)
  .put("/:id", validateUpdatePost, handleValidation, updatePost)
  .post(
    "/thumbnail/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
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
    deletePostThumbnail
  );

// public routes
router
  .get("/", fetchPosts)
  .get("/metadata/:slug", fetchPostMetaData)
  .get("/:slug", fetchPost);

export default router;
