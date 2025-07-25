import express from "express";
import { fetchHomepageData } from "../controllers/Homepage";
import { rateLimiter } from "../middlewares/rateLimiter";
import responseHelper from "../middlewares/responseHelper";

const router = express.Router();

router.use(responseHelper);

router.get("/", rateLimiter(1, 5), fetchHomepageData);

export default router;
