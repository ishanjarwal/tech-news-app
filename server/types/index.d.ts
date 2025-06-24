import "express";
import { UserValues } from "../src/models/User";
import { Document } from "mongoose";

export type ResponseStatusValues =
  | "error"
  | "success"
  | "validation_error"
  | "warning";

declare global {
  namespace Express {
    interface Request {
      validationErrors: any[];
      user?: UserValues;
    }
    interface Response {
      success: (
        statusCode: number,
        status: ResponseStatusValues,
        message: string,
        data: any
      ) => this;
      error: (
        statusCode: number,
        status: ResponseStatusValues,
        message: string,
        error: any
      ) => this;
    }
  }
}
