"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidation = void 0;
const express_validator_1 = require("express-validator");
const handleValidation = (req, res, next) => {
    const existingValidationErrors = req?.validationErrors;
    const errors = (0, express_validator_1.validationResult)(req).array();
    if (existingValidationErrors?.length > 0) {
        errors.push(...existingValidationErrors);
    }
    if (errors.length > 0) {
        res.error(400, "validation_error", "Validation Failed", errors);
        return;
    }
    next();
};
exports.handleValidation = handleValidation;
