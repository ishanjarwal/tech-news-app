"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const rateLimiter = (window, // window size in minutes
maxAttempts, // max number of allowed requests
message = "Too many requests, please try again in some time" // custom message on limit exceed
) => {
    return ((req, res, next) => {
        next();
    });
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
exports.rateLimiter = rateLimiter;
