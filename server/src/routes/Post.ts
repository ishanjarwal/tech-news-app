import express from "express";
import { fetchPosts } from "../controllers/Post";
import responseHelper from "../middlewares/responseHelper";

const router = express.Router();

router.use(responseHelper);

// public routes
router.get("/", fetchPosts);

// admin routes

export default router;
