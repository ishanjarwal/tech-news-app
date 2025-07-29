"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SubCategory_1 = require("../controllers/SubCategory");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const validateSubcategory_1 = require("../validations/validateSubcategory");
const handleValidation_1 = require("../middlewares/handleValidation");
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const accessByRole_1 = __importDefault(require("../middlewares/auth/accessByRole"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
// public routes
router
    .get("/:slug", (0, rateLimiter_1.rateLimiter)(1, 100), SubCategory_1.fetchSubCategories)
    .get("/:categorySlug/:slug", (0, rateLimiter_1.rateLimiter)(1, 100), SubCategory_1.fetchSubCategoryBySlug);
// admin routes
router
    .post("/:categoryId", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), validateSubcategory_1.validateCreateSubcategory, handleValidation_1.handleValidation, SubCategory_1.createSubCategory)
    .put("/:id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), validateSubcategory_1.validateUpdateSubcategory, handleValidation_1.handleValidation, SubCategory_1.updateSubCategory)
    .delete("/:id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), SubCategory_1.deleteSubCategory);
exports.default = router;
