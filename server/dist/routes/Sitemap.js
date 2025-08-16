"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const Sitemap_1 = require("../controllers/Sitemap");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
router.get("/post-slugs", (0, rateLimiter_1.rateLimiter)(2, 10), Sitemap_1.fetchPostSlugs);
exports.default = router;
