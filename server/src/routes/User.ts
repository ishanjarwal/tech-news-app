import { Router } from "express";
import passport from "passport";
import { env } from "../config/env";
import {
  changeUserPassword,
  createUser,
  deleteCoverImage,
  deleteProfilePicture,
  fetchAuthor,
  loginUser,
  logoutUser,
  requestAuthorPrivilleges,
  resendOTP,
  resetPassword,
  sendPasswordResetEmail,
  updateUser,
  uploadCoverImage,
  uploadProfilePicture,
  userProfile,
  verifyEmail,
} from "../controllers/User";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import handleUpload from "../middlewares/handleUpload";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import uploadToCloudinary from "../middlewares/uploadToCloudinary";
import setAuthCookies from "../utils/auth/setAuthCookies";
import {
  validateCreateUser,
  validateEmail,
  validateLogin,
  validateOTP,
  validatePasswordChange,
  validatePasswordReset,
  validateUpdateUser,
} from "../validations/validateUser";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.use(responseHelper);

// regular user
router
  .post(
    "/",
    rateLimiter(1, 1),
    validateCreateUser,
    handleValidation,
    createUser
  )
  .post(
    "/verify-account",
    rateLimiter(1, 5),
    validateEmail,
    validateOTP,
    handleValidation,
    verifyEmail
  )
  .post(
    "/resend-otp",
    rateLimiter(2, 1, "Try again in 2 minutes"),
    validateEmail,
    handleValidation,
    resendOTP
  )
  .post(
    "/login",
    rateLimiter(1, 10),
    validateLogin,
    handleValidation,
    loginUser
  )
  .post(
    "/forgot-password",
    rateLimiter(1, 2),
    validateEmail,
    handleValidation,
    sendPasswordResetEmail
  )
  .post(
    "/reset-password/:token",
    rateLimiter(1, 5),
    validatePasswordReset,
    handleValidation,
    resetPassword
  )
  .get("/author/:username", rateLimiter(1, 10), fetchAuthor);

// auth user
router
  .get(
    "/me",
    rateLimiter(1, 25),
    accessTokenAutoRefresh,
    passportAuthenticate,
    userProfile
  )
  .get(
    "/logout",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    logoutUser
  )
  .post(
    "/change-password",
    rateLimiter(2, 1, "Try again in 2 minutes"),
    accessTokenAutoRefresh,
    passportAuthenticate,
    validatePasswordChange,
    handleValidation,
    changeUserPassword
  )
  .put(
    "/",
    rateLimiter(1, 10),
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateUpdateUser,
    handleValidation,
    updateUser
  )
  .post("/author-privilleges", rateLimiter(1, 1), requestAuthorPrivilleges)
  .post(
    "/upload-profile-picture",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    handleUpload(["image/jpeg", "image/jpg"], 2, "image"),
    handleValidation,
    uploadToCloudinary("user_profiles", "image", "user"),
    uploadProfilePicture
  )
  .post(
    "/upload-cover-image",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    handleUpload(["image/jpeg", "image/jpg"], 2, "image"),
    handleValidation,
    uploadToCloudinary("cover_images", "image", "cover"),
    uploadCoverImage
  )
  .delete(
    "/profile-picture",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    deleteProfilePicture
  )
  .delete(
    "/cover-image",
    rateLimiter(1, 5),
    accessTokenAutoRefresh,
    passportAuthenticate,
    deleteCoverImage
  );

//   google auth
router.get(
  "/google",
  rateLimiter(1, 5),
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  rateLimiter(1, 5),
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const {
      user,
      accessToken,
      accessTokenExpiry,
      refreshToken,
      refreshTokenExpiry,
    } = req.user as any;

    setAuthCookies(res, {
      accessToken,
      accessTokenExpiry,
      refreshToken,
      refreshTokenExpiry,
    });

    res.redirect(`${env.FRONTEND_HOST}/account/profile`);
  }
);

export default router;
