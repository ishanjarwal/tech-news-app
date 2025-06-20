import express from "express";
import {
  changePostStatus,
  createPost,
  fetchAuthorPosts,
  fetchPost,
  fetchPostMetaData,
  fetchPosts,
  updatePost,
} from "../controllers/Post";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  validateNewPost,
  validateUpdatePost,
} from "../validations/validatePost";

const router = express.Router();

router.use(responseHelper);

// author routes
router
  .post("/", validateNewPost, handleValidation, createPost)
  .get("/myposts", fetchAuthorPosts)
  .patch("/change-status/:id", changePostStatus)
  .put("/:id", validateUpdatePost, handleValidation, updatePost);

// public routes
router
  .get("/", fetchPosts)
  .get("/metadata/:slug", fetchPostMetaData)
  .get("/:slug", fetchPost);

export default router;
