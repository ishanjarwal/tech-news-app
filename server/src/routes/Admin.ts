import { Router } from "express";
import responseHelper from "../middlewares/responseHelper";
import {
  addFlagsToPost,
  grantAuthorPrivilleges,
  revokeAuthorPrivilleges,
} from "../controllers/AdminControls";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessByRole from "../middlewares/auth/accessByRole";
import { handleValidation } from "../middlewares/handleValidation";
import { body } from "express-validator";
import { POST_FLAGS } from "../constants/constants";

const router = Router();

router.use(responseHelper);

// approve/reject author write privilleges
router
  .get(
    "/grant-author/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    grantAuthorPrivilleges
  )
  .get(
    "/revoke-author/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    revokeAuthorPrivilleges
  )
  .post(
    "/post-flags/:id",
    accessTokenAutoRefresh,
    passportAuthenticate,
    accessByRole(["admin"]),
    body("flags").custom((value) => {
      if (!Array.isArray(value)) throw new Error("Invalid or missing");
      if (value.length > POST_FLAGS.length)
        throw new Error(`Maximum ${POST_FLAGS.length} flags are allowed`);
      const check = value.every((el) => POST_FLAGS.includes(el));
      if (!check) {
        throw new Error("Invalid flags");
      }
      return true;
    }),
    handleValidation,
    addFlagsToPost
  );

export default router;
