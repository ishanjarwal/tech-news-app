import express from "express";
import {
  fetchPostLikers,
  fetchUserLikedPosts,
  togglePostLike,
} from "../controllers/Like";
import responseHelper from "../middlewares/responseHelper";

const router = express.Router();

router.use(responseHelper);

// user routes
router.get("/", fetchUserLikedPosts).get("/toggle/:id", togglePostLike);

// author routes
router.get("/likes/:id", fetchPostLikers);

export default router;
