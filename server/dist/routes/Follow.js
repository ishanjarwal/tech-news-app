"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Follow_1 = require("../controllers/Follow");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const accessByRole_1 = __importDefault(require("../middlewares/auth/accessByRole"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
// public routes
router.get("/", accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, rateLimiter_1.rateLimiter)(1, 5), Follow_1.fetchUserFollowing);
// user routes
router
    .post("/:author_username", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, Follow_1.toggleFollow)
    .get("/follow-status/:author_id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, Follow_1.followStatus);
// author routes
router
    .get("/followers", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), Follow_1.fetchAuthorFollowers)
    .get("/remove/:username", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), Follow_1.removeFollow);
exports.default = router;
