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

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/:id", fetchPostComments);
// auth user
router
  .post(
    "/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateCreateComment,
    handleValidation,
    createComment
  )
  .post(
    "/:parent_comment_id/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateCreateComment,
    handleValidation,
    replyComment
  )
  .put(
    "/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateCreateComment,
    handleValidation,
    updateComment
  )
  .delete("/:id", accessTokenAutoRefresh, passportAuthenticate, deleteComment);

export default router;
