import express from "express";
import { createCategory } from "../controllers/Category";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import { validateNewCategory } from "../validations/validateCategory";

const router = express.Router();

router.use(responseHelper);

// public routes

// author routes
router.post("/", validateNewCategory, handleValidation, createCategory);

export default router;
