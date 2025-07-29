"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Homepage_1 = require("../controllers/Homepage");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const router = express_1.default.Router();
router.use(responseHelper_1.default);
router.get("/", (0, rateLimiter_1.rateLimiter)(1, 5), Homepage_1.fetchHomepageData);
exports.default = router;
