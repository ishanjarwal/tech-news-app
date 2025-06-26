import { Router } from "express";
import responseHelper from "../middlewares/responseHelper";
import {
  grantAuthorPrivilleges,
  revokeAuthorPrivilleges,
} from "../controllers/AdminControls";
import accessTokenAutoRefresh from "../middlewares/auth/accessTokenAutoRefresh";
import passportAuthenticate from "../middlewares/auth/passportAuthenticate";
import accessByRole from "../middlewares/auth/accessByRole";

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
  );

export default router;
