"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../config/env");
const User_1 = require("../controllers/User");
const accessTokenAutoRefresh_1 = __importDefault(require("../middlewares/auth/accessTokenAutoRefresh"));
const passportAuthenticate_1 = __importDefault(require("../middlewares/auth/passportAuthenticate"));
const handleUpload_1 = __importDefault(require("../middlewares/handleUpload"));
const handleValidation_1 = require("../middlewares/handleValidation");
const responseHelper_1 = __importDefault(require("../middlewares/responseHelper"));
const uploadToCloudinary_1 = __importDefault(require("../middlewares/uploadToCloudinary"));
const setAuthCookies_1 = __importDefault(require("../utils/auth/setAuthCookies"));
const validateUser_1 = require("../validations/validateUser");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
router.use(responseHelper_1.default);
// regular user
router
    .post("/", (0, rateLimiter_1.rateLimiter)(1, 1), validateUser_1.validateCreateUser, handleValidation_1.handleValidation, User_1.createUser)
    .post("/verify-account", (0, rateLimiter_1.rateLimiter)(1, 5), validateUser_1.validateEmail, validateUser_1.validateOTP, handleValidation_1.handleValidation, User_1.verifyEmail)
    .post("/resend-otp", (0, rateLimiter_1.rateLimiter)(2, 1, "Try again in 2 minutes"), validateUser_1.validateEmail, handleValidation_1.handleValidation, User_1.resendOTP)
    .post("/login", (0, rateLimiter_1.rateLimiter)(1, 10), validateUser_1.validateLogin, handleValidation_1.handleValidation, User_1.loginUser)
    .post("/forgot-password", (0, rateLimiter_1.rateLimiter)(1, 2), validateUser_1.validateEmail, handleValidation_1.handleValidation, User_1.sendPasswordResetEmail)
    .post("/reset-password/:token", (0, rateLimiter_1.rateLimiter)(1, 5), validateUser_1.validatePasswordReset, handleValidation_1.handleValidation, User_1.resetPassword)
    .get("/authors", (0, rateLimiter_1.rateLimiter)(1, 25), User_1.fetchAuthors)
    .get("/author/:username", (0, rateLimiter_1.rateLimiter)(1, 10), User_1.fetchAuthor);
// auth user
router
    .get("/me", (0, rateLimiter_1.rateLimiter)(1, 25), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, User_1.userProfile)
    .get("/logout", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, User_1.logoutUser)
    .post("/change-password", (0, rateLimiter_1.rateLimiter)(2, 1, "Try again in 2 minutes"), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, validateUser_1.validatePasswordChange, handleValidation_1.handleValidation, User_1.changeUserPassword)
    .put("/", (0, rateLimiter_1.rateLimiter)(1, 10), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, validateUser_1.validateUpdateUser, handleValidation_1.handleValidation, User_1.updateUser)
    .post("/author-privilleges", (0, rateLimiter_1.rateLimiter)(1, 1), User_1.requestAuthorPrivilleges)
    .post("/upload-profile-picture", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, handleUpload_1.default)(["image/jpeg", "image/jpg"], 2, "image"), handleValidation_1.handleValidation, (0, uploadToCloudinary_1.default)("user_profiles", "image", "user"), User_1.uploadProfilePicture)
    .post("/upload-cover-image", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, (0, handleUpload_1.default)(["image/jpeg", "image/jpg"], 2, "image"), handleValidation_1.handleValidation, (0, uploadToCloudinary_1.default)("cover_images", "image", "cover"), User_1.uploadCoverImage)
    .delete("/profile-picture", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, User_1.deleteProfilePicture)
    .delete("/cover-image", (0, rateLimiter_1.rateLimiter)(1, 5), accessTokenAutoRefresh_1.default, passportAuthenticate_1.default, User_1.deleteCoverImage);
//   google auth
router.get("/google", (0, rateLimiter_1.rateLimiter)(1, 5), passport_1.default.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
}));
router.get("/google/callback", (0, rateLimiter_1.rateLimiter)(1, 5), passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/login",
}), (req, res) => {
    try {
        const { user, accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry, } = req.user;
        (0, setAuthCookies_1.default)(res, {
            accessToken,
            accessTokenExpiry,
            refreshToken,
            refreshTokenExpiry,
        });
        res.redirect(`${env_1.env.FRONTEND_HOST}/`);
    }
    catch (error) {
        console.log(error);
        res.redirect(`${env_1.env.FRONTEND_HOST}/error?code=google_auth_error`);
    }
});
exports.default = router;
