import express from "express";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  createTag,
  deleteTag,
  fetchTag,
  fetchTags,
  updateTag,
} from "../controllers/Tag";
import { validateNewTag, validateUpdateTag } from "../validations/validateTag";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchTags).get("/:slug", fetchTag);
// admin
router
  .post("/", validateNewTag, handleValidation, createTag)
  .put("/:id", validateUpdateTag, handleValidation, updateTag)
  .delete("/:id", deleteTag);

export default router;
