import express from "express";
import { createPost, fetchPosts } from "../controllers/Post";
import responseHelper from "../middlewares/responseHelper";
import { validateNewPost } from "../validations/validatePost";
import { handleValidation } from "../middlewares/handleValidation";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchPosts);

// author routes
router.post("/", validateNewPost, handleValidation, createPost);

export default router;
