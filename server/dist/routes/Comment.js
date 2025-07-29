"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Comment_1 = require("../controllers/Comment");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const validateComment_1 = require("../validations/validateComment");
const handleValidation_1 = require("../middlewares/handleValidation");
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
// public routes
router.get("/:id", (0, rateLimiter_1.rateLimiter)(1, 25), Comment_1.fetchPostComments);
// auth user
router
    .post("/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, validateComment_1.validateCreateComment, handleValidation_1.handleValidation, Comment_1.createComment)
    .post("/:parent_comment_id/:id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, validateComment_1.validateCreateComment, handleValidation_1.handleValidation, Comment_1.replyComment)
    .put("/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, validateComment_1.validateCreateComment, handleValidation_1.handleValidation, Comment_1.updateComment)
    .delete("/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, Comment_1.deleteComment);
exports.default = router;
