"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOTP = exports.validatePasswordReset = exports.validatePasswordChange = exports.validateLogin = exports.validateEmail = exports.validateUpdateUser = exports.validateCreateUser = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const locale_codes_1 = __importDefault(require("locale-codes"));
const validateLinks = (name) => (0, express_validator_1.body)(name)
    .optional()
    .isString()
    .withMessage(`Invalid ${name} link`)
    .isURL({ require_protocol: true })
    .withMessage("Must be a valid URL")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Max 100 characters");
const validatePassword = (name) => (0, express_validator_1.body)(name)
    .trim()
    .notEmpty()
    .withMessage("Please enter your password")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Password must be atmost 50 characters long")
    .bail()
    .matches(/^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|]{8,100}$/)
    .withMessage("Password must not contain spaces");
exports.validateCreateUser = [
    (0, express_validator_1.body)("username")
        .exists({ checkFalsy: true })
        .withMessage("Username is required")
        .bail()
        .isString()
        .withMessage("Invalid username")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Max length is 50 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username must be alphanumeric and can contain underscores only")
        .custom(async (value) => {
        try {
            const exists = await User_1.default.findOne({ username: value });
            if (exists) {
                throw new Error("Username is taken, try another");
            }
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating username");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating username");
            }
        }
    }),
    (0, express_validator_1.body)("fullname")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ max: 100 })
        .withMessage("Full name must be at most 100 characters")
        .matches(/^[\p{L}]+(?:\s[\p{L}]+){0,2}$/u)
        .withMessage("Full name must contain only letters and at most two words (separated by spaces)"),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isLength({ max: 100 })
        .withMessage("Email must be at most 100 characters")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail()
        .custom(async (email) => {
        try {
            const exists = await User_1.default.findOne({ email });
            if (exists) {
                throw new Error("Email is already registered");
            }
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating email");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating email");
            }
        }
    }),
    validatePassword("password"),
];
exports.validateUpdateUser = [
    (0, express_validator_1.body)("username")
        .optional()
        .bail()
        .isString()
        .withMessage("Invalid username")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Max length is 50 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username must be alphanumeric and can contain underscores only")
        .custom(async (value) => {
        try {
            const exists = await User_1.default.findOne({ username: value });
            if (exists) {
                throw new Error("Username is taken, try another");
            }
            return true;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error("Error validating username");
            }
            else if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Error validating username");
            }
        }
    }),
    (0, express_validator_1.body)("fullname")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Full name must be at most 100 characters")
        .matches(/^[\p{L}]+(?:\s[\p{L}]+){0,2}$/u)
        .withMessage("Full name must contain only letters and at most two words (separated by spaces)"),
    (0, express_validator_1.body)("bio")
        .optional()
        .isString()
        .withMessage("Invalid Bio")
        .bail()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Max limit is 500 characters"),
    validateLinks("github"),
    validateLinks("instagram"),
    validateLinks("youtube"),
    validateLinks("facebook"),
    validateLinks("linkedin"),
    validateLinks("x"),
    validateLinks("threads"),
    (0, express_validator_1.body)("websites")
        .optional()
        .isArray({ max: 3 })
        .withMessage("you can add at most 3 websites"),
    (0, express_validator_1.body)("websites.*")
        .notEmpty()
        .withMessage("Website URLs cannot be empty")
        .isString()
        .withMessage("Website URLs must be strings")
        .isLength({ max: 100 }),
    (0, express_validator_1.body)("theme")
        .optional()
        .isIn(constants_1.PREFERENCES_THEMES)
        .withMessage("Invalid theme value"),
    (0, express_validator_1.body)("language")
        .optional()
        .custom((language) => {
        const result = locale_codes_1.default.getByTag(language);
        if (!result) {
            throw new Error("Invalid language code");
        }
        return true;
    }),
    (0, express_validator_1.body)("newsletter")
        .optional()
        .toBoolean()
        .isBoolean()
        .withMessage("Invalid value"),
];
exports.validateEmail = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Please provide your email address")
        .bail()
        .isEmail()
        .withMessage("Invalid email address")
        .bail()
        .normalizeEmail(),
];
exports.validateLogin = [
    (0, express_validator_1.body)("email_username")
        .trim()
        .notEmpty()
        .withMessage("Please provide your email or username")
        .isLength({ max: 100 })
        .withMessage("Max 100 characters")
        .bail(),
    validatePassword("password"),
];
exports.validatePasswordChange = [
    validatePassword("password"),
    validatePassword("old_password"),
    (0, express_validator_1.body)("password_confirmation")
        .trim()
        .notEmpty()
        .withMessage("Please enter confirmation password")
        .bail()
        .custom((value, { req }) => {
        if (!req.body.password)
            throw new Error("Password is required before confirmation");
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),
];
exports.validatePasswordReset = [
    validatePassword("password"),
    (0, express_validator_1.body)("password_confirmation")
        .trim()
        .notEmpty()
        .withMessage("Please provide password confirmation")
        .bail()
        .custom((value, { req }) => {
        if (!req.body.password)
            throw new Error("Password is required before confirmation");
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),
];
exports.validateOTP = [
    (0, express_validator_1.body)("otp")
        .trim()
        .notEmpty()
        .withMessage("Please enter OTP")
        .bail()
        .isLength({ min: 4, max: 4 })
        .withMessage("OTP must be exactly 4 digits")
        .bail()
        .isNumeric()
        .withMessage("OTP must contain only numbers"),
];
