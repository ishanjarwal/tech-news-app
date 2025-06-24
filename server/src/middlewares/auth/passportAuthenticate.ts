import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { UserValues } from "../../models/User";

const passportAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: UserValues | false, info: any) => {
      if (err || !user) {
        res.error(401, "error", "Unauthorized access", {});
        return;
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

export default passportAuthenticate;
