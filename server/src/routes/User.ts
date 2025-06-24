import { Router } from "express";
import {
  changeUserPassword,
  createUser,
  loginUser,
  logoutUser,
  requestAuthorPrivilleges,
  resendOTP,
  resetPassword,
  sendPasswordResetEmail,
  updateUser,
  userProfile,
  verifyEmail,
} from "../controllers/User";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import { handleValidation } from "../middlewares/handleValidation";
import responseHelper from "../middlewares/responseHelper";
import {
  validateCreateUser,
  validateEmail,
  validateLogin,
  validateOTP,
  validatePasswordChange,
  validatePasswordReset,
  validateUpdateUser,
} from "../validations/validateUser";
import passport from "passport";
import setAuthCookies from "../utils/auth/setAuthCookies";
import { env } from "../config/env";

const router = Router();

router.use(responseHelper);

// regular user
router
  .post("/", validateCreateUser, handleValidation, createUser)
  .post(
    "/verify-account",
    validateEmail,
    validateOTP,
    handleValidation,
    verifyEmail
  )
  .post("/resend-otp", validateEmail, handleValidation, resendOTP)
  .post("/login", validateLogin, handleValidation, loginUser)
  .post(
    "/forgot-password",
    validateEmail,
    handleValidation,
    sendPasswordResetEmail
  )
  .post(
    "/reset-password/:token",
    validatePasswordReset,
    handleValidation,
    resetPassword
  );
// auth user
router
  .get("/me", accessTokenAutoRefresh, passportAuthenticate, userProfile)
  .get("/logout", accessTokenAutoRefresh, passportAuthenticate, logoutUser)
  .post(
    "/change-password",
    accessTokenAutoRefresh,
    passportAuthenticate,
    validatePasswordChange,
    handleValidation,
    changeUserPassword
  )
  .put(
    "/",
    accessTokenAutoRefresh,
    passportAuthenticate,
    validateUpdateUser,
    handleValidation,
    updateUser
  )
  .post("/author-privilleges", requestAuthorPrivilleges);

//   google auth
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
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
