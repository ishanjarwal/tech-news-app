import express from "express";
import {
  fetchPostLikers,
  fetchUserLikedPosts,
  togglePostLike,
} from "../controllers/Like";
import responseHelper from "../middlewares/responseHelper";
import accessByRole from "../middlewares/auth/accessByRole";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.use(responseHelper);

// user routes
router
  .get(
    "/",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    fetchUserLikedPosts
  )
  .get(
    "/toggle/:id",
    rateLimiter(1, 25),
    accessTokenAutoRefresh,
    passportAuthenticate,
    togglePostLike
  );

// author routes
router.get(
  "/likes/:id",
  rateLimiter(1, 25),
  accessTokenAutoRefresh,
  passportAuthenticate,
  accessByRole(["author"]),
  fetchPostLikers
);

export default router;
