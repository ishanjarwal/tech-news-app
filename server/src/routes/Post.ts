import express from "express";
import {
  changePostStatus,
  createPost,
  fetchPost,
  fetchPostMetaData,
  fetchPosts,
  fetchUserPosts,
  updatePost,
} from "../controllers/Post";
import responseHelper from "../middlewares/responseHelper";
import { validateNewPost } from "../validations/validatePost";
import { handleValidation } from "../middlewares/handleValidation";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchPosts);
router.get("/metadata/:slug", fetchPostMetaData);
router.get("/:slug", fetchPost);

// author routes
router.post("/", validateNewPost, handleValidation, createPost);
router.get("/myposts", fetchUserPosts);
router.patch("/change-status/:id", changePostStatus);
router.put("/:id", updatePost);
export default router;
