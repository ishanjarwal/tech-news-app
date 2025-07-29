"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateComment = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateComment = [
    (0, express_validator_1.body)("content")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Content must be at least 1 character long.")
        .isLength({ max: 250 })
        .withMessage("Content must be at most 250 characters long."),
];
