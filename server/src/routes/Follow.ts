import express from "express";
import {
  fetchAuthorFollowers,
  fetchUserFollowing,
  toggleFollow,
} from "../controllers/Follow";
import responseHelper from "../middlewares/responseHelper";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import accessByRole from "../middlewares/auth/accessByRole";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchUserFollowing);

// user routes
router.post(
  "/:author_username",
  accessTokenAutoRefresh,
  passportAuthenticate,
  toggleFollow
);

// author routes
router.get(
  "/followers",
  accessTokenAutoRefresh,
  passportAuthenticate,
  accessByRole(["author"]),
  fetchAuthorFollowers
);

export default router;
