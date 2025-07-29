"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = require("../controllers/Post");
const handleValidation_1 = require("../middlewares/handleValidation");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const validatePost_1 = require("../validations/validatePost");
const handleUpload_1 = __importDefault(require("../middlewares/handleUpload"));
const uploadToCloudinary_1 = __importDefault(require("../middlewares/uploadToCloudinary"));
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const accessByRole_1 = __importDefault(require("../middlewares/auth/accessByRole"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
// author routes
router
    .post("/", (0, rateLimiter_1.rateLimiter)(1, 1), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), validatePost_1.validateNewPost, handleValidation_1.handleValidation, Post_1.createPost)
    .get("/id/:id", (0, rateLimiter_1.rateLimiter)(1, 25), Post_1.fetchPostById)
    .get("/myposts", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), Post_1.fetchAuthorPosts)
    .patch("/change-status/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), Post_1.changePostStatus)
    .put("/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), validatePost_1.validateUpdatePost, handleValidation_1.handleValidation, Post_1.updatePost)
    .post("/thumbnail/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), validatePost_1.validateThumbnailUpload, (0, handleUpload_1.default)(["image/jpeg", "image/jpg"], 2, "image"), handleValidation_1.handleValidation, (0, uploadToCloudinary_1.default)("post_thumbnails", "image", "thumbnail"), Post_1.uploadPostThumbnail)
    .delete("/thumbnail/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), Post_1.deletePostThumbnail)
    .post("/thumbnail-temp", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), (0, handleUpload_1.default)(["image/jpeg", "image/jpg"], 2, "image"), handleValidation_1.handleValidation, (0, uploadToCloudinary_1.default)("post_thumbnails", "image", "thumbnail"), Post_1.uploadThumbnailTemporary)
    .post("/content-image", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), (0, handleUpload_1.default)(["image/jpeg", "image/jpg", "image/gif"], 2, "image"), handleValidation_1.handleValidation, (0, uploadToCloudinary_1.default)("content_images", "image", "content"), Post_1.uploadContentImage)
    .delete("/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["author"]), Post_1.deletePost);
// public routes
router
    .get("/", (0, rateLimiter_1.rateLimiter)(1, 25), Post_1.fetchPosts)
    .get("/page-posts", (0, rateLimiter_1.rateLimiter)(1, 25), Post_1.fetchPagePosts)
    .get("/trending", (0, rateLimiter_1.rateLimiter)(1, 25), Post_1.fetchTrendingPosts)
    .get("/metadata/:slug", (0, rateLimiter_1.rateLimiter)(1, 25), Post_1.fetchPostMetaData)
    .get("/:slug", (0, rateLimiter_1.rateLimiter)(1, 25), Post_1.fetchPost);
exports.default = router;
