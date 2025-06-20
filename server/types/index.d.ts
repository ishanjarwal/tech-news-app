import "express";

export type ResponseStatusValues =
  | "error"
  | "success"
  | "validation_error"
  | "warning";

declare global {
  namespace Express {
    interface Request {
      validationErrors: any[];
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
