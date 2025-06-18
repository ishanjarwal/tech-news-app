import { Router } from "express";
import responseHelper from "../middlewares/responseHelper";
import { requestAuthorPrivilleges } from "../controllers/User";

const router = Router();

router.use(responseHelper);

// regular user

// auth user
router.post("/author-privilleges", requestAuthorPrivilleges);

export default router;
