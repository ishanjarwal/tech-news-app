import express from "express";
import responseHelper from "../middlewares/responseHelper";
import { fetchPostSlugs } from "../controllers/Sitemap";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.use(responseHelper);

router.get("/post-slugs", rateLimiter(2, 10), fetchPostSlugs);

export default router;
