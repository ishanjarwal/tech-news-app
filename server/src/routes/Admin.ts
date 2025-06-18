import { Router } from "express";
import responseHelper from "../middlewares/responseHelper";
import {
  grantAuthorPrivilleges,
  revokeAuthorPrivilleges,
} from "../controllers/AdminControls";

const router = Router();

router.use(responseHelper);

// approve/reject author write privilleges
router
  .get("/grant-author", grantAuthorPrivilleges)
  .get("/revoke-author", revokeAuthorPrivilleges);

export default router;
