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

const router = express.Router();

router.use(responseHelper);

// user routes
router
  .get("/", accessTokenAutoRefresh, passportAuthenticate, fetchUserLikedPosts)
  .get(
    "/toggle/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    togglePostLike
  );

// author routes
router.get(
  "/likes/:id",
  accessTokenAutoRefresh,
  passportAuthenticate,
  accessByRole(["author"]),
  fetchPostLikers
);

export default router;
