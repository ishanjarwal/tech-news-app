// middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
import { Request, RequestHandler, Response } from "express";

export const rateLimiter = (
  window: number, // window size in minutes
  maxAttempts: number, // max number of allowed requests
  message: string = "Too many requests, please try again in some time" // custom message on limit exceed
) => {
  return ((req, res, next) => {
    next();
  }) as RequestHandler;
  // return rateLimit({
  //   windowMs: window * 1000 * 60,
  //   max: maxAttempts,
  //   standardHeaders: true,
  //   legacyHeaders: false,
  //   handler: (req: Request, res: Response) => {
  //     res.error(429, "error", "Too many requests, Please try in some time", {});
  //     return;
  //   },
  // });
};
