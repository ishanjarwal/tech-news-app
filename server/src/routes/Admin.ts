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
  .get("/grant-author/:id", grantAuthorPrivilleges)
  .get("/revoke-author/:id", revokeAuthorPrivilleges);

export default router;
