import express from "express";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import { createTag } from "../controllers/Tag";
import { validateNewTag } from "../validations/validateTag";

const router = express.Router();

router.use(responseHelper);

// public routes

// author routes
router.post("/", validateNewTag, handleValidation, createTag);

export default router;
