import express from "express";
import {
  createComment,
  deleteComment,
  fetchPostComments,
  replyComment,
  updateComment,
} from "../controllers/Comment";
import responseHelper from "../middlewares/responseHelper";
import { validateCreateComment } from "../validations/validateComment";
import { handleValidation } from "../middlewares/handleValidation";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/:id", rateLimiter(1, 25), fetchPostComments);

// auth user
router
  .post(
    "/:id",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateCreateComment,
    handleValidation,
    createComment
  )
  .post(
    "/:parent_comment_id/:id",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateCreateComment,
    handleValidation,
    replyComment
  )
  .put(
    "/:id",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateCreateComment,
    handleValidation,
    updateComment
  )
  .delete(
    "/:id",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    deleteComment
  );

export default router;
