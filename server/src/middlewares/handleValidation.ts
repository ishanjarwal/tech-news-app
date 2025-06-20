import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const handleValidation: RequestHandler = (req, res, next): void => {
  const existingValidationErrors = req.validationErrors;
  const errors = validationResult(req).array();
  if (existingValidationErrors.length > 0) {
    errors.push(...existingValidationErrors);
  }
  if (errors.length > 0) {
    res.error(400, "validation_error", "Validation Failed", errors);
    return;
  }
  next();
};
