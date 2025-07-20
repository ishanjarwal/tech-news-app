import express from "express";
import {
  fetchAuthorFollowers,
  fetchUserFollowing,
  followStatus,
  removeFollow,
  toggleFollow,
} from "../controllers/Follow";
import responseHelper from "../middlewares/responseHelper";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import accessByRole from "../middlewares/auth/accessByRole";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get(
  "/",
  accessTokenAutoRefresh,
  passportAuthenticate,
  rateLimiter(1, 5),
  fetchUserFollowing
);

// user routes
router
  .post(
    "/:author_username",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    toggleFollow
  )
  .get(
    "/follow-status/:author_id",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    followStatus
  );

// author routes
router
  .get(
    "/followers",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    fetchAuthorFollowers
  )
  .get(
    "/remove/:username",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["author"]),
    removeFollow
  );

export default router;
