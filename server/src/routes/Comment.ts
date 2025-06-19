import express from "express";
import {
  createComment,
  deleteComment,
  fetchPostComments,
  replyComment,
  updateComment,
} from "../controllers/Comment";
import responseHelper from "../middlewares/responseHelper";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/:id", fetchPostComments);
// auth user
router
  .post("/:id", createComment)
  .post("/:parent_comment_id/:id", replyComment)
  .put("/:id", updateComment)
  .delete("/:id", deleteComment);

export default router;
