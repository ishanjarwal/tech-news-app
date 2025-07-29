"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passportAuthenticate = async (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) {
            res.error(401, "error", "Unauthorized access", {});
            return;
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.default = passportAuthenticate;
