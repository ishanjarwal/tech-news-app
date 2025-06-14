import express from "express";
import {
  changePostStatus,
  createPost,
  fetchAuthorPosts,
  fetchPost,
  fetchPostMetaData,
  fetchPosts,
  fetchPostsByTag,
  updatePost,
} from "../controllers/Post";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import { validateNewPost } from "../validations/validatePost";

const router = express.Router();

router.use(responseHelper);

// public routes
router
  .get("/", fetchPosts)
  .get("/metadata/:slug", fetchPostMetaData)
  .get("/:slug", fetchPost)
  .get("/tag/:tag", fetchPostsByTag);

// author routes
router.post("/", validateNewPost, handleValidation, createPost);
router.get("/myposts", fetchAuthorPosts);
router.patch("/change-status/:id", changePostStatus);
router.put("/:id", updatePost);
export default router;
