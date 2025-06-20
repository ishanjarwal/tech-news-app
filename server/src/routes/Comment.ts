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

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/:id", fetchPostComments);
// auth user
router
  .post("/:id", validateCreateComment, handleValidation, createComment)
  .post(
    "/:parent_comment_id/:id",
    validateCreateComment,
    handleValidation,
    replyComment
  )
  .put("/:id", validateCreateComment, handleValidation, updateComment)
  .delete("/:id", deleteComment);

export default router;
