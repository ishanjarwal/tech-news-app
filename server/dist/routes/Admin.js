"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const AdminControls_1 = require("../controllers/AdminControls");
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const accessByRole_1 = __importDefault(require("../middlewares/auth/accessByRole"));
const handleValidation_1 = require("../middlewares/handleValidation");
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants/constants");
const router = (0, express_1.Router)();
router.use(responseHelper_1.default);
// approve/reject author write privilleges
router
    .get("/grant-author/:id", accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), AdminControls_1.grantAuthorPrivilleges)
    .get("/revoke-author/:id", accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), AdminControls_1.revokeAuthorPrivilleges)
    .post("/post-flags/:id", accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, accessByRole_1.default)(["admin"]), (0, express_validator_1.body)("flags").custom((value) => {
    if (!Array.isArray(value))
        throw new Error("Invalid or missing");
    if (value.length > constants_1.POST_FLAGS.length)
        throw new Error(`Maximum ${constants_1.POST_FLAGS.length} flags are allowed`);
    const check = value.every((el) => constants_1.POST_FLAGS.includes(el));
    if (!check) {
        throw new Error("Invalid flags");
    }
    return true;
}), handleValidation_1.handleValidation, AdminControls_1.addFlagsToPost);
exports.default = router;
