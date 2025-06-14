import express from "express";
import {
  fetchAuthorFollowers,
  fetchUserFollowing,
  followAuthor,
  unfollowAuthor,
} from "../controllers/Follow";
import responseHelper from "../middlewares/responseHelper";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchUserFollowing);

// user routes
router
  .post("/:author_username", followAuthor)
  .delete("/:author_username", unfollowAuthor);

// author routes
router.get("/followers", fetchAuthorFollowers);

export default router;
