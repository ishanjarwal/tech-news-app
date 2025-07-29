"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Category_1 = require("../controllers/Category");
const handleValidation_1 = require("../middlewares/handleValidation");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const validateCategory_1 = require("../validations/validateCategory");
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const accessByRole_1 = __importDefault(require("../middlewares/auth/accessByRole"));
const handleUpload_1 = __importDefault(require("../middlewares/handleUpload"));
const uploadToCloudinary_1 = __importDefault(require("../middlewares/uploadToCloudinary"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
// public routes
router
    .get("/", (0, rateLimiter_1.rateLimiter)(1, 100), Category_1.fetchCategories)
    .get("/:slug", (0, rateLimiter_1.rateLimiter)(1, 100), Category_1.fetchCategory);
// admin routes
router
    .post("/", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), validateCategory_1.validateNewCategory, handleValidation_1.handleValidation, Category_1.createCategory)
    .put("/:id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), validateCategory_1.validateUpdateCategory, handleValidation_1.handleValidation, Category_1.updateCategory)
    .delete("/:id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), Category_1.deleteCategory)
    .post("/thumbnail/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), (0, handleUpload_1.default)(["image/jpeg", "image/jpg", "image/png"], 0.5, "image"), handleValidation_1.handleValidation, (0, uploadToCloudinary_1.default)("category_thumbnails", "image", "category"), Category_1.uploadCategoryThumbnail)
    .delete("/thumbnail/:id", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), Category_1.deleteCategoryThumbnail);
exports.default = router;
