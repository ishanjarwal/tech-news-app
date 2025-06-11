import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const handleValidation: RequestHandler = (req, res, next): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.error(400, "validation_error", "Validation Failed", errors.array());
    return;
  }
  next();
};
