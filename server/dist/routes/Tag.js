"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleValidation_1 = require("../middlewares/handleValidation");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const Tag_1 = require("../controllers/Tag");
const validateTag_1 = require("../validations/validateTag");
const accessByRole_1 = __importDefault(require("../middlewares/auth/accessByRole"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = express_1.default.Router();
router.use(responseHelper_1.default);
// public routes
router
    .get("/", (0, rateLimiter_1.rateLimiter)(1, 100), Tag_1.fetchTags)
    .get("/popular", (0, rateLimiter_1.rateLimiter)(1, 100), Tag_1.fetchPopularTags)
    .get("/search/:q", (0, rateLimiter_1.rateLimiter)(1, 100), Tag_1.searchTag)
    .get("/:slug", (0, rateLimiter_1.rateLimiter)(1, 100), Tag_1.fetchTag);
// admin
router
    .post("/", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), validateTag_1.validateNewTag, handleValidation_1.handleValidation, Tag_1.createTag)
    .put("/:id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), validateTag_1.validateUpdateTag, handleValidation_1.handleValidation, Tag_1.updateTag)
    .delete("/:id", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), Tag_1.deleteTag);
exports.default = router;
