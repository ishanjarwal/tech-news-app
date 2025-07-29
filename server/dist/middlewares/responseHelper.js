"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper = (req, res, next) => {
    res.success = (statusCode, status, message, data) => {
        return res.status(statusCode).json({ status, message, data });
    };
    res.error = (statusCode, status, message, error) => {
        return res.status(statusCode).json({ status, message, error });
    };
    next();
};
exports.default = responseHelper;
