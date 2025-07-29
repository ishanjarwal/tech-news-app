"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Like_1 = require("../controllers/Like");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const accessByRole_1 = __importDefault(require("../middlewares/auth/accessByRole"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
// user routes
router
    .get("/", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, Like_1.fetchUserLikedPosts)
    .get("/status/:id", (0, rateLimiter_1.rateLimiter)(1, 255), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, Like_1.likedStatus)
    .get("/toggle/:id", (0, rateLimiter_1.rateLimiter)(1, 25), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, Like_1.togglePostLike);
// author routes
router.get("/likes/:id", (0, rateLimiter_1.rateLimiter)(1, 25), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), Like_1.fetchPostLikers);
exports.default = router;
