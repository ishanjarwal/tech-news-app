import { RequestHandler } from "express";

const responseHelper: RequestHandler = (req, res, next) => {
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
};

export default responseHelper;
