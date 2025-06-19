import express from "express";
import {
  fetchAuthorFollowers,
  fetchUserFollowing,
  toggleFollow,
} from "../controllers/Follow";
import responseHelper from "../middlewares/responseHelper";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchUserFollowing);

// user routes
router.post("/:author_username", toggleFollow);

// author routes
router.get("/followers", fetchAuthorFollowers);

export default router;
