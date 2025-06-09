import { NextFunction, Request, Response } from "express";

export function responseHelper(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = (
    statusCode: number,
    status: string,
    message: string,
    data: any
  ) => {
    return res.status(statusCode).json({ status, message, data });
  };
  res.error = (
    statusCode: number,
    status: string,
    message: string,
    error: any
  ) => {
    return res.status(statusCode).json({ status, message, error });
  };

  next();
}
