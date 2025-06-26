import { RequestHandler } from "express";
import { UserValues } from "../../models/User";
import { USER_ROLES } from "../../constants/constants";

const accessByRole =
  (allowed: (typeof USER_ROLES)[number][]): RequestHandler =>
  async (req, res, next) => {
    try {
      const user = req.user as UserValues;
      if (!user) throw new Error();

      const hasRole = allowed.some((role) => user.roles.includes(role));
      if (!hasRole) throw new Error();
      return next();
    } catch (error) {
      res.error(401, "error", "Unauthorized access", {});
      return;
    }
  };

export default accessByRole;
